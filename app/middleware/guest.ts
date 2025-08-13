import { sendRedirect } from 'h3'

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, checkAuth } = useAuth()
  const nuxtApp = useNuxtApp()

  await checkAuth()
  if (loggedIn.value) {
    console.log('Guest middleware: Redirecting to / from', to.path)
    if (import.meta.client) {
      return navigateTo('/', { redirectCode: 307, replace: true })
    }
    if (import.meta.server && nuxtApp.ssrContext?.event) {
      return await nuxtApp.runWithContext(() =>
        nuxtApp.callHook('app:redirected').then(() =>
          sendRedirect(nuxtApp.ssrContext!.event, '/', 307)
        )
      )
    }
  }
})