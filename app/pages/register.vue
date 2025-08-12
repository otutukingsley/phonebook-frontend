<template>
  <div class="min-h-screen flex flex-col items-center justify-start pt-20">
    <div class="w-full max-w-md">
      <AuthForm 
        mode="register"
        :is-submitting="isLoading"
        :submit-error="error"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthForm from '~/components/AuthForm.vue'
import type { LoginFormValues, RegisterFormValues } from '~/components/AuthForm.vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from '#app'

definePageMeta({
  middleware: ['guest']
})

const router = useRouter()
const { register } = useAuth()
const error = ref('')
const isLoading = ref(false)

const handleSubmit = async (values: LoginFormValues | RegisterFormValues) => {
  if (!('name' in values)) {
    // This should never happen since we're in register mode
    error.value = 'Invalid form data'
    return
  }
  isLoading.value = true
  error.value = ''
  try {
    console.log('Register attempt with:', values)
    await register({
      name: String(values.name || ''),
      email: String(values.email || ''),
      password: String(values.password || '')
    })
    console.log('Registration successful!')
    await router.push('/')
  } catch (err) {
    console.error('Registration failed:', err)
    if (err instanceof Error) {
      error.value = err.message
    } else if (err && typeof err === 'object' && 'status' in err) {
      error.value = err.status === 409 
        ? 'Email already exists' 
        : 'Registration failed. Please try again.'
    } else {
      error.value = 'An unexpected error occurred'
    }
  } finally {
    isLoading.value = false
  }
}
</script>