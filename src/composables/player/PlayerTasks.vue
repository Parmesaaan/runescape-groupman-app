<script setup lang="ts">
import {useStore} from "../../stores";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {formatDateTime, isTaskAvailable} from "../../utils";
import {Task} from "../../models";

const store = useStore()
const profile = store.profile!
const tasks = profile.user.tasks.map(t => {
  return {
    title: t.title,
    status: isTaskAvailable(t) ? 'Incomplete' : 'Completed',
    lastCompleted: t.lastCompleted ? formatDateTime(t.lastCompleted.toString()) : "Never",
    taskType: t.taskType.toString()
  }
})

const markTaskCompleted = (task: Task): void => {

}

const editTask = (task: Task): void => {

}
</script>

<template>
  <DataTable :value="tasks">
    <Column field="title" header="Task"/>
    <Column field="taskType" header="Type"/>
    <Column field="status" header="Status">
      <template #body="slotProps">
        <Tag :value="slotProps.data.status" :severity="slotProps.data.status === 'Completed' ? 'success' : 'danger'" />
      </template>
    </Column>
    <Column field="lastCompleted" header="Last Completed"/>
    <Column>
      <template #body="slotProps">
        <Button label="Done" icon="pi pi-check" outlined :disabled="slotProps.data.status === 'Completed'" class="mr-2" @click="markTaskCompleted(slotProps.data as Task)" />
        <Button icon="pi pi-pencil" outlined @click="editTask(slotProps.data as Task)" />
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>

</style>