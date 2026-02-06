
import { Link } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContinueWatchingItem } from '@/hooks/useContinueWatching'

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem
  onRemove: (id: number, mediaType: 'movie' | 'tv') => void
}

export function ContinueWatchingCard({ item, onRemove }: ContinueWatchingCardProps) {
  const watchParams = { 
    mediaType: item.mediaType === 'movie' ? 'movies' : 'tv-shows', 
    id: item.id.toString() 
  };
  const watchSearch = { 
    season: 'season' in item && item.season ? item.season : 1, 
    episode: 'episode' in item && item.episode ? item.episode : 1 
  };

  return (
    <div className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden transition-all hover:shadow-2xl hover:shadow-yellow-500/5 cursor-pointer">
      {/* Main Link Area - Inside the relative container */}
      <Link 
        to="/watch/$mediaType/$id" 
        params={watchParams}
        search={watchSearch}
        className="absolute inset-0 z-10"
      />

      <div className="aspect-video relative overflow-hidden">
        {item.backdrop_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <span className="text-slate-600 font-medium">No Image</span>
          </div>
        )}
        
        {/* Hover Overlay with Delete Button - Pointer events none so it doesn't block the link */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20 pointer-events-none">
          <Button 
            size="icon" 
            variant="destructive" 
            className="rounded-full w-12 h-12 scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl cursor-pointer pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(item.id, item.mediaType);
            }}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>


        {item.mediaType === 'tv' && item.season && item.episode && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-black text-white border border-white/10 z-15">
            S{item.season} E{item.episode}
          </div>
        )}
      </div>

      <div className="p-4 relative z-0">
        <h3 className="font-bold text-base truncate text-white group-hover:text-yellow-500 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest bg-white/5 px-2 py-0.5 rounded">
            {item.mediaType === 'movie' ? 'Movie' : 'TV'}
          </p>
        </div>
      </div>
    </div>
  )
}
