<script setup lang="ts">
import { defineProps } from 'vue'
import {Group as GroupModel} from "../../models";

const props = defineProps<{
  data: GroupModel
}>()
</script>

<template>
  <p class="m-0">
    Selected group: {{ data.name }}
  </p>
</template>

<style scoped>

</style>