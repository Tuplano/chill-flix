import { api } from './tmdb-client';
import { MovieResponse, TVShowResponse, Movie, TVShow, GenreResponse } from '@/types';

// --- Movies ---

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<MovieResponse> => {
  return api.get<MovieResponse>(`/trending/movie/${timeWindow}`);
};

export const getNowPlayingMovies = async (page: number = 1): Promise<MovieResponse> => {
  return api.get<MovieResponse>('/movie/now_playing', { params: { page } });
};

export const getPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
  return api.get<MovieResponse>('/movie/popular', { params: { page } });
};

export const getTopRatedMovies = async (page: number = 1): Promise<MovieResponse> => {
  return api.get<MovieResponse>('/movie/top_rated', { params: { page } });
};

export const getUpcomingMovies = async (page: number = 1): Promise<MovieResponse> => {
  return api.get<MovieResponse>('/movie/upcoming', { params: { page } });
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  return api.get<Movie>(`/movie/${id}`);
};

// --- TV Shows ---

export const getTrendingTVShows = async (timeWindow: 'day' | 'week' = 'week'): Promise<TVShowResponse> => {
  return api.get<TVShowResponse>(`/trending/tv/${timeWindow}`);
};

export const getAiringTodayTVShows = async (page: number = 1): Promise<TVShowResponse> => {
  return api.get<TVShowResponse>('/tv/airing_today', { params: { page } });
};

export const getOnTheAirTVShows = async (page: number = 1): Promise<TVShowResponse> => {
  return api.get<TVShowResponse>('/tv/on_the_air', { params: { page } });
};

export const getPopularTVShows = async (page: number = 1): Promise<TVShowResponse> => {
  return api.get<TVShowResponse>('/tv/popular', { params: { page } });
};

export const getTopRatedTVShows = async (page: number = 1): Promise<TVShowResponse> => {
  return api.get<TVShowResponse>('/tv/top_rated', { params: { page } });
};

export const getTVShowDetails = async (id: number): Promise<TVShow> => {
  return api.get<TVShow>(`/tv/${id}`);
};

// --- Discovery & Search ---

export const getGenres = async (type: 'movie' | 'tv'): Promise<GenreResponse> => {
  return api.get<GenreResponse>(`/genre/${type}/list`);
};

export const discoverMedia = async (
  type: 'movie' | 'tv', 
  params: { page?: number; with_genres?: string }
): Promise<MovieResponse | TVShowResponse> => {
  return api.get<MovieResponse | TVShowResponse>(`/discover/${type}`, { params });
};

export const searchMedia = async (
  type: 'movie' | 'tv', 
  query: string, 
  page: number = 1
): Promise<MovieResponse | TVShowResponse> => {
  return api.get<MovieResponse | TVShowResponse>(`/search/${type}`, { params: { query, page } });
};
