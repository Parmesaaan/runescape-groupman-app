<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import {ref} from "vue"

const username = ref('')
const password = ref('')
</script>

<template>
  <div class="container">

    <div>
      <h2>Welcome</h2>
    </div>

    <div class="input-box">
      <InputText v-model="username" />
    </div>

    <div class="input-box">
      <InputText v-model="password" toggleMask />
    </div>

    <div class="button-group">
      <Button label="Register" class="p-button-secondary" />
      <Button label="Login" class="p-button-primary" />
    </div>

  </div>
</template>

<style scoped>
.container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.input-box {
  width: 100%;
  max-width: 300px;
  padding: 8px;
}

.button-group {
  padding: 8px;
  display: flex;
  gap: 12px;
}
</style>
