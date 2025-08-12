import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser } = useAuth()

  // Don't redirect during SSR to avoid hydration issues
  if (import.meta.server) {
    try {
      await fetchUser()
    } catch (error) {
      console.error('Auth check failed during SSR:', error)
    }
    return
  }

  // Client-side navigation
  if (!user.value) {
    await fetchUser()
  }

  // After fetching, if still no user, redirect to login
  if (!user.value) {
    return navigateTo('/login')
  }
})
