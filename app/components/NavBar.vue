<template>
  <nav class="bg-green-600 px-4 py-6 min-h-20">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <svg
          class="h-6 w-6 text-white mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <ClientOnly>
          <UiLink :to="loggedIn ? '/' : '/landing'" variant="navBrand" classes="text-lg font-bold">Phone Book</UiLink>
        </ClientOnly>
      </div>

      <div class="flex items-start">
        <ClientOnly>
          <template v-if="!isLoading">
            <UiLink v-if="loggedIn" to="/components" variant="nav" color="white" classes="mr-4">Components</UiLink>

            <!-- <span v-if="loggedIn" class="text-white mr-4">{{ (user as { name: string }).name || 'User' }}</span> -->
            <UiLink v-if="!loggedIn" to="/register" variant="nav" color="white" exact classes="mr-4">Register</UiLink>
            <UiLink v-if="!loggedIn" to="/login" variant="nav" color="white" exact classes="mr-4">Login</UiLink>

            <UiButton v-if="loggedIn" variant="none" classes="hover:bg-transparent cursor-pointer" @click="handleLogout">
              Logout
            </UiButton>
          </template>
          <template #fallback>
            <div class="w-8 h-8"/> <!-- Placeholder during loading -->
          </template>
        </ClientOnly>
      </div>
    </div>
  </nav>
</template>


<script lang="ts" setup>
import { useRouter } from '#imports'
import { useAuth } from '~/composables/useAuth'

const { loggedIn, isLoading, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/landing')
}
</script>
