<script setup lang="ts">
import ScrollPanel from 'primevue/scrollpanel';
import PanelMenu from 'primevue/panelmenu';
import {useStore} from "../../stores";
import {computed, ref} from "vue";
import type {MenuItem} from "primevue/menuitem";
import {UserNote} from "../../models";
import {formatDateTime} from "../../utils";

const store = useStore()
const notes = computed(() => store.getProfile().user.notes)

const selectedNote = ref<UserNote>()

const menuItems = computed<MenuItem[]>(() => {
  return notes.value.map(n => {
    return {
      label: formatTitle(n.title),
      command: () => selectedNote.value = n
    }
  })
})

const formatDate = (date: Date): string => {
  if (!date) return 'Never'
  return formatDateTime(date.toString())
}

const formatTitle = (name: string, max: number = 24): string => {
  if (name.length < max) return name
  return name.substring(0,max).concat('...')
}

const refreshNotes = async () => {
  await store.updateProfile()
  selectedNote.value = null
}

const newNote = async () => {
  // TODO: Create new note
}

const editNote = async () => {
  // TODO: Edit note
}
</script>

<template>
  <div class="flex flex-row w-full overflow-hidden">
    <div class="flex flex-column items-center gap-2 min-w-[30%] max-w-[30%] max-h-100">
      <span class="text-xl font-bold mt-2">Your Notes</span>
      <Divider layout="horizontal"/>
      <p v-if="!notes.length" class="flex flex-grow justify-center text-center">You don't have any notes</p>
      <ScrollPanel class="w-full h-full pr-3">
        <PanelMenu :model="menuItems"/>
      </ScrollPanel>
    </div>
    <Divider layout="vertical"/>
    <div class="flex flex-column flex-grow gap-2">
      <div class="flex flex-wrap items-center justify-between">
        <span>
          <Button label="New Note" icon="pi pi-plus" class="p-button-sm mr-2" @click="newNote" raised />
          <Button label="Edit Note" icon="pi pi-pencil" class="p-button-sm mr-2" :disabled="!selectedNote" @click="editNote" raised   />
        </span>
        <Button label="Refresh" icon="pi pi-refresh" class="p-button-sm" @click="refreshNotes"  raised />
      </div>
      <p v-if="!selectedNote" class="flex flex-grow items-center justify-center text-xl">No note selected</p>
      <div v-if="selectedNote" class="flex flex-grow bg-gray-700 rounded-xl overflow-hidden">
        <div class="flex flex-column flex-grow gap-2 m-4">
          <div class="note-title text-2xl font-bold">{{ selectedNote.title }}</div>
          <div class="note-subtitle text-gray-400">Created {{ formatDate(selectedNote.createdAt) }}</div>
          <div class="note-contents mt-3 line-height-2">{{ selectedNote.contents }}</div>
          <div class="note-footer text-gray-400 text-sm gap-2">
            <p>by {{ store.getProfile().user.username }}</p>
            <p v-if="selectedNote.updatedAt != selectedNote.createdAt">Edited {{ formatDate(selectedNote.updatedAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.note-subtitle {
  font-size: 1rem;
}

.note-contents {
  font-size: 1rem;
}

.note-footer {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
</style>