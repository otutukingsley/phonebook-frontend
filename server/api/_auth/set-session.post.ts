import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{ user?: { name: string; email: string } }>(event)
  try {
    await setUserSession(event, {
      user: body.user ? { name: body.user.name, email: body.user.email } : null,
      loggedInAt: Date.now()
    })
    return { success: true }
  } catch (err) {
    console.error('Set session error:', err)
    return { success: false, error: 'Failed to set session' }
  }
})