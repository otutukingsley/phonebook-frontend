import { useState } from '#app'

interface User {
  name: string;
  email: string;
  securityQuestion?: string;
}

type UpdateProfilePayload = Record<string, unknown> & {
  name?: string;
  email?: string;
  password?: string;
};

type LoginPayload = Record<string, unknown> & {
  email: string;
  password: string;
};

type RegisterPayload = Record<string, unknown> & {
  name: string;
  email: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
};

interface SecurityQuestionResponse {
  question: string;
}

type ResetPasswordPayload = Record<string, unknown> & {
  email: string;
  securityAnswer: string;
  newPassword: string;
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
  const { get, post, put } = useApi()
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
    const response = await get<User | null>('/api/auth')
    user.value = response || null
    if (user.value) {
      await post('/api/_auth/set-session', { user: { name: user.value.name, email: user.value.email } })
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
      await post('/api/auth', payload)
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
      await post('/api/users', payload)
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
      await post('/api/auth/logout')
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

  async function getSecurityQuestion(email: string): Promise<string> {
    try {
      const response = await post<SecurityQuestionResponse>('/api/auth/forgot-password/question', { email })
      return response.question
    } catch (error) {
      const apiError = error as APIError
      if (apiError.response?._data?.message) {
        throw new Error(apiError.response._data.message)
      }
      throw error
    }
  }

  async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
    try {
      await post('/api/auth/forgot-password/reset', payload)
    } catch (error) {
      const apiError = error as APIError
      if (apiError.response?._data?.message) {
        throw new Error(apiError.response._data.message)
      }
      throw error
    }
  }

  async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
    try {
      const updatedUser = await put<User>('/api/users', payload)
      user.value = updatedUser
      if (updatedUser) {
        await post('/api/_auth/set-session', { user: { name: updatedUser.name, email: updatedUser.email } })
      }
      return updatedUser
    } catch (error) {
      const apiError = error as APIError
      if (apiError.response?._data?.message) {
        throw new Error(apiError.response._data.message)
      }
      throw error
    }
  }

  return { loggedIn, sessionUser, user, session, isLoading, checkAuth, fetchUser, login, register, logout, getSecurityQuestion, resetPassword, updateProfile }
}