<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu';
import Divider from "primevue/divider";
import Player from "../composables/player/Player.vue";
import {useStore} from "../stores";
import {type Component, computed, ref} from "vue";
import Group from "../composables/group/Group.vue";
import type {MenuItem} from "primevue/menuitem";
import PlayerNotes from "../composables/player/PlayerNotes.vue";
import Tasks from "../composables/player/Tasks.vue";
import GroupJoin from "../composables/group/GroupJoin.vue";
import GroupCreate from "../composables/group/GroupCreate.vue";
import router from "../router";

const store = useStore()
const profile = store.profile!

const menuItems = ref<MenuItem[]>([
  {
    label: profile.user.username,
    icon: "pi pi-user",
    items: [
      {
        label: "My Account",
        icon: "pi pi-id-card",
        command: () => selectedComponent.value = Player
      },
      {
        label: "Tasks",
        icon: "pi pi-list",
        command: () => selectedComponent.value = Tasks
      },
      {
        label: "Notes",
        icon: "pi pi-file",
        command: () => selectedComponent.value = PlayerNotes
      },
    ]
  },
  {
    label: "Groups",
    icon: "pi pi-users",
    items: [
      {
        label: "My Groups",
        icon: "pi pi-users",
        items: profile.groups.map(group => ({
          label: group.name,
          icon: "pi pi-users",
          command: () => selectedComponent.value = Group
        })),
      },
      {
        label: "Join Group",
        icon: "pi pi-user-plus",
        command: () => selectedComponent.value = GroupJoin
      },
      {
        label: "New Group",
        icon: "pi pi-plus-circle",
        command: () => selectedComponent.value = GroupCreate
      },
    ]
  },
  {
    label: "Settings",
    icon: "pi pi-cog",
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
])

const selectedComponent = ref<Component>()

</script>

<template>
  <div class="dashboard bg-[var(--p-content-background)] p-4 rounded-lg">
    <div class="flex flex-column items-center">
      <h1 class="font-bold text-3xl">GroupMan</h1>
      <h2 class="font-medium text-gray-400 mt-1 mb-3">by <a href="https://github.com/Parmesaaan" target="_blank" rel="noopener noreferrer">Parmesaaan</a></h2>
      <Divider layout="horizontal"/>
      <PanelMenu :model="menuItems" class="w-64"/>
      <p class="font-medium text-gray-400 text-xs mt-auto">version 0.0.1-beta</p>
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