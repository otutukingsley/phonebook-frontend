import { useFetch } from "#app";

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
  const isLoggedIn = computed(() => !!user.value);

  async function fetchUser() {
    const { data, error } = await useFetch<User>("/auth", {
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!error.value) user.value = data.value ?? null;
    else user.value = null;
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
    // Set cookie to expire
    document.cookie = "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    // Clear user state
    user.value = null;

    // Redirect to login page
    navigateTo("/login");
  }

  return {
    user,
    isLoggedIn,
    fetchUser,
    login,
    register,
    logout,
  };
}
