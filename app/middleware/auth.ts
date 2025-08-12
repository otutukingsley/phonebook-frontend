import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async (_to) => {
  const { fetchUser, isLoading, isLoggedIn } = useAuth()

  // If we're already loading, wait for the fetch
  if (isLoading.value) {
    await fetchUser()
  }

  // If no user after initial load, try fetching again
  if (!isLoggedIn.value) {
    await fetchUser()
  }

  // After fetching, if still no user, redirect to login
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }

  // If we have a user, continue navigation
  return
})
