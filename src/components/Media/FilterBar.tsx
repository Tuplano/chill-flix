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
    <aside className="w-full md:w-64 lg:w-72 shrink-0 animate-in fade-in slide-in-from-left-8 duration-700">
      <div className="space-y-6">
        
        {/* Search Section */}
        <div className="group relative">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
           <div className="relative p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Search className="w-4 h-4 text-yellow-500" />
              Search
            </h3>
            <form onSubmit={handleSearch} className="relative group/input">
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer z-10">
                <Search className="h-4 w-4 text-slate-500 group-focus-within/input:text-yellow-500 transition-colors" />
              </button>
              <Input 
                type="text" 
                placeholder="Keywords..." 
                className="pl-10 h-11 bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-500 rounded-xl focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 transition-all hover:bg-white/10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
            
            {/* Active Search Badge */}
            {searchParams.q && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 w-full justify-between group/badge hover:bg-yellow-500/20 transition-colors">
                  <span className="truncate mr-2">"{searchParams.q}"</span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      navigate({
                        to: '/browse/$mediaType',
                        params: (prev: any) => prev,
                        search: (prev: any) => ({ ...prev, q: undefined, page: 1 }),
                      })
                    }}
                    className="hover:text-white transition-colors p-0.5 rounded-full hover:bg-white/10"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Genres Section */}
        <div className="rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl overflow-hidden">
          <button
            onClick={() => setIsGenresExpanded(!isGenresExpanded)}
            className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 group-hover:border-yellow-500/40 transition-colors">
                 <Filter className="h-4 w-4 text-yellow-500" />
              </div>
              <h3 className="font-bold text-slate-200">Genres</h3>
            </div>
             <div className="flex items-center gap-3">
              {selectedGenres.length > 0 && (
                <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 border-0 h-5 px-1.5 min-w-[1.25rem] justify-center">
                  {selectedGenres.length}
                </Badge>
              )}
              {isGenresExpanded ? (
                <ChevronUp className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
              )}
            </div>
          </button>

          {isGenresExpanded && (
            <div className="px-3 pb-3">
              <ScrollArea className="h-[400px] pr-3 -mr-3">
                <div className="space-y-1 pb-2">
                  {genres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre.id)
                    return (
                      <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.id)}
                        className={`
                          w-full px-4 py-3 rounded-xl text-left text-sm transition-all duration-300 border
                          ${isSelected 
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)] font-medium' 
                            : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span>{genre.name}</span>
                          {isSelected && (
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgb(234,179,8)] animate-in fade-in zoom-in" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
              
               {/* Actions Footer */}
              {activeFilterCount > 0 && (
                <div className="pt-3 mt-3 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2">
                   <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    size="sm"
                    className="w-full text-slate-400 hover:text-white hover:bg-white/10 h-9 rounded-lg"
                  >
                    <X className="h-3.5 w-3.5 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}