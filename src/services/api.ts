// import { getAuthToken } from '@/lib/auth'; // Placeholder for auth token retrieval

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface RequestConfig extends RequestInit {
  data?: unknown;
  headers?: HeadersInit;
}

// Simple auth token helper placeholder
function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...config.headers,
  };

  const configObj: RequestInit = {
    ...config,
    headers,
  };

  if (config.data) {
    configObj.body = JSON.stringify(config.data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, configObj);

  if (!response.ok) {
    // Handle specific status codes if needed (e.g. 401 logout)
    const errorBody = await response.text().catch(() => '');
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  // Handle empty responses
  if (response.status === 204) {
      return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(url: string, config?: RequestConfig) => request<T>(url, { ...config, method: 'GET' }),
  post: <T>(url: string, data: unknown, config?: RequestConfig) => request<T>(url, { ...config, method: 'POST', data }),
  put: <T>(url: string, data: unknown, config?: RequestConfig) => request<T>(url, { ...config, method: 'PUT', data }),
  patch: <T>(url: string, data: unknown, config?: RequestConfig) => request<T>(url, { ...config, method: 'PATCH', data }),
  delete: <T>(url: string, config?: RequestConfig) => request<T>(url, { ...config, method: 'DELETE' }),
};
