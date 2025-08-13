<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-4">Welcome to Phone Book</h1>
    <p class="text-lg mb-4">A simple app to manage your contacts securely.</p>
    <p class="text-md mb-6">
      Store personal and professional contacts with ease. Search, edit, and
      delete contacts in a user-friendly interface.
    </p>

    <UiLink to="/login" button color="green" classes="inline-block">
      Get Started
    </UiLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['guest'],
  meta: { guest: true }
})
</script>
