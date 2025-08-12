interface User {
  name: string;
  email: string;
}

interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterPayload {
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
  const user = useState<User | null>("auth:user", () => null);
  const isLoading = useState<boolean>("auth:loading", () => false);
  const isLoggedIn = computed(() => !!user.value);

  async function fetchUser() {
    try {
      isLoading.value = true;
      const data = await $fetch<User>("/auth", {
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      user.value = data;
      return true;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as APIError;
        if (apiError.response?.status === 401) {
          user.value = null;
          return false;
        }
      }
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function login(payload: LoginPayload) {
    try {
      await $fetch("/auth", {
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        method: "POST",
        body: payload,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await fetchUser();
    } catch (error) {
      // Handle different types of errors
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as APIError;
        console.log(apiError.response)
        if (apiError.response?._data?.message) {
          throw new Error(apiError.response._data.message);
        }
      }
      // If we couldn't extract a specific message, throw a generic error
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }

  async function register(payload: RegisterPayload) {
    try {
      await $fetch("/users", {
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        method: "POST",
        body: payload,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await fetchUser();
    } catch (error) {
      // Handle different types of errors
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as APIError;
        if (apiError.response?._data?.message) {
          throw new Error(apiError.response._data.message);
        }
      }
      // If we couldn't extract a specific message, throw a generic error
      throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
  }

  async function logout() {
    try {
      // Call logout endpoint to clear server-side session
      await $fetch("/auth/logout", {
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user state regardless of API call result
      user.value = null;
    }
  }

  return {
    user,
    isLoggedIn,
    isLoading,
    fetchUser,
    login,
    register,
    logout,
  };
}
