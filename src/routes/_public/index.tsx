import { MediaRow } from '@/components/Media/MediaRow'
import { Hero } from '@/components/Media/Hero'
import { getTrendingMovies, getTrendingTVShows, getNowPlayingMovies } from '@/services/tmdb-services'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/')({
  loader: async () => {
    const [trendingMovies, trendingTVShows, newMovies] = await Promise.all([
      getTrendingMovies(),
      getTrendingTVShows(),
      getNowPlayingMovies(),
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
        />
        <MediaRow 
          title="Trending TV Shows" 
          items={trendingTVShows.results} 
        />
      </div>
    </div>
  )
}
