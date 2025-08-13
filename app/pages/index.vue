<template>
  <div class="flex flex-col items-center justify-start">
    <div class="text-center">
      <h1 class="text-3xl font-semibold mb-4">
        Hello, {{ (user as { name: string }).name || 'there' }}! 👋
      </h1>
      <p class="text-lg text-gray-600 mb-6">Welcome to your Phone Book dashboard</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { sessionUser:user } = useAuth()

definePageMeta({
  middleware: ['auth']
})
</script>
