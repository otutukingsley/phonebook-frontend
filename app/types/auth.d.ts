import type { Ref } from 'vue'
import type { UserSession as BaseUserSession } from 'nuxt-auth-utils'

export interface User {
  name: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthState {
  user: Ref<User | null>
  isLoggedIn: Ref<boolean>
  isLoading: Ref<boolean>
  fetchUser: () => Promise<void>
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}

declare module 'nuxt-auth-utils' {
  import type { H3Event } from 'h3'
  interface UserSession extends Omit<BaseUserSession, 'user'> {
    user?: User | null
    loggedInAt?: number
  }
  function getUserSession(event: H3Event): Promise<UserSession>
  function setUserSession(event: H3Event, data: Omit<UserSession, 'id'>): Promise<UserSession>

  interface UserSessionComposable {
    user: ComputedRef<User | null>
    loggedIn: ComputedRef<boolean>
    session: Ref<UserSession>
    fetch: () => Promise<void>
    clear: () => Promise<void>
  }
  function useUserSession(): UserSessionComposable
}

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    apiBaseUrl: string
    public: {
      apiBase: string
    }
  }
}

export {}