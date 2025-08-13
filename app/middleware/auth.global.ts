import { sendRedirect } from 'h3'

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, checkAuth } = useAuth()
  const router = useRouter()
  const nuxtApp = useNuxtApp()

  await checkAuth()
  const routes = router.getRoutes()

  // Check if route is guest-only
  const isGuestRoute = routes.some((route) => {
    console.log(route.meta)
    return (
      route.path === to.path &&
      Array.isArray(route.meta?.middleware) &&
      route.meta.middleware[0] === 'guest'
    )
  })

  if (loggedIn.value && isGuestRoute) {
    console.log('Global auth middleware: Redirecting to / from guest route', to.path)
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