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

  // After fetching, if user exists, redirect to home
  if (user.value) {
    return navigateTo('/')
  }
})
