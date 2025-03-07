<script setup lang="ts">
import {useStore} from "../stores";
import Listbox from 'primevue/listbox'
import Card from 'primevue/card'
import {ref, watch} from "vue";
import {formatDateTime} from "../utils";
import {UserNote} from "../models";

const store = useStore()
const profile = store.profile

const notes = ref(profile?.user.notes || [])
let selectedNote = ref<UserNote | undefined>(profile?.user.notes[0])

const getNoteFooter = (createdAt?: Date, updatedAt?: Date): string => {
  if (!createdAt) return ""
  const created = formatDateTime(createdAt.toString())

  if (!updatedAt || updatedAt === createdAt) return created.toString()
  const updated = formatDateTime(updatedAt.toString())
  return created.concat(` (${updated.toString()})`)
}

let noteTitle = ref<string>(selectedNote.value?.title || "")
let noteContents = ref<string>(selectedNote.value?.contents || "")
let noteFooter = ref<string>(getNoteFooter(selectedNote.value?.createdAt, selectedNote.value?.updatedAt))

watch(selectedNote, (newNote) => {
  noteTitle.value = newNote?.title ?? ""
  noteContents.value = newNote?.contents ?? ""
  noteFooter.value = getNoteFooter(newNote?.createdAt, newNote?.updatedAt)
});
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <div class="col-start-1 col-end-1">
      <div class="flex flex-col">
        <h1 class="text-lg text-center">Select a note</h1>
        <Listbox v-model="selectedNote" :options="notes" option-label="title" class="w-full mt-2"/>
      </div>
    </div>
    <div class="flex col-start-2 col-end-4">
      <Card class="w-full h-full bg-gray-700 flex flex-col">
        <template #title>{{ noteTitle }}</template>
        <template #content>
          <div class="flex-1">
            {{ noteContents }}
          </div>
        </template>
        <template #footer>
          <div class="mt-auto">
            {{ noteFooter }}
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
</style>