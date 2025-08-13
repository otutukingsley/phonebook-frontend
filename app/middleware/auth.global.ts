export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, checkAuth } = useAuth()

  console.log(to.meta.middleware === 'guest', to.meta.middleware)

  await checkAuth()
  if (loggedIn.value) {
    // Check if the target route has meta.guest: true
    const isGuestRoute = to.meta.middleware === 'guest';

    console.log(isGuestRoute)

    if (isGuestRoute) {
      console.log('Global auth middleware: Redirecting to / from', to.path)
      return navigateTo('/', { redirectCode: 307, replace: true })
    }
  }
})