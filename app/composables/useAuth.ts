interface User {
  name: string;
  email: string;
}

type LoginPayload = Record<string, unknown> & {
  email: string;
  password: string;
  remember?: boolean;
}

type RegisterPayload = Record<string, unknown> & {
  name: string;
  email: string;
  password: string;
}

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
  const api = useApi();
  const isLoggedIn = useState<boolean>('auth:logged-in', () => false);
  const isLoading = useState<boolean>('auth:loading', () => true);

  const { data: user, refresh } = useAsyncData<User | null>(
    'auth-user',
    async () => {
      try {
        return await api.get<User>('/auth');
      } catch {
        return null;
      }
    },
    {
      server: true,
      immediate: true,
      transform: (user) => {
        isLoggedIn.value = !!user;
        isLoading.value = false;
        return user;
      },
      watch: [isLoggedIn]
    }
  );

  async function login(payload: LoginPayload) {
    try {
      await api.post<User>('/auth', payload);
      await refresh();
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as APIError;
        if (apiError.response?._data?.message) {
          throw new Error(apiError.response._data.message);
        }
      }
      throw error;
    }
  }

  async function register(payload: RegisterPayload) {
    try {
      await api.post<User>('/users', payload);
      await refresh();
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as APIError;
        if (apiError.response?._data?.message) {
          throw new Error(apiError.response._data.message);
        }
      }
      throw error;
    }
  }

  async function logout() {
    await api.post('/auth/logout');
    await refresh();
  }

  return {
    user,
    isLoggedIn,
    isLoading,
    fetchUser: refresh,
    login,
    register,
    logout,
  };
}
