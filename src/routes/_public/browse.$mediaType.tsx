import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { 
  getPopularMovies, 
  getPopularTVShows, 
  getGenres, 
  discoverMedia, 
  searchMedia 
} from '@/services/tmdb-services'
import { MediaCard } from '@/components/Media/MediaCard'
import { FilterSidebar } from '@/components/Media/FilterBar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Film, Tv } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"

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
  loader: async ({ params, deps: { page, q, genres } }) => {
    const { mediaType } = params
    
    if (mediaType !== 'movies' && mediaType !== 'tv-shows') {
      throw notFound()
    }

    const type = mediaType === 'movies' ? 'movie' : 'tv'
    const genresList = await getGenres(type)

    let data;
    let title = mediaType === 'movies' ? 'Popular Movies' : 'Popular TV Shows';

    if (q) {
      data = await searchMedia(type, q, page);
      title = `Search Results for "${q}"`;
    } else if (genres) {
      data = await discoverMedia(type, { page, with_genres: genres });
      title = 'Filtered Results';
    } else {
      data = mediaType === 'movies' 
        ? await getPopularMovies(page) 
        : await getPopularTVShows(page)
    }

    return { 
      items: data.results,
      title,
      page,
      totalPages: Math.min(data.total_pages, 500),
      genres: genresList.genres
    }
  },
  component: BrowsePage,
})

function BrowsePage() {
  const { items, title, page, totalPages, genres } = Route.useLoaderData()
  const { mediaType } = Route.useParams()
  const isMovies = mediaType === 'movies'

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-8 px-4 md:px-8 pt-28 pb-12">
        {/* Sidebar */}
        <FilterSidebar genres={genres} />

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Page Info */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-yellow-500 mb-1">
                {isMovies ? <Film className="h-5 w-5" /> : <Tv className="h-5 w-5" />}
                <span className="text-sm font-bold uppercase tracking-wider">Browse</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {title}
              </h1>
              <p className="text-slate-400 max-w-2xl">
                Discover {isMovies ? 'trending movies' : 'popular TV shows'} from around the world
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm h-fit">
              <span className="text-sm text-slate-400">Page</span>
              <span className="text-sm font-semibold text-yellow-500">{page}</span>
              <span className="text-sm text-slate-500">/</span>
              <span className="text-sm text-slate-300">{totalPages}</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {items.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination Section */}
          <div className="pt-8 border-t border-slate-800/50">
            <div className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <Pagination>
                  <PaginationContent className="gap-1">
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        disabled={page <= 1}
                        className={`
                          gap-2 px-4 h-10 rounded-lg transition-all duration-200
                          ${page <= 1 
                            ? 'opacity-40 cursor-not-allowed' 
                            : 'hover:bg-yellow-500/10 hover:text-yellow-500 hover:scale-105 active:scale-95'
                          }
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
                            <span className="font-medium">Previous</span>
                          </Link>
                        ) : (
                          <div>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="font-medium">Previous</span>
                          </div>
                        )}
                      </Button>
                    </PaginationItem>
                    
                    <PaginationItem>
                      <div className="flex items-center gap-2 px-6 h-10">
                        <span className="text-sm text-slate-400">Page</span>
                        <span className="min-w-[2rem] text-center px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 font-bold text-sm border border-yellow-500/20">
                          {page}
                        </span>
                        <span className="text-sm text-slate-500">/</span>
                        <span className="text-sm font-medium text-slate-300">{totalPages}</span>
                      </div>
                    </PaginationItem>

                    <PaginationItem>
                      <Button
                        variant="ghost"
                        disabled={page >= totalPages}
                        className={`
                          gap-2 px-4 h-10 rounded-lg transition-all duration-200
                          ${page >= totalPages 
                            ? 'opacity-40 cursor-not-allowed' 
                            : 'hover:bg-yellow-500/10 hover:text-yellow-500 hover:scale-105 active:scale-95'
                          }
                        `}
                        asChild={page < totalPages}
                      >
                        {page < totalPages ? (
                          <Link 
                            to="/browse/$mediaType" 
                            params={{ mediaType }} 
                            search={(prev) => ({ ...prev, page: page + 1 })}
                          >
                            <span className="font-medium">Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <div>
                            <span className="font-medium">Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-500">
                  Showing {((page - 1) * 20) + 1} - {Math.min(page * 20, totalPages * 20)} of {totalPages * 20} results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
