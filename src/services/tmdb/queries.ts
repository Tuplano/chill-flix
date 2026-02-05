import { queryOptions } from '@tanstack/react-query';
import { 
  getTrendingMovies, 
  getTrendingTVShows, 
  getNowPlayingMovies,
  getPopularMovies,
  getPopularTVShows,
  getMovieDetails,
  getTVShowDetails,
  getMovieRecommendations,
  getTVShowRecommendations,
  getSimilarMovies,
  getSimilarTVShows,
  getGenres,
  discoverMedia,
  searchMedia,
  getSeasonDetails
} from './services';



export const trendingMoviesQueryOptions = (timeWindow: 'day' | 'week' = 'week') =>
  queryOptions({
    queryKey: ['trending', 'movie', timeWindow],
    queryFn: () => getTrendingMovies(timeWindow),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const trendingTVShowsQueryOptions = (timeWindow: 'day' | 'week' = 'week') =>
  queryOptions({
    queryKey: ['trending', 'tv', timeWindow],
    queryFn: () => getTrendingTVShows(timeWindow),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const nowPlayingMoviesQueryOptions = (page: number = 1) =>
  queryOptions({
    queryKey: ['movies', 'now_playing', page],
    queryFn: () => getNowPlayingMovies(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const popularMoviesQueryOptions = (page: number = 1) =>
  queryOptions({
    queryKey: ['movies', 'popular', page],
    queryFn: () => getPopularMovies(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const popularTVShowsQueryOptions = (page: number = 1) =>
  queryOptions({
    queryKey: ['tv', 'popular', page],
    queryFn: () => getPopularTVShows(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const movieDetailsQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const tvShowDetailsQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ['tv', id],
    queryFn: () => getTVShowDetails(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const movieRecommendationsQueryOptions = (id: number, page: number = 1) =>
  queryOptions({
    queryKey: ['movie', id, 'recommendations', page],
    queryFn: () => getMovieRecommendations(id, page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const tvShowRecommendationsQueryOptions = (id: number, page: number = 1) =>
  queryOptions({
    queryKey: ['tv', id, 'recommendations', page],
    queryFn: () => getTVShowRecommendations(id, page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const similarMoviesQueryOptions = (id: number, page: number = 1) =>
  queryOptions({
    queryKey: ['movie', id, 'similar', page],
    queryFn: () => getSimilarMovies(id, page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const similarTVShowsQueryOptions = (id: number, page: number = 1) =>
  queryOptions({
    queryKey: ['tv', id, 'similar', page],
    queryFn: () => getSimilarTVShows(id, page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const genresQueryOptions = (type: 'movie' | 'tv') =>
  queryOptions({
    queryKey: ['genres', type],
    queryFn: () => getGenres(type),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (genres rarely change)
  });

export const discoverMediaQueryOptions = (type: 'movie' | 'tv', params: { page?: number; with_genres?: string }) =>
  queryOptions({
    queryKey: ['discover', type, params],
    queryFn: () => discoverMedia(type, params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const searchMediaQueryOptions = (type: 'movie' | 'tv', query: string, page: number = 1) =>
  queryOptions({
    queryKey: ['search', type, query, page],
    queryFn: () => searchMedia(type, query, page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const seasonDetailsQueryOptions = (tvId: number, seasonNumber: number) =>
  queryOptions({
    queryKey: ['tv', tvId, 'season', seasonNumber],
    queryFn: () => getSeasonDetails(tvId, seasonNumber),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

