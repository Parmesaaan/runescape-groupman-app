<script setup lang="ts">
import {useStore} from "../../stores";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {Task, TaskType} from "../../models";
import {ref} from "vue";
import {formatDateTime, isTaskAvailable} from "../../utils";

const store = useStore()
const profile = store.profile!
const tasks = profile.user.tasks

const markTaskCompleted = (task: Task): void => {

}

const editTask = (task: Task): void => {

}

const op = ref()
const popoverContent = ref("")
const togglePopover = (event, description) => {
  popoverContent.value = description ?? "This task has no description"
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
</script>

<template>
  <DataTable :value="tasks" class="w-full">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl font-bold">Your Tasks</span>
        <Button label="Refresh" icon="pi pi-refresh" class="p-button-sm" raised disabled />
      </div>
    </template>
    <Column field="title" header="Task" />
    <Column>
      <template #body="slotProps">
        <Button icon="pi pi-info-circle" class="p-button-text p-button-sm" @click="togglePopover($event, slotProps.data.description)"/>
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
        <Button icon="pi pi-pencil" class="p-button-sm mr-2" outlined disabled @click="editTask(slotProps.data as Task)" />
        <Button label="Done" icon="pi pi-check" class="p-button-sm" outlined :disabled="slotProps.data.status === 'Completed' || true" @click="markTaskCompleted(slotProps.data as Task)" />
      </template>
    </Column>
  </DataTable>

  <OverlayPanel ref="op">
    <p>{{ popoverContent }}</p>
  </OverlayPanel>
</template>

<style scoped>

</style>