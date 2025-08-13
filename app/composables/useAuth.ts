import { useState } from '#app'

interface User {
  name: string;
  email: string;
}

type LoginPayload = Record<string, unknown> & {
  email: string;
  password: string;
  remember?: boolean;
};

type RegisterPayload = Record<string, unknown> & {
  name: string;
  email: string;
  password: string;
};

interface APIErrorResponse {
  _data: {
    message?: string;
    [key: string]: unknown;
  };
  status?: number;
  statusText?: string;
}

interface APIError extends Error {
  response?: APIErrorResponse;
  status?: number;
}

export function useAuth() {
  const { loggedIn, user: sessionUser, session, fetch: fetchSession, clear } = useUserSession()
  const user = useState<User | null>('user', () => null)
  const isLoading = useState<boolean>('auth:loading', () => false)

  async function checkAuth() {
    isLoading.value = true
    try {
      await fetchSession()
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      isLoading.value = false
    }

    return loggedIn.value
  }

  async function fetchUser(force = false) {
  if (user.value && !force) return

  isLoading.value = true
  try {
    const response = await $fetch<User | null>('/api/auth', { credentials: 'include' })
    user.value = response || null
    if (user.value) {
        await $fetch('/api/_auth/set-session', {
          method: 'POST',
          body: { user: { name: user.value.name, email: user.value.email } },
          credentials: 'include'
        })
      }
  } catch (error) {
    const apiError = error as APIError
    if (apiError.response?._data?.message) {
      throw new Error(apiError.response._data.message)
    }
    user.value = null
    throw error
  } finally {
    isLoading.value = false
  }
}

  async function login(payload: LoginPayload) {
    try {
      await $fetch('/api/auth', {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })
      await fetchSession()
      await fetchUser()
    } catch (error) {
      const apiError = error as APIError
      if (apiError.response?._data?.message) {
        throw new Error(apiError.response._data.message)
      }
      throw error
    }
  }

  async function register(payload: RegisterPayload) {
    try {
      await $fetch('/api/users', {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })
      await fetchSession()
      await fetchUser()
    } catch (error) {
      const apiError = error as APIError
      if (apiError.response?._data?.message) {
        throw new Error(apiError.response._data.message)
      }
      throw error
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      await clear()
      user.value = null
    } catch (error) {
      const apiError = error as APIError
      if (apiError.response?._data?.message) {
        throw new Error(apiError.response._data.message)
      }
      throw error
    }
  }

  return { loggedIn, sessionUser, user, session, isLoading, checkAuth, fetchUser, login, register, logout }
}