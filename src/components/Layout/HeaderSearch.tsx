import { useNavigate, useLocation } from '@tanstack/react-router';
import { Film, Search, X, Star, Tv, Clapperboard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { multiSearchInfiniteQueryOptions } from '@/services/tmdb/queries';

export function HeaderSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isTVContext = location.pathname.includes('tv-shows');
  const searchContext = isTVContext ? 'tv-shows' : 'movies';
  const searchPlaceholder = isTVContext ? 'Search TV Shows...' : 'Search Movies...';

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results with infinite scrolling
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery(multiSearchInfiniteQueryOptions(debouncedQuery));

  const searchResults = data?.pages.flatMap((page) => page.results) || [];

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: '/browse/$mediaType',
        params: { mediaType: searchContext },
        search: { q: searchQuery, page: 1 },
      });
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = (item: any) => {
    const mediaType = item.media_type === 'tv' ? 'tv-shows' : 'movies';
    navigate({
      to: '/watch/$mediaType/$id',
      params: { mediaType, id: item.id.toString() },
      search: { season: 1, episode: 1 },
    });
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative ">
      <div className={cn(
        "flex items-center transition-all duration-300 ease-in-out rounded-full border z-50",
        isSearchOpen 
          ? "fixed top-3 left-3 right-16 w-auto h-12 bg-black/95 backdrop-blur-md border-white/20 px-3 md:relative md:top-auto md:left-auto md:right-auto md:w-full md:max-w-[300px] md:h-9" 
          : "relative w-10 bg-transparent border-transparent"
      )}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            if (isSearchOpen && searchQuery) {
              handleSearch({ preventDefault: () => {} } as React.FormEvent);
            } else {
              setIsSearchOpen(!isSearchOpen);
            }
          }}
          className="text-slate-300 hover:text-white hover:bg-transparent rounded-full shrink-0 hover:cursor-pointer"
        >
          <Search className="h-5 w-5 h" />
        </Button>
        
        <form onSubmit={handleSearch} className="flex-1 min-w-0">
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              "border-0 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-0 px-2 h-9",
              !isSearchOpen && "hidden"
            )}
            onBlur={() => {
              // Slight delay to allow clicking on results
              setTimeout(() => {
                if (!document.activeElement?.closest('[data-slot="switch"]') && !searchQuery) { 
                   setIsSearchOpen(false);
                }
              }, 200);
            }}
          />
        </form>
        
        {isSearchOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearchQuery('');
              setIsSearchOpen(false);
            }}
            className="h-8 w-8 text-slate-400 hover:text-white hover:cursor-pointer rounded-full shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Live Search Results Dropdown */}
      {isSearchOpen && debouncedQuery.length > 2 && (
        <div className="fixed top-[64px] left-3 w-[calc(100vw-24px)] md:absolute md:top-full md:mt-3 md:left-auto md:right-0 md:w-[400px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 max-h-[80vh] flex flex-col">
          <div className="p-2 space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar">
            {searchResults.length > 0 ? (
               searchResults
                .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
                .map((item: any) => (
                <button
                  key={`${item.id}-${item.media_type}`} // Ensure unique keys
                  onClick={() => handleResultClick(item)}
                  className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left group hover:cursor-pointer"
                >
                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
                    {item.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} 
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Film className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="font-bold text-slate-200 text-sm truncate group-hover:text-yellow-500 transition-colors">
                      {item.title || item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
                        {item.media_type === 'movie' ? <Clapperboard className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                        {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                      </span>
                      {item.vote_average > 0 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-500">
                          <Star className="w-3 h-3 fill-yellow-500" />
                          {item.vote_average.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
               !isLoading && (
                <div className="p-4 text-center text-slate-500 text-sm">
                  No results found for "{searchQuery}"
                </div>
               )
            )}
            
            {/* Load More Button or Loader */}
            {hasNextPage && (
              <div className="pt-2 pb-1 text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fetchNextPage();
                  }}
                  disabled={isFetchingNextPage}
                  className="w-full text-xs text-slate-400 hover:text-white hover:bg-white/5 uppercase tracking-wider"
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    "Load More Results"
                  )}
                </Button>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
