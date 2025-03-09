<script setup lang="ts">
import {useStore} from "../../stores"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Popover from "primevue/popover"
import {Task} from "../../models"
import {computed, ref} from "vue"
import {formatDateTime, isTaskAvailable} from "../../utils";
import {BackendService} from "../../services";

const store = useStore()
const tasks = computed(() => store.getProfile().user.tasks)

const op = ref()
const popoverContents = ref("")
const toggleDescription = (event, task) => {
  popoverContents.value = task.description ?? "This task has no description"
  op.value.toggle(event)
}

const getStatusValue = (task: Task): string => {
  const isAvailable = isTaskAvailable(task)
  return isAvailable  ? 'Incomplete' : 'Completed'
}

const getStatusSeverity = (task: Task): string => {
  const isAvailable = isTaskAvailable(task)
  return isAvailable ? 'danger' : 'success'
}

const refreshTasks = async () => {
  await store.updateProfile()
  op.value.hide()
}

const newTask = async () => {
  // TODO: Create new task
}

const editTask = async (task: Task) => {
  // TODO: Edit task
}

const completedTask = async (event, task) => {
  try {
    await BackendService.updateTask(task.id, {
      completed: true
    })
    await store.updateProfile()
    op.value.hide()
  } catch (e) {
    popoverContents.value = "Error marking task as completed"
    op.value.toggle(event)
  }
}
</script>

<template>
  <DataTable :value="tasks" class="flex-auto">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl font-bold">Your Tasks ({{ tasks.length }})</span>
        <span>
          <Button label="New Task" icon="pi pi-plus" class="p-button-sm mr-2" @click="newTask" raised />
          <Button label="Refresh" icon="pi pi-refresh" class="p-button-sm" @click="refreshTasks" raised />
        </span>
      </div>
    </template>
    <Column field="title" header="Task" />
    <Column>
      <template #body="slotProps">
        <Button icon="pi pi-info-circle" class="p-button-text p-button-sm" @click="toggleDescription($event, slotProps.data)"/>
      </template>
    </Column>
    <Column field="taskType" header="Type">
      <template #body="slotProps">
        <Tag :value="slotProps.data.taskType" severity="secondary"/>
      </template>
    </Column>
    <Column field="lastCompleted" header="Last done">
      <template #body="slotProps">
        <span>{{ slotProps.data.lastCompleted ? formatDateTime(slotProps.data.lastCompleted) : 'Never' }}</span>
      </template>
    </Column>
    <Column header="Status">
      <template #body="slotProps">
        <Tag :value="getStatusValue(slotProps.data)" :severity="getStatusSeverity(slotProps.data)" />
      </template>
    </Column>
    <Column>
      <template #body="slotProps">
        <Button icon="pi pi-pencil" class="p-button-sm mr-2" outlined disabled @click="editTask(slotProps.data)" />
        <Button label="Done" icon="pi pi-check" class="p-button-sm" outlined :disabled="getStatusValue(slotProps.data) === 'Completed'" @click="completedTask($event, slotProps.data)" />
      </template>
    </Column>
  </DataTable>
  <Popover ref="op">
    <p>{{ popoverContents }}</p>
  </Popover>
</template>

<style scoped>
</style>