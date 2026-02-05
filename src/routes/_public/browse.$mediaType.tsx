import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { 
  popularMoviesQueryOptions,
  popularTVShowsQueryOptions,
  genresQueryOptions,
  discoverMediaQueryOptions,
  searchMediaQueryOptions
} from '@/services/tmdb/queries'

import { MediaCard } from '@/components/Media/MediaCard'
import { FilterSidebar } from '@/components/Media/FilterBar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Film, Tv } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type BrowseSearch = {
  page: number
  q?: string
  genres?: string
}

export const Route = createFileRoute('/_public/browse/$mediaType')({
  validateSearch: (search: Record<string, unknown>): BrowseSearch => {
    return {
      page: Number(search?.page ?? 1) || 1,
      q: (search?.q as string) || undefined,
      genres: (search?.genres as string) || undefined,
    }
  },
  loaderDeps: ({ search: { page, q, genres } }) => ({ page, q, genres }),
  loader: async ({ params, deps: { page, q, genres }, context }) => {
    const { mediaType } = params
    const { queryClient } = context
    
    if (mediaType !== 'movies' && mediaType !== 'tv-shows') {
      throw notFound()
    }


    // Force type to be 'movie' | 'tv'
    const type = (mediaType === 'movies' ? 'movie' : 'tv') as 'movie' | 'tv'
    
    // Preload Genres
    await queryClient.ensureQueryData(genresQueryOptions(type))

    // Preload Main Content
    let options: any;
    if (q) {
      options = searchMediaQueryOptions(type, q, page);
    } else if (genres) {
      options = discoverMediaQueryOptions(type, { page, with_genres: genres });
    } else {
      options = mediaType === 'movies' 
        ? popularMoviesQueryOptions(page) 
        : popularTVShowsQueryOptions(page);
    }
    
    await queryClient.ensureQueryData(options)
    
    // We don't return data here, we let the component query it
    return { 
      page,
      q,
      genres,
      mediaType,
      type
    }
  },
  component: BrowsePage,
})

function BrowsePage() {
  const { page, q, genres: initialGenres, mediaType, type } = Route.useLoaderData()
  
  // Genres Query
  const genresQuery = useSuspenseQuery(genresQueryOptions(type))
  const genresList = genresQuery.data

  // Main Content Query
  let options: any;
  if (q) {
    options = searchMediaQueryOptions(type, q, page);
  } else if (initialGenres) {
    options = discoverMediaQueryOptions(type, { page, with_genres: initialGenres });
  } else {
    options = mediaType === 'movies' 
      ? popularMoviesQueryOptions(page) 
      : popularTVShowsQueryOptions(page);
  }

  const { data } = useSuspenseQuery(options) as { data: import('@/types').MovieResponse | import('@/types').TVShowResponse }
  const items = data.results
  const totalPages = Math.min(data.total_pages, 500)



  // Title Logic
  let title = mediaType === 'movies' ? 'Popular Movies' : 'Popular TV Shows';
  if (q) {
    title = `Search Results for "${q}"`;
  } else if (initialGenres) {
    title = 'Filtered Results';
  }

  const isMovies = mediaType === 'movies'

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-emerald-900/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto flex flex-col md:flex-row gap-8 px-4 md:px-8 pt-24 pb-12">
        {/* Sidebar - Sticky on Desktop */}
        <aside className="md:w-64 lg:w-72 md:sticky md:top-24 h-fit shrink-0">
          <FilterSidebar genres={genresList.genres} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8 min-w-0">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-yellow-500 mb-1 animate-in fade-in slide-in-from-left-4 duration-500">
                {isMovies ? <Film className="h-5 w-5" /> : <Tv className="h-5 w-5" />}
                <span className="text-sm font-bold uppercase tracking-wider">Browse</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                {title}
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                Discover {isMovies ? 'trending movies' : 'popular TV shows'} from around the world
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md h-fit animate-in fade-in zoom-in duration-500 delay-300">
              <span className="text-sm text-slate-400 font-medium">Page</span>
              <span className="text-sm font-bold text-yellow-500">{page}</span>
              <span className="text-sm text-slate-600">/</span>
              <span className="text-sm font-medium text-slate-300">{totalPages}</span>
            </div>

            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-backwards">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="animate-in fade-in zoom-in duration-500 fill-mode-backwards"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MediaCard item={item} />
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="pt-12 flex justify-center">
            <Pagination className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 w-fit">
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <Button
                    variant="ghost"
                    disabled={page <= 1}
                    className={`
                      h-10 px-4 rounded-xl gap-2 text-white hover:bg-white/10 hover:text-yellow-400 transition-all
                      ${page <= 1 ? 'opacity-30' : ''}
                    `}
                    asChild={page > 1}
                  >
                    {page > 1 ? (
                      <Link 
                        to="/browse/$mediaType" 
                        params={{ mediaType }} 
                        search={(prev) => ({ ...prev, page: page - 1 })}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Prev</span>
                      </Link>
                    ) : (
                      <span>
                        <ChevronLeft className="h-4 w-4" />
                        <span>Prev</span>
                      </span>
                    )}
                  </Button>
                </PaginationItem>
                
                <div className="hidden sm:flex items-center gap-1 px-4">
                  {[...Array(5)].map((_, i) => {
                    const p = page - 2 + i;
                    if (p < 1 || p > totalPages) return null;
                    const isActive = p === page;
                    
                    return (
                      <Button
                        key={p}
                        variant="ghost"
                        size="icon"
                        className={`
                          h-10 w-10 rounded-xl transition-all
                          ${isActive 
                            ? 'bg-yellow-500 text-black font-bold shadow-[0_0_15px_rgba(234,179,8,0.5)] hover:bg-yellow-400' 
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }
                        `}
                        asChild={!isActive}
                      >
                        {isActive ? (
                          <span>{p}</span>
                        ) : (
                           <Link 
                            to="/browse/$mediaType" 
                            params={{ mediaType }} 
                            search={(prev) => ({ ...prev, page: p })}
                          >
                            {p}
                          </Link>
                        )}
                      </Button>
                    );
                  })}
                </div>

                <PaginationItem>
                   <Button
                    variant="ghost"
                    disabled={page >= totalPages}
                    className={`
                      h-10 px-4 rounded-xl gap-2 text-white hover:bg-white/10 hover:text-yellow-400 transition-all
                      ${page >= totalPages ? 'opacity-30' : ''}
                    `}
                    asChild={page < totalPages}
                  >
                    {page < totalPages ? (
                      <Link 
                        to="/browse/$mediaType" 
                        params={{ mediaType }} 
                        search={(prev) => ({ ...prev, page: page + 1 })}
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span>
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          
          <div className="text-center text-slate-600 text-sm pb-8">
            Showing result {((page - 1) * 20) + 1} - {Math.min(page * 20, totalPages * 20)} of {totalPages * 20}
          </div>
        </div>
      </div>
    </div>
  )
}

