<script setup lang="ts">
import {ref} from "vue"
import {useStore} from "../stores";
import { Form } from '@primevue/forms';
import {useToast} from "primevue/usetoast";
import FloatLabel from "primevue/floatlabel";
import {BackendService} from "../services";
import useRouter from "../router";

const store = useStore()

const toast = useToast()
const signupMode = ref<boolean>(false)

const resolver = ({ values }) => {
  const errors: {username?: string, password?: string, confirmPassword: string} = {}

  if (!values.username) {
    errors.username = [{ message: 'Username is required.' }]
  }

  if (!values.password) {
    errors.password = [{ message: 'Password is required.' }]
  }

  if (signupMode.value && !values.confirmPassword) {
    errors.confirmPassword = [{ message: 'Confirm your password.' }]
  }

  return {
    values,
    errors
  }
}

const onFormSubmit = async (form) => {
  console.log("Form: " + JSON.stringify(form))
  if (form.valid) {
    if (signupMode.value) {
      try {
        await BackendService.signup({
          username: form.values.username,
          password: form.values.password,
        })

        const loginSuccess = await store.login({
          username: form.values.username,
          password: form.values.password,
        })

        if (loginSuccess) {
          toast.add({
            severity: 'info',
            summary: 'Register success',
            life: 3000
          })
          await useRouter.push('/dash')
        } else {
          toast.add({
            severity: 'error',
            summary: 'Register failed',
            life: 3000
          })
        }
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Register failed',
          life: 3000
        })
      }
    } else {
      try {
        const loginSuccess = await store.login({
          username: form.values.username,
          password: form.values.password,
        })

        if (loginSuccess) {
          toast.add({
            severity: 'info',
            summary: 'Login success',
            life: 3000
          })
          await useRouter.push('/dash')
        } else {
          toast.add({
            severity: 'error',
            summary: 'Incorrect username/password',
            life: 3000
          })
        }
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Login failed',
          life: 3000
        })
      }
    }
  }
}

const toggleSignupMode = () => {
  signupMode.value = !signupMode.value
}

</script>

<template>
  <Toast />
  <div class="login-container bg-[var(--p-content-background)] items-center justify-content-center p-4 rounded-lg ">
    <h1 class="font-bold text-3xl">GroupMan</h1>
    <p class="font-medium text-gray-400">by <a href="https://github.com/Parmesaaan" target="_blank" rel="noopener noreferrer">Parmesaaan</a></p>
    <Divider layout="horizontal"/>
    <p class="text-xl">{{ signupMode ? 'Register' : 'Login'}}</p>
    <Divider layout="horizontal"/>
    <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col w-full">
      <div class="flex flex-col gap-2">
        <FloatLabel variant="on">
          <InputText id="username" name="username" type="text" fluid />
          <label for="username">Username</label>
        </FloatLabel>
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple" :life="3000">{{ $form.username.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-2 mt-2">
        <FloatLabel variant="on">
          <Password id="password" name="password" type="text" :feedback="signupMode" toggleMask fluid />
          <label for="password">Password</label>
        </FloatLabel>
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple" :life="3000">{{ $form.password.error?.message }}</Message>
      </div>
      <div v-if="signupMode" class="flex flex-col gap-2 mt-2">
        <FloatLabel variant="on">
          <Password id="confirmPassword" name="confirmPassword" type="text" :feedback="false" toggleMask fluid />
          <label for="confirmPassword">Confirm password</label>
        </FloatLabel>
        <Message v-if="$form.confirmPassword?.invalid" severity="error" size="small" variant="simple" :life="3000">{{ $form.confirmPassword.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-2 mt-3">
        <Button type="submit" severity="primary" :label="signupMode ? 'Confirm' : 'Login'" class="p-button-lg"/>
        <Button severity="secondary" :label="signupMode ? 'Back' : 'Register'" @click="toggleSignupMode"/>
      </div>
    </Form>
    <Divider layout="horizontal"/>
    <p class="font-medium text-gray-400 text-xs mt-auto">version 0.0.1-beta</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 1100px;
  max-height: 550px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: center;
}
</style>