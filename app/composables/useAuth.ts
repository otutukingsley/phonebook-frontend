import { useApi } from "./useApi";

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
  const api = useApi();
  const isLoggedIn = useState<boolean>("auth:logged-in", () => false);
  const user = useState<User | null>("user", () => null);
  const isLoading = useState<boolean>("auth:loading", () => false);

  async function fetchUser() {
    isLoading.value = true;
    let response: User | null = null;

    if (import.meta.client) {
      // Use $fetch on client to avoid mount warning
      try {
        response = await $fetch<User>("/api/auth", { credentials: "include" });
      } catch {
        response = null;
      }
    } else {
      // Use useAsyncData on server for SSR optimization
      const { data } = await useAsyncData<User | null>(
        "auth:user",
        async () => {
          try {
            return await $fetch<User>("/api/auth", { credentials: "include" });
          } catch {
            return null;
          }
        }
      );
      response = data.value ?? null;
    }

    user.value = response;
    isLoggedIn.value = !!response;
    isLoading.value = false;
  }

  async function login(payload: LoginPayload) {
    try {
      await api.post<User>("/api/auth", payload);
      await fetchUser();
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
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
      await api.post<User>("/api/users", payload);
      await fetchUser();
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as APIError;
        if (apiError.response?._data?.message) {
          throw new Error(apiError.response._data.message);
        }
      }
      throw error;
    }
  }

  async function logout() {
    await api.post("/api/auth/logout");
    await fetchUser();
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
