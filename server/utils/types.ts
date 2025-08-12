export interface APIResponse {
  headers: {
    get(name: string): string | null;
    set(name: string, value: string): void;
  };
  data?: unknown;
  status?: number;
  message?: string;
}

export interface APIError {
  status?: number;
  message?: string;
  response?: {
    status: number;
    _data?: {
      message?: string;
    };
  };
}
