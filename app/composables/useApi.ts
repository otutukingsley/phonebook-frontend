export function useApi() {

  async function get<T>(endpoint: string) {
    return await $fetch<T>(endpoint, {
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  async function post<T>(endpoint: string, data?: Record<string, unknown>) {
    return await $fetch<T>(endpoint, {
      method: 'POST',
      body: data,
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  async function put<T>(endpoint: string, data?: Record<string, unknown>) {
    return await $fetch<T>(endpoint, {
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
