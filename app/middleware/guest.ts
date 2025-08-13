import { defineNuxtRouteMiddleware, navigateTo, abortNavigation } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async (_to) => {
  const { loggedIn, checkAuth } = useAuth()

  await checkAuth() // Sync state before checking
  if (loggedIn.value) {
    if (import.meta.client) {
      console.log('Guest middleware: Redirecting to /')
      return navigateTo('/', { redirectCode: 307 })
    }
    return abortNavigation() // Block on server
  }
})