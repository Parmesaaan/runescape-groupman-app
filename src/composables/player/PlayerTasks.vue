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
import {useConfirm} from "primevue";
import FloatLabel from "primevue/floatlabel";

enum TaskStatus {
  COMPLETED = 'Completed',
  INCOMPLETE = 'Incomplete',
}

const store = useStore()
const toast = useToast()
const confirm = useConfirm()

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
const selectedTaskSafe = computed(() => selectedTask.value ?? {
  title: null,
  description: null,
  taskType: null
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
const dialogVisible = ref<boolean>(false)
const selectedTask = ref<Task>()
const loading = ref(false)

const resolver = (data) => {
  const values = data.values
  const newMode = !selectedTask.value
  const errors = {
    title: [],
    description: [],
    taskType: [],
  }

  if (newMode && !values.title) errors.title.push({ message: 'Task title is required.'})
  if (newMode && !values.taskType) errors.taskType.push({ message: 'Task type is required.'})

  if (values.title) {
    if (values.title.length > 24) errors.title.push({ message: 'Task title cannot exceed 24 characters' })
  }

  return {
    values,
    errors
  }
}

const onFormSubmit = async (form) => {
  if (form.valid) {
    dialogVisible.value = false
    loading.value = true

    if (selectedTask.value) {
      const updates = {
        title: form.values.title,
        description: form.values.description,
        taskType: form.values.taskType
      }
      const result = await BackendService.updateTask(selectedTask.value.id, updates)
      if (result) {
        toast.add({
          severity: 'info',
          summary: `Updated task: ${selectedTask.value.title}`,
          life: 3000
        })
        await refreshTasks()
      } else {
        toast.add({
          severity: 'error',
          summary: `Error updating task: ${selectedTask.value.title}`,
          life: 3000
        })
      }
    } else {
      const result = await BackendService.createTask(form.values.taskType, form.values.title, form.values.description)
      if (result) {
        toast.add({
          severity: 'info',
          summary: `Created task: ${form.values.title}`,
          life: 3000
        })
        await refreshTasks()
      } else {
        toast.add({
          severity: 'error',
          summary: `Error updating task: ${form.values.title}`,
          life: 3000
        })
      }
    }

    loading.value = false
  }
}


const getStatusValue = (task: Task): string => {
  const isAvailable = isTaskAvailable(task)
  return isAvailable  ? TaskStatus.INCOMPLETE : TaskStatus.COMPLETED
}

const getStatusSeverity = (taskStatus: TaskStatus): string => {
  return taskStatus === TaskStatus.INCOMPLETE ? 'danger' : 'success'
}

const getDialogHeader = (): string => {
  return selectedTask.value ? 'Edit '.concat(selectedTask.value.title) : 'Create Task'
}

const refreshTasks = async () => {
  loading.value = true
  await store.updateProfile()
  loading.value = false
}

const newTask = async () => {
  selectedTask.value = undefined
  dialogVisible.value = true
}

const editTask = async (task: Task) => {
  selectedTask.value = task
  dialogVisible.value = true
}

const deleteTask = async (task: Task) => {
  confirm.require({
    header: 'Are you sure?',
    message: `You are about to delete task ${task.title}`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: async () => {
      loading.value = true
      const result = await BackendService.deleteTask(task.id)
      if (result) {
        toast.add({
          severity: 'info',
          summary: `Deleted task: ${task.title}`,
          life: 3000
        })
        await refreshTasks()
      } else {
        toast.add({
          severity: 'error',
          summary: `Error deleting task: ${task.title}`,
          life: 3000
        })
      }
      loading.value = false
    },
    reject: () => {

    }
  })
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
    <ConfirmDialog/>
    <Toast/>
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
          <h1 class="font-bold text-lg line-height-2">{{ slotProps.data.title }}</h1>
          <span class="mt-1 line-height-2">
              <span v-if="slotProps.data.description">{{ slotProps.data.description }}</span>
              <span v-if="!slotProps.data.description" class="text-gray-400">This task has no description.</span>
            </span>
          <p class="text-gray-400 text-sm mt-2 line-height-1">Last completed: {{ slotProps.data.lastCompleted ? formatDateTime(slotProps.data.lastCompleted) : 'Never' }}</p>
        </div>
      </template>
    </DataTable>
    <Dialog v-model:visible="dialogVisible" :header="getDialogHeader()" modal>
      <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col w-full">
        <div class="flex flex-col gap-2 p-2">
          <div class="flex flex-col line-height-2 gap-2">
            <span>Title</span>
            <InputText id="title" name="title" type="text" size="small" v-model="selectedTaskSafe.title" fluid />
            <Message v-if="$form.title?.invalid" severity="error" variant="simple" :life="3000">{{ $form.title.error?.message }}</Message>
          </div>
          <div class="flex flex-col line-height-2 gap-2">
            <span>Type</span>
            <Select id="taskType" name="taskType" type="text" v-model="selectedTaskSafe.taskType" :options="taskTypes" optionValue="" placeholder="Select One" style="min-width: 12rem">
              <template #option="slotProps">
                <Tag :value="slotProps.option" severity="secondary" />
              </template>
            </Select>
            <Message v-if="$form.taskType?.invalid" severity="error" size="small" variant="simple" :life="3000">{{ $form.taskType.error?.message }}</Message>
          </div>
          <div class="flex flex-col line-height-2 gap-2">
            <span>Description</span>
            <Textarea id="description" name="description" v-model="selectedTaskSafe.description" rows="5" cols="30" style="resize: none; width: 30vh; min-width: 200px; line-height: 1.4" fluid autoResize />
          </div>
          <Button type="submit" severity="primary" label="Confirm" class="p-button-lg mt-2"/>
        </div>
      </Form>
    </Dialog>
  </div>
</template>

<style scoped>
</style>