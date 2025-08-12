export function useApi() {
  const config = useRuntimeConfig();

  async function get<T>(endpoint: string) {
    return await $fetch<T>(endpoint, {
      baseURL: config.public.apiBaseUrl,
      credentials: 'include', // This will send cookies
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  async function post<T>(endpoint: string, data?: Record<string, unknown>) {
    return await $fetch<T>(endpoint, {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      body: data,
      credentials: 'include', // This will send cookies
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  async function put<T>(endpoint: string, data?: Record<string, unknown>) {
    return await $fetch<T>(endpoint, {
      baseURL: config.public.apiBaseUrl,
      method: 'PUT',
      body: data,
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  async function del(endpoint: string) {
    return await $fetch(endpoint, {
      baseURL: config.public.apiBaseUrl,
      method: 'DELETE',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  return {
    get,
    post,
    put,
    delete: del
  };
}
