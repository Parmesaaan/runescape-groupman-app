<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu';
import Divider from "primevue/divider";
import Player from "../composables/Player.vue";
import {useStore} from "../stores";
import {type Component, computed, ref} from "vue";
import Group from "../composables/Group.vue";
import type {MenuItem} from "primevue/menuitem";

const store = useStore()
const profile = store.profile!

const menuItems = ref<MenuItem[]>([
  {
    label: profile.user.username,
    icon: "pi pi-user",
    key: "player",
    items: [
      {
        label: "Notes",
        icon: "pi pi-file",
        key: "player-notes",
      },
      {
        label: "Tasks",
        icon: "pi pi-list",
        key: "player-tasks",
      },
    ]
  },
  {
    label: "Groups",
    icon: "pi pi-users",
    key: "groups",
    items: [
      {
        label: "My Groups",
        icon: "pi pi-users",
        key: "groups-my",
        items: profile.groups.map(group => ({
          label: group.name,
          icon: "pi pi-users",
          key: `group-select-${group.id}`,
        })),
      },
      {
        label: "Join Group",
        icon: "pi pi-user-plus",
        key: "group-join",
      },
      {
        label: "New Group",
        icon: "pi pi-plus-circle",
        key: "group-new",
      },
    ]
  },
])

const selectedKey = ref<string | undefined>()

const getSelectedComponent = (key?: string) => {
  if (!key) return null;
  if (key.startsWith("group")) return Group;
  if (key.startsWith("player")) return Player;
  return null;
}

let previousComponent: any = Player;
const selectedComponent = computed(() => {
  const result = getSelectedComponent(selectedKey.value)
  if (result) previousComponent = result
  return result || previousComponent
})

</script>

<template>
  <div class="dashboard bg-[var(--p-content-background)] p-4 rounded-lg">
    <div class="flex flex-column items-center">
      <h1 class="font-bold text-3xl">GroupMan</h1>
      <h2 class="font-medium text-gray-400 mt-1 mb-3">by <a href="https://github.com/Parmesaaan" target="_blank" rel="noopener noreferrer">Parmesaaan</a></h2>
      <Divider layout="horizontal"/>
      <PanelMenu :model="menuItems" class="w-64"/>
      <p class="mt-auto">Test</p>
    </div>
    <Divider layout="vertical" />
    <div>
      <component :is="selectedComponent"/>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-width: 1000px;
  min-height: 550px;
  max-width: 1280px;
  max-height: 720px;
  display: flex;
  flex-direction: row;
}
</style>