export default defineNuxtPlugin(async () => {
  const { fetch: fetchSession } = useUserSession()
  await fetchSession()
})