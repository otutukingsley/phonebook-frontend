export default defineNuxtRouteMiddleware(async (_to) => {
  const { isLoggedIn, fetchUser } = useAuth()
   
  // Check auth state before proceeding
  await fetchUser()
  
  // Redirect to home if user is logged in (client-only to avoid SSR flash)
  if (isLoggedIn.value) {
    if (import.meta.client) {
      return navigateTo('/')
    }
    return abortNavigation()  // Block on server; client will handle
  }
})