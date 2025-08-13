import { defineNuxtRouteMiddleware, navigateTo, abortNavigation } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async (_to) => {
  const { loggedIn, checkAuth } = useAuth()

  await checkAuth()

  if (!loggedIn.value) {
    if (import.meta.client) {
      console.log('Auth middleware: Redirecting to /login')
      return navigateTo('/login', { redirectCode: 307 })
    }
    return abortNavigation()
  }
})