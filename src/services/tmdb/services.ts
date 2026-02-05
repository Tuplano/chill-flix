import { tmdbClient } from './client';

import { MovieResponse, TVShowResponse, Movie, GenreResponse, TVShowDetails, SeasonDetails } from '@/types';

// --- Movies ---

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<MovieResponse> => {
  return tmdbClient.get<MovieResponse>(`/trending/movie/${timeWindow}`);
};

export const getNowPlayingMovies = async (page: number = 1): Promise<MovieResponse> => {
  return tmdbClient.get<MovieResponse>('/movie/now_playing', { params: { page } });
};

export const getPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
  return tmdbClient.get<MovieResponse>('/movie/popular', { params: { page } });
};

export const getTopRatedMovies = async (page: number = 1): Promise<MovieResponse> => {
  return tmdbClient.get<MovieResponse>('/movie/top_rated', { params: { page } });
};

export const getUpcomingMovies = async (page: number = 1): Promise<MovieResponse> => {
  return tmdbClient.get<MovieResponse>('/movie/upcoming', { params: { page } });
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  return tmdbClient.get<Movie>(`/movie/${id}`);
};

// --- TV Shows ---

export const getTrendingTVShows = async (timeWindow: 'day' | 'week' = 'week'): Promise<TVShowResponse> => {
  return tmdbClient.get<TVShowResponse>(`/trending/tv/${timeWindow}`);
};

export const getAiringTodayTVShows = async (page: number = 1): Promise<TVShowResponse> => {
  return tmdbClient.get<TVShowResponse>('/tv/airing_today', { params: { page } });
};

export const getOnTheAirTVShows = async (page: number = 1): Promise<TVShowResponse> => {
  return tmdbClient.get<TVShowResponse>('/tv/on_the_air', { params: { page } });
};

export const getPopularTVShows = async (page: number = 1): Promise<TVShowResponse> => {
  return tmdbClient.get<TVShowResponse>('/tv/popular', { params: { page } });
};

export const getTopRatedTVShows = async (page: number = 1): Promise<TVShowResponse> => {
  return tmdbClient.get<TVShowResponse>('/tv/top_rated', { params: { page } });
};

export const getTVShowDetails = async (id: number): Promise<TVShowDetails> => {
  return tmdbClient.get<TVShowDetails>(`/tv/${id}`);
};

export const getSeasonDetails = async (tvId: number, seasonNumber: number): Promise<SeasonDetails> => {
  return tmdbClient.get<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
};

// --- Discovery & Search ---

export const getGenres = async (type: 'movie' | 'tv'): Promise<GenreResponse> => {
  return tmdbClient.get<GenreResponse>(`/genre/${type}/list`);
};

export const discoverMedia = async (
  type: 'movie' | 'tv', 
  params: { page?: number; with_genres?: string }
): Promise<MovieResponse | TVShowResponse> => {
  return tmdbClient.get<MovieResponse | TVShowResponse>(`/discover/${String(type)}`, { params });
};

export const searchMedia = async (
  type: 'movie' | 'tv', 
  query: string, 
  page: number = 1
): Promise<MovieResponse | TVShowResponse> => {
  return tmdbClient.get<MovieResponse | TVShowResponse>(`/search/${type}`, { params: { query, page } });
};
export const getMovieRecommendations = async (id: number, page: number = 1): Promise<MovieResponse> => {
  return tmdbClient.get<MovieResponse>(`/movie/${id}/recommendations`, { params: { page } });
};

export const getSimilarMovies = async (id: number, page: number = 1): Promise<MovieResponse> => {
  return tmdbClient.get<MovieResponse>(`/movie/${id}/similar`, { params: { page } });
};

export const getTVShowRecommendations = async (id: number, page: number = 1): Promise<TVShowResponse> => {
  return tmdbClient.get<TVShowResponse>(`/tv/${id}/recommendations`, { params: { page } });
};

export const getSimilarTVShows = async (id: number, page: number = 1): Promise<TVShowResponse> => {
  return tmdbClient.get<TVShowResponse>(`/tv/${id}/similar`, { params: { page } });
};

export const searchMultiMedia = async (
  query: string,
  page: number = 1
): Promise<{ results: (Movie | TVShowDetails)[] }> => {
  return tmdbClient.get<{ results: (Movie | TVShowDetails)[] }>(`/search/multi`, { params: { query, page } });
};
