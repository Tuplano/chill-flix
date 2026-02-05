import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Simple auth token helper placeholder
function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorBody = error.response?.data || '';
    const errorMessage = `API Error: ${error.response?.status} ${error.response?.statusText} - ${JSON.stringify(errorBody)}`;
    console.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => axiosInstance.get(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => axiosInstance.post(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => axiosInstance.put(url, data, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => axiosInstance.patch(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => axiosInstance.delete(url, config),
};

