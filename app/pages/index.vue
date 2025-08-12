<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <div class="text-center">
      <h1 class="text-3xl font-semibold mb-4">
        Hello, {{ user?.name || 'there' }}! 👋
      </h1>
      <p class="text-lg text-gray-600 mb-6">Welcome to your Phone Book dashboard</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()

definePageMeta({
  middleware: ['auth']
})
</script>
