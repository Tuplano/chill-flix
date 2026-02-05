import { useState, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { Genre } from '@/types/tmdb'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FilterSidebarProps {
  genres: Genre[]
}

export function FilterSidebar({ genres }: FilterSidebarProps) {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/_public/browse/$mediaType' })
  
  const [query, setQuery] = useState(searchParams.q || '')
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    searchParams.genres ? searchParams.genres.split(',').map(Number) : []
  )
  const [isGenresExpanded, setIsGenresExpanded] = useState(true)

  // Sync state with URL
  useEffect(() => {
    setQuery(searchParams.q || '')
    setSelectedGenres(searchParams.genres ? searchParams.genres.split(',').map(Number) : [])
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      to: '/browse/$mediaType',
      params: (prev: any) => prev,
      search: (prev: any) => ({ ...prev, q: query || undefined, page: 1 }),
    })
  }

  const toggleGenre = (genreId: number) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId]
    
    setSelectedGenres(newGenres)
    
    navigate({
      to: '/browse/$mediaType',
      params: (prev: any) => prev,
      search: (prev: any) => ({ 
        ...prev, 
        genres: newGenres.length > 0 ? newGenres.join(',') : undefined, 
        page: 1 
      }),
    })
  }

  const clearFilters = () => {
    setQuery('')
    setSelectedGenres([])
    navigate({
      to: '/browse/$mediaType',
      params: (prev: any) => prev,
      search: (prev: any) => ({ ...prev, q: undefined, genres: undefined, page: 1 }),
    })
  }

  const activeFilterCount = (searchParams.q ? 1 : 0) + selectedGenres.length

  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Sidebar Header */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <Filter className="h-4 w-4 text-yellow-500" />
              </div>
              <h2 className="text-lg font-semibold text-slate-200">Filters</h2>
            </div>
            {activeFilterCount > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30">
                {activeFilterCount}
              </Badge>
            )}
          </div>

          {/* Clear All Filters */}
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="w-full justify-start text-slate-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Clear all filters
            </Button>
          )}
        </div>

        {/* Search Section */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm space-y-3">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Search</h3>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-500 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          {searchParams.q && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                "{searchParams.q}"
                <button
                  onClick={() => {
                    setQuery('')
                    navigate({
                      to: '/browse/$mediaType',
                      params: (prev: any) => prev,
                      search: (prev: any) => ({ ...prev, q: undefined, page: 1 }),
                    })
                  }}
                  className="ml-1 hover:text-yellow-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}
        </div>

        {/* Genres Section */}
        <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
          <button
            onClick={() => setIsGenresExpanded(!isGenresExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-slate-300">Genres</h3>
              {selectedGenres.length > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-xs">
                  {selectedGenres.length}
                </Badge>
              )}
            </div>
            {isGenresExpanded ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {isGenresExpanded && (
            <div className="px-4 pb-4">
              <ScrollArea className="h-[400px] pr-2">
                <div className="space-y-1">
                  {genres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre.id)
                    return (
                      <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.id)}
                        className={`
                          w-full px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-200
                          ${isSelected 
                            ? 'bg-yellow-500/20 text-yellow-500 font-medium border border-yellow-500/30 shadow-sm' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span>{genre.name}</span>
                          {isSelected && (
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {selectedGenres.length > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30 backdrop-blur-sm">
            <h3 className="text-xs font-medium text-slate-400 mb-3">Active Genres</h3>
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genreId) => {
                const genre = genres.find(g => g.id === genreId)
                return genre ? (
                  <Badge 
                    key={genreId}
                    variant="secondary"
                    className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 cursor-pointer"
                    onClick={() => toggleGenre(genreId)}
                  >
                    {genre.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ) : null
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}