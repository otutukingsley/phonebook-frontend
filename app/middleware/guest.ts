import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const { fetchUser, isLoading, isLoggedIn } = useAuth()
  
  // If we're already loading, wait for the fetch
  if (isLoading.value) {
    await fetchUser()
  }

  // Always fetch to ensure we have the latest state
  await fetchUser()
  
  // Redirect to home if user is logged in
  if (isLoggedIn.value) {
    return navigateTo('/')
  }
})
