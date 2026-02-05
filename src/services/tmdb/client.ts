import axios from 'axios';

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
  },
  params: {
    include_adult: false,
  },
});

tmdbApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle errors globally
    console.error('TMDB API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const tmdbClient = {
  get: <T>(url: string, config?: any): Promise<T> => tmdbApi.get(url, config) as Promise<T>,
};

