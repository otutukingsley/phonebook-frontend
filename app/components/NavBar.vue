<template>
  <nav class="bg-green-600 p-4">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <svg class="h-6 w-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <UiLink to="/" variant="navBrand" classes="text-lg font-bold">Phone Book</UiLink>
      </div>

      <div class="flex items-center">
        <UiLink v-if="isLoggedIn" to="/components" variant="nav" color="white" classes="mr-4">Components</UiLink>

        <span v-if="isLoggedIn" class="text-white mr-4">{{ user?.name }}</span>
        <UiLink v-if="!isLoggedIn" to="/register" variant="nav" color="white" exact classes="mr-4">Register</UiLink>
        <UiLink v-if="!isLoggedIn" to="/login" variant="nav" color="white" exact classes="mr-4">Login</UiLink>

        <UiButton v-if="isLoggedIn" classes="bg-transparent hover:bg-white/10 text-white" @click="handleLogout">
          Logout
        </UiButton>
      </div>
    </div>
  </nav>
</template>


<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from '#app'
import { useAuth } from '~/composables/useAuth'

const { user, isLoggedIn, logout, fetchUser } = useAuth()
const router = useRouter()

onMounted(fetchUser)

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>
