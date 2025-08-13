<template>
  <div class="min-h-screen flex flex-col items-center justify-start pt-20">
    <div class="w-full max-w-md">
      <AuthForm 
        mode="login" 
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

definePageMeta({
  middleware: ['guest']
})
const { login } = useAuth()
const error = ref('')

const isLoading = ref(false)
const handleSubmit = async (values: LoginFormValues | RegisterFormValues) => {
  if ('name' in values) {
    // This should never happen since we're in login mode
    error.value = 'Invalid form data'
    return
  }
  error.value = ''
  isLoading.value = true
  try {
    console.log('Login attempt with:', values)
    await login({
      email: String(values.email || ''),
      password: String(values.password || ''),
      remember: Boolean(values.remember)
    })
    console.log('Login successful!')
    await navigateTo('/');
  } catch (err) {
    console.error('Login failed:', err)
    if (err instanceof Error) {
      error.value = err.message
    } else if (err && typeof err === 'object' && 'status' in err) {
      // Handle specific HTTP errors
      error.value = err.status === 401 
        ? 'Invalid email or password' 
        : 'Login failed. Please try again.'
    } else {
      error.value = 'An unexpected error occurred'
    }
  } finally {
    isLoading.value = false
  }
}
</script>