import { MediaRow } from '@/components/Media/MediaRow'
import { Hero } from '@/components/Media/Hero'
import { trendingMoviesQueryOptions, trendingTVShowsQueryOptions, nowPlayingMoviesQueryOptions } from '@/services/tmdb/queries'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/')({
  loader: async ({ context }) => {
    const { queryClient } = context
    const [trendingMovies, trendingTVShows, newMovies] = await Promise.all([
      queryClient.ensureQueryData(trendingMoviesQueryOptions()),
      queryClient.ensureQueryData(trendingTVShowsQueryOptions()),
      queryClient.ensureQueryData(nowPlayingMoviesQueryOptions()),
    ])
    return { trendingMovies, trendingTVShows, newMovies }
  },
  component: App,
})

function App() {
  const { trendingMovies, trendingTVShows, newMovies } = Route.useLoaderData()

  return (
    <div className="space-y-4 pb-20 bg-black min-h-screen">
      <Hero items={newMovies.results} />
      
      <div className="relative z-10 -mt-32 space-y-12">
        <MediaRow 
          title="Trending Movies" 
          items={trendingMovies.results} 
          autoPlay 
          mediaType="movies"
        />
        <MediaRow 
          title="Trending TV Shows" 
          items={trendingTVShows.results} 
          mediaType="tv-shows"
        />
      </div>
    </div>
  )
}
