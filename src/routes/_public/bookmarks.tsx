import { createFileRoute, Link } from '@tanstack/react-router'
import { useContinueWatching } from '@/hooks/useContinueWatching'
import { MediaCard } from '@/components/Media/MediaCard'
import { Button } from '@/components/ui/button'
import { Bookmark, Play } from 'lucide-react'
import { ContinueWatchingCard } from '@/components/Media/ContinueWatchingCard'
import { useSuspenseQuery } from '@tanstack/react-query'
import { similarMoviesQueryOptions, similarTVShowsQueryOptions, trendingMoviesQueryOptions } from '@/services/tmdb/queries'

export const Route = createFileRoute('/_public/bookmarks')({
  component: BookmarksPage,
})

function BookmarksPage() {
  const { items, removeFromContinueWatching } = useContinueWatching()
  
  // Get recommendations based on the most recently watched item, or fallback to trending
  const lastWatched = items[0]
  
  let recommendationsQueryOptions: any = trendingMoviesQueryOptions()
  
  if (lastWatched) {
    console.log("lastWatched",lastWatched)
    recommendationsQueryOptions = lastWatched.mediaType === 'movie'
      ? similarMoviesQueryOptions(lastWatched.id)
      : similarTVShowsQueryOptions(lastWatched.id)
  }

  const { data: recommendations } = useSuspenseQuery(recommendationsQueryOptions) as any

  return (
    <div className="min-h-screen bg-black text-white pb-20">
       <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 space-y-12">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-8">
          <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
            <Bookmark className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Library</h1>
            <p className="text-slate-400 mt-1">Continue watching your favorite shows</p>
          </div>
        </div>

        {/* Continue Watching Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-2">
            <Play className="w-5 h-5 text-yellow-500 fill-current" />
            Continue Watching
          </h2>
          
          {items.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-slate-400">
               <p className="text-lg mb-4">You haven't watched anything yet.</p>
               <Button asChild className="bg-yellow-500 text-black hover:bg-yellow-400">
                 <Link to="/browse/$mediaType" params={{ mediaType: 'movies' }} search={{ page: 1 }}>Start Browsing</Link>
               </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ContinueWatchingCard 
                  key={`${item.mediaType}-${item.id}`} 
                  item={item} 
                  onRemove={removeFromContinueWatching} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="pt-8 border-t border-white/10 space-y-6">
           <h2 className="text-2xl font-bold text-slate-200">
            {lastWatched ? `Because you watched ${lastWatched.title}` : 'Trending Now'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendations?.results?.slice(0, 10).map((item: any) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
