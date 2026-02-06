
import { Link } from '@tanstack/react-router'
import { Play, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContinueWatchingItem } from '@/hooks/useContinueWatching'

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem
  onRemove: (id: number, mediaType: 'movie' | 'tv') => void
}

export function ContinueWatchingCard({ item, onRemove }: ContinueWatchingCardProps) {
  return (
    <div className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-yellow-500/50 transition-colors">
      <div className="aspect-video relative overflow-hidden">
        {item.backdrop_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <span className="text-slate-500">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <Button asChild size="icon" className="rounded-full bg-yellow-500 hover:bg-yellow-400 text-black">
             <Link 
              to="/watch/$mediaType/$id" 
              params={{ mediaType: item.mediaType === 'movie' ? 'movies' : 'tv-shows', id: item.id.toString() }}
              search={{ 
                season: 'season' in item && item.season ? item.season : 1, 
                episode: 'episode' in item && item.episode ? item.episode : 1 
              }}
            >
              <Play className="w-5 h-5 fill-current" />
            </Link>
          </Button>
          <Button 
            size="icon" 
            variant="destructive" 
            className="rounded-full"
            onClick={() => onRemove(item.id, item.mediaType)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
         {item.mediaType === 'tv' && item.season && item.episode && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-bold text-white border border-white/10">
            S{item.season} E{item.episode}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg truncate text-white group-hover:text-yellow-500 transition-colors">{item.title}</h3>
        <p className="text-sm text-slate-400 capitalize">{item.mediaType === 'movie' ? 'Movie' : 'TV Series'}</p>
      </div>
    </div>
  )
}
