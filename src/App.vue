<script setup lang="ts">
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Password from 'primevue/password'
import FloatLabel from 'primevue/floatlabel'
import {ref} from "vue"

const username = ref('')
const password = ref('')
</script>

<template>
  <div>
    <Card>
      <template #title>Parm's GIM Tracker</template>
      <template #subtitle>Login or register to continue</template>
      <template #content>
        <div class="p-fluid flex flex-column gap-3 mt-3 mb-2">
          <FloatLabel variant="on">
            <InputText id="username" v-model="username" class="w-full" variant="filled" />
            <label for="username">Username</label>
          </FloatLabel>
          <FloatLabel variant="on">
          <Password id="password" v-model="password" class="w-full" variant="filled" :feedback="false" fluid toggle-mask />
            <label for="password">Password</label>
          </FloatLabel>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-row gap-4 mt-2">
          <Button label="Register" severity="secondary" outlined class="w-full" />
          <Button label="Login" severity="primary" class="w-full" />
        </div>
      </template>
    </Card>
  </div>
</template>
