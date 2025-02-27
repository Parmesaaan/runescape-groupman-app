<script setup lang="ts">
import Card from 'primevue/card'
import Button from "primevue/button"
import FloatLabel from "primevue/floatlabel"
import InputText from "primevue/inputtext"
import Password from "primevue/password"
import {ref} from "vue"

const formData = ref<LoginForm>({
  username: '',
  password: ''
})

const submitForm = (event: Event) => {
  event.preventDefault()
}
</script>

<template>
    <Card>
      <template #title>RS3 GIM Tracker</template>
      <template #subtitle>Login to continue</template>
      <template #content>
        <div class="p-fluid flex flex-column gap-3 mt-3 mb-3">

          <!-- Username -->
          <FloatLabel variant="on">
            <InputText id="username" v-model="formData.username" class="w-full" variant="filled" />
            <label for="username">Username</label>
          </FloatLabel>

          <!-- Password -->
          <FloatLabel variant="on">
            <Password id="password" v-model="formData.password" class="w-full" variant="filled" :feedback="false" fluid toggle-mask />
            <label for="password">Password</label>
          </FloatLabel>

          <!-- Buttons -->
          <Button label="Login" severity="primary" class="w-full mt-2" @click="submitForm" />

        </div>
      </template>
      <template #footer>by <a href="https://github.com/Parmesaaan" target="_blank" rel="noopener noreferrer">Parmesaaan</a></template>
    </Card>
</template>
