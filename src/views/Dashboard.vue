<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu'
import Divider from "primevue/divider"
import PlayerHome from "../composables/player/PlayerHome.vue"
import {useStore} from "../stores"
import {type Component, computed, ref, shallowRef} from "vue"
import Group from "../composables/group/Group.vue"
import type {MenuItem} from "primevue/menuitem"
import PlayerNotes from "../composables/player/PlayerNotes.vue"
import PlayerTasks from "../composables/player/PlayerTasks.vue"
import router from "../router"
import {Group as GroupModel} from "../models"

const store = useStore()
const profile = store.profile!

const menuItems = computed<MenuItem[]>(() => {
  return [
    {
      label: profile.user.username,
      icon: "pi pi-user",
      command: () => selectedComponent.value = PlayerHome
    },
    {
      label: "Tasks",
      icon: "pi pi-list",
      command: () => selectedComponent.value = PlayerTasks
    },
    {
      label: "Notes",
      icon: "pi pi-file",
      command: () => selectedComponent.value = PlayerNotes
    },
    {
      label: "Groups",
      icon: "pi pi-users",
      disabled: true,
      items: getGroupNavs()
    },
    {
      label: "Utilities",
      icon: "pi pi-wrench",
      disabled: true
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      key: "logout",
      command: () => {
        store.logout()
        router.push("/login")
      }
    },
  ]
})

const selectedComponent = shallowRef<Component>(PlayerHome)
const selectedGroup = ref<GroupModel>()

const getGroupNavs = () => {
  const groupsMap = profile.groups.map(group => ({
    label: group.name,
    icon: "pi pi-users",
    command: () => {
      selectedComponent.value = Group
      selectedGroup.value = group
    }
  }))

  if (groupsMap.length) return groupsMap
  return undefined
}

</script>

<template>
  <div class="dashboard bg-[var(--p-content-background)] p-4 rounded-lg">
    <div class="flex flex-column items-center">
      <h1 class="font-bold text-3xl">GroupMan</h1>
      <h2 class="font-medium text-gray-400 mt-1 mb-3">by <a href="https://github.com/Parmesaaan" target="_blank" rel="noopener noreferrer">Parmesaaan</a></h2>
      <Divider layout="horizontal"/>
      <PanelMenu :model="menuItems" class="w-56"/>
      <p class="font-medium text-gray-400 text-xs mt-auto">version 0.0.1-beta</p>
    </div>
    <Divider layout="vertical" />
    <component :is="selectedComponent" :data="selectedGroup" class="flex-grow overflow-hidden w-full"/>
  </div>
</template>

<style scoped>
.dashboard {
  min-width: 1100px;
  min-height: 600px;
  max-width: 1100px;
  max-height: 600px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}
</style>