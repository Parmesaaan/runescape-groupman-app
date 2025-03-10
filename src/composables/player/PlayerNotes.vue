<script setup lang="ts">
import ScrollPanel from 'primevue/scrollpanel'
import PanelMenu from 'primevue/panelmenu'
import {useStore} from "../../stores"
import {computed, ref} from "vue"
import type {MenuItem} from "primevue/menuitem"
import {UserNote} from "../../models"
import {formatDateTime} from "../../utils"
import {useConfirm} from "primevue"
import {useToast} from "primevue/usetoast"
import {BackendService} from "../../services"

const store = useStore()
const toast = useToast()
const confirm = useConfirm()

const notes = computed(() => {
  let notes = store.getProfile().user.notes
  notes = filterNotes(notes)
  return sortNotes(notes)
})
const menuItems = computed<MenuItem[]>(() => {
  return notes.value.map(n => {
    return {
      label: formatTitle(n.title, 16),
      createdAt: formatDate(n.createdAt),
      icon: 'pi pi-file',
      command: () => selectedNote.value = n
    }
  })
})
const selectedNote = ref<UserNote>()
const selectedNoteSafe = computed(() => selectedNote.value ?? {
  title: null,
  contents: null
})
const dialogVisible = ref<boolean>(false)
const filter = ref<string>()

const resolver = (data) => {
  const values = data.values
  const newMode = !selectedNote.value
  const errors = {
    title: [],
    contents: [],
  }

  if (newMode && !values.title) errors.title.push({ message: 'Title is required.'})
  if (newMode && !values.contents) errors.contents.push({ message: 'Contents is required.'})

  if (values.title) {
    if (values.title.length > 24) errors.title.push({ message: 'Note title cannot exceed 24 characters' })
  }

  return {
    values,
    errors
  }
}

const onFormSubmit = async (form) => {
  if (form.valid) {
    dialogVisible.value = false
    if (selectedNote.value) {
      const updates = {
        title: form.values.title,
        contents: form.values.contents
      }
      const result = await BackendService.updateUserNote(selectedNote.value.id, updates)
      if (result) {
        toast.add({
          severity: 'info',
          summary: `Updated note: ${selectedNote.value.title}`,
          life: 3000
        })
        await refreshNotes()
        selectedNote.value = result as UserNote
      } else {
        toast.add({
          severity: 'error',
          summary: `Error updating note: ${selectedNote.value.title}`,
          life: 3000
        })
      }
    } else {
      const result = await BackendService.createUserNote(form.values.title, form.values.contents)
      if (result) {
        toast.add({
          severity: 'info',
          summary: `Created note: ${form.values.title}`,
          life: 3000
        })
        await refreshNotes()
        selectedNote.value = result as UserNote
      } else {
        toast.add({
          severity: 'error',
          summary: `Error updating note: ${form.values.title}`,
          life: 3000
        })
      }
    }
  }
}

const filterNotes = (notes: UserNote[]): UserNote[] => {
  if (!filter.value) return notes
  return notes.filter(n => n.title.includes(filter.value))
}

const sortNotes = (notes: UserNote[]): UserNote[] => {
  return notes.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()

    if (dateA !== dateB) {
      return dateB - dateA
    }

    return a.title.localeCompare(b.title)
  })
}

const formatDate = (date: Date): string => {
  if (!date) return 'Never'
  return formatDateTime(date.toString())
}

const formatTitle = (name: string, max: number = 24): string => {
  if (name.length < max) return name
  return name.substring(0,max).concat('...')
}

const getDialogHeader = (): string => {
  return selectedNote.value ? 'Edit '.concat(selectedNote.value.title) : 'Create Note'
}

const refreshNotes = async () => {
  selectedNote.value = undefined
  await store.updateProfile()
}

const createNote = async () => {
  selectedNote.value = undefined
  dialogVisible.value = true
}

const editNote = async () => {
  dialogVisible.value = true
}

const deleteNote = async () => {
  confirm.require({
    header: 'Are you sure?',
    message: `You are about to delete note ${selectedNote.value?.title}`,
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
      const result = await BackendService.deleteUserNote(selectedNote.value?.id)
      if (result) {
        toast.add({
          severity: 'info',
          summary: `Deleted note: ${selectedNote.value?.title}`,
          life: 3000
        })
        await refreshNotes()
      } else {
        toast.add({
          severity: 'error',
          summary: `Error deleting note: ${selectedNote.value?.title}`,
          life: 3000
        })
      }
    },
    reject: () => {

    }
  })
}
</script>

<template>
  <div class="flex flex-row w-full overflow-hidden">
    <ConfirmDialog/>
    <Toast/>
    <div class="flex flex-column items-center gap-2 min-w-[30%] max-w-[30%] max-h-100">
      <span class="text-xl font-bold">Your Notes ({{ notes.length }})</span>
      <Divider layout="horizontal"/>
      <div class="flex items-center w-full max-w-[80%] mb-2">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filter" placeholder="Search" class="max-w-[80%]"/>
        </IconField>
      </div>
      <p v-if="!notes.length" class="flex flex-grow justify-center text-center">No notes here</p>
      <div class="flex justify-center w-[100%]">
        <ScrollPanel class="w-full h-full">
          <PanelMenu :model="menuItems">
            <template #item="{ item }">
              <a class="flex items-center px-1 py-2 cursor-pointer group text-white line-height-1 max-h-[30px]">
                <span class="mr-1 overflow-hidden overflow-ellipsis max-w-[60%]">{{ item.label }}</span>
                <span class="text-gray-400 text-xs ml-auto">{{ item.createdAt }}</span>
              </a>
            </template>
          </PanelMenu>
        </ScrollPanel>
      </div>
    </div>
    <Divider layout="vertical"/>
    <div class="flex flex-column flex-grow gap-2">
      <div class="flex flex-wrap items-center justify-between">
        <span>
          <Button label="New Note" icon="pi pi-plus" class="p-button-sm mr-2" @click="createNote" outlined raised />
          <Button icon="pi pi-pencil" class="p-button-sm mr-2" :disabled="!selectedNote" @click="editNote" outlined raised />
          <span>
            <Button icon="pi pi-trash" class="p-button-sm mr-2" :disabled="!selectedNote" severity="danger" @click="deleteNote()" outlined raised />
          </span>
        </span>
        <Button label="Refresh" icon="pi pi-refresh" class="p-button-sm" @click="refreshNotes" outlined raised />
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
    <Dialog v-model:visible="dialogVisible" :header="getDialogHeader()" modal>
      <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col w-full">
        <div class="flex flex-col gap-2 p-2">
          <div class="flex flex-col line-height-2 gap-2">
            <span>Title</span>
            <InputText id="title" name="title" type="text" size="small" v-model="selectedNoteSafe.title" fluid />
            <Message v-if="$form.title?.invalid" severity="error" variant="simple" :life="3000">{{ $form.title.error?.message }}</Message>
          </div>
          <div class="flex flex-col line-height-2 gap-2">
            <span>Contents</span>
            <Textarea id="contents" name="contents" v-model="selectedNoteSafe.contents" rows="10" cols="50" style="resize: none; width: 30vh; min-width: 200px; line-height: 1.4" fluid autoResize />
            <Message v-if="$form.contents?.invalid" severity="error" variant="simple" :life="3000">{{ $form.contents.error?.message }}</Message>
          </div>
          <Button type="submit" severity="primary" label="Confirm" class="p-button-lg mt-2"/>
        </div>
      </Form>
    </Dialog>
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