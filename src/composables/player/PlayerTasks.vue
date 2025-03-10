<script setup lang="ts">
import {useStore} from "../../stores"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import { FilterMatchMode } from '@primevue/core/api'
import {Task, TaskType} from "../../models"
import {computed, onMounted, ref} from "vue"
import {formatDateTime, isTaskAvailable} from "../../utils"
import {BackendService} from "../../services"
import {useToast} from "primevue/usetoast"

enum TaskStatus {
  COMPLETED = 'Completed',
  INCOMPLETE = 'Incomplete',
}

const store = useStore()
const toast = useToast()

const tasks = computed(() => {
  return store.getProfile().user.tasks.map(task => ({
    ...task,
    status: getStatusValue(task)
  }))
  .sort((a, b) => {
    // Define the order for task types
    const taskTypeOrder = { 'DAILY': 1, 'WEEKLY': 2, 'MONTHLY': 3 }

    // Compare task types first
    const typeComparison = taskTypeOrder[a.taskType] - taskTypeOrder[b.taskType]
    if (typeComparison !== 0) return typeComparison

    // If task types are the same, sort alphabetically by title
    return a.title.localeCompare(b.title)
  })
})
const expandedRows = ref()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  taskType: { value: null, matchMode: FilterMatchMode.EQUALS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
})
const statuses = ref([TaskStatus.INCOMPLETE, TaskStatus.COMPLETED])
const taskTypes = ref([TaskType.DAILY, TaskType.WEEKLY, TaskType.MONTHLY])
const loading = ref(true)

onMounted(() => {
  loading.value = false
})

const getStatusValue = (task: Task): string => {
  const isAvailable = isTaskAvailable(task)
  return isAvailable  ? TaskStatus.INCOMPLETE : TaskStatus.COMPLETED
}

const getStatusSeverity = (taskStatus: TaskStatus): string => {
  return taskStatus === TaskStatus.INCOMPLETE ? 'danger' : 'success'
}

const refreshTasks = async () => {
  loading.value = true
  await store.updateProfile()
  loading.value = false
}

const newTask = async () => {
  // TODO: Create new task
}

const editTask = async (task: Task) => {
  // TODO: Edit task
}

const deleteTask = async (task: Task) => {
  // TODO: Delete task
}

const completedTask = async (event, task) => {
  try {
    await BackendService.updateTask(task.id, {
      completed: true
    })
    await store.updateProfile()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error marking task as completed',
      life: 3000
    })
  }
}
</script>

<template>
  <div class="flex flex-grow">
    <DataTable
        :value="tasks"
        v-model:filters="filters"
        v-model:expandedRows="expandedRows"
        dataKey="id"
        selectionMode="single"
        :metaKeySelection="false"
        scrollable
        scrollHeight="flex"
        filterDisplay="menu"
        :globalFilterFields="['title', 'taskType', 'status']"
        :loading="loading"
        class="flex-grow"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Your Tasks ({{ tasks.length }})</span>
          <span>
            <Button label="New Task" icon="pi pi-plus" class="p-button-sm mr-2" @click="newTask" outlined raised />
            <Button label="Refresh" icon="pi pi-refresh" class="p-button-sm" @click="refreshTasks" outlined raised />
          </span>
        </div>
      </template>
      <template #loading>
        <div class="flex flex-column text-center gap-1">
          <p class="text-lg">Loading your tasks</p>
          <ProgressSpinner/>
        </div>
      </template>
      <template #empty>
        <p class="text-center">You don't have any tasks.</p>
      </template>
      <Column expander />
      <Column field="title" header="Task"/>
      <Column field="taskType" header="Type">
        <template #body="slotProps">
          <Tag :value="slotProps.data.taskType" severity="secondary"/>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="taskTypes" placeholder="Select One" style="min-width: 12rem" showClear>
            <template #option="slotProps">
              <Tag :value="slotProps.option" severity="secondary" />
            </template>
          </Select>
        </template>
      </Column>
      <Column field="status" header="Status" bodyStyle="text-align:center" headerStyle="text-align:center">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Select One" style="min-width: 12rem" showClear>
            <template #option="slotProps">
              <Tag :value="slotProps.option" :severity="getStatusSeverity(slotProps.option)" />
            </template>
          </Select>
        </template>
      </Column>
      <Column bodyStyle="text-align:right">
        <template #header="slotProps">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Search" class="max-w-[200px]"/>
          </IconField>
        </template>
        <template #body="slotProps">
          <Button icon="pi pi-trash" class="p-button-sm mr-2" severity="danger" outlined @click="deleteTask(slotProps.data)" />
          <Button icon="pi pi-pencil" class="p-button-sm mr-2" outlined @click="editTask(slotProps.data)" />
          <Button label="Done" icon="pi pi-check" class="p-button-sm" :disabled="getStatusValue(slotProps.data) === 'Completed'" @click="completedTask($event, slotProps.data)" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="flex flex-column flex-grow p-4 gap-2 border-2 border-gray-700 rounded-xl">
          <h1 class="font-bold line-height-2">{{ slotProps.data.title }}</h1>
          <span class="mt-2 line-height-2">
              <p v-if="slotProps.data.description">{{ slotProps.data.description }}</p>
              <p v-if="!slotProps.data.description" class="text-gray-400">This task has no description.</p>
            </span>
          <p class="text-gray-400 text-sm mt-2 line-height-1">Last completed: {{ slotProps.data.lastCompleted ? formatDateTime(slotProps.data.lastCompleted) : 'Never' }}</p>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
</style>