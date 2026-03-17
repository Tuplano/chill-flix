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
    <div className="bg-black min-h-screen pb-20">
      <Hero items={newMovies.results} />

      <div className="relative z-10 -mt-16 sm:-mt-24 md:-mt-32 space-y-6 md:space-y-10">
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
