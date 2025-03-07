<script setup lang="ts">
import Tree, {type TreeSelectionKeys} from 'primevue/tree';
import Divider from "primevue/divider";
import Player from "../composables/Player.vue";
import {useStore} from "../stores";
import {type Component, computed} from "vue";
import type {TreeNode} from "primevue/treenode";
import Group from "../composables/Group.vue";

const store = useStore()
const profile = store.profile!

const treeData = ref([
  {
    key: "player",
    label: profile.user.username || "User",
    icon: "pi pi-user",
    data: profile.user,
  },
  {
    key: "player-notes",
    label: "Notes",
    icon: "pi pi-file",
    data: profile.user.notes,
  },
  {
    key: "player-tasks",
    label: "Tasks",
    icon: "pi pi-list",
    data: profile.user.tasks,
  },
  {
    key: "groups",
    label: "Groups",
    icon: "pi pi-users",
    data: profile.groups,
    children: profile.groups.map(group => {
      return {
        key: "group-select-".concat(group.id),
        label: group.name,
        icon: "pi pi-users",
        data: group,
      } as TreeNode
    })
   },
  {
    key: "group-join",
    label: "Join Group",
    icon: "pi pi-user-plus",
    data: {},
  },
  {
    key: "group-new",
    label: "New Group",
    icon: "pi pi-plus-circle",
    data: {},
  }
])

const getSelectedComponent = (key?: string) => {
  if (!key) return null

  if (key.startsWith("group")) {
    return Group
  }

  if (key.startsWith("player")) {
    return Player
  }

  return null
}

const selectedKey = ref<TreeSelectionKeys>({})

let previousComponent: Component | null = Player
const selectedComponent = computed(() => {
  const selectedNodeKey = Object.keys(selectedKey.value || {})[0]
  const result = getSelectedComponent(selectedNodeKey)
  if (result) previousComponent = result
  return result || previousComponent
})

let previousData: any = null
const selectedData = computed(() => {
  const selectedNodeKey = Object.keys(selectedKey.value || {})[0]
  const findNode = (nodes: TreeNode[]): string | null => {
    for (const node of nodes) {
      if (node.key === selectedNodeKey) return node.data
      if (node.children) {
        const childResult = findNode(node.children)
        if (childResult) return childResult
      }
    }
    return null
  }
  const data = findNode(treeData.value)
  if (data) previousData = data
  return data || previousData
})

</script>

<template>
  <div class="dashboard bg-[var(--p-content-background)] p-4 rounded-lg">
    <div class="flex flex-column items-center">
      <h1 class="font-bold text-3xl">GroupMan</h1>
      <h2 class="font-medium text-gray-400 mt-1 mb-3">by <a href="https://github.com/Parmesaaan" target="_blank" rel="noopener noreferrer">Parmesaaan</a></h2>
      <Tree v-model:selectionKeys="selectedKey" selection-mode="single" :value="treeData" />
      <p class="mt-auto">Test</p>
    </div>
    <Divider layout="vertical" />
    <div>
      <component :is="selectedComponent" :data="selectedData"/>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-width: 900px;
  min-height: 550px;
  max-width: 1280px;
  max-height: 720px;
  display: flex;
  flex-direction: row;
}
</style>