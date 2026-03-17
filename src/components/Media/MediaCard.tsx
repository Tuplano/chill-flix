import { Movie, TVShow } from '@/types';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { Star } from 'lucide-react';

interface MediaCardProps {
  item: Movie | TVShow;
  className?: string;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';

export function MediaCard({ item, className }: MediaCardProps) {
  const title = 'title' in item ? item.title : item.name;
  const date = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = date ? new Date(date).getFullYear() : '';
  const mediaType = 'title' in item ? 'movies' : 'tv-shows';

  const imageUrl = item.poster_path
    ? `${IMAGE_BASE_URL}${item.poster_path}`
    : '/placeholder-image.jpg';

  return (
    <Link
      to="/watch/$mediaType/$id"
      params={{ mediaType, id: item.id.toString() }}
      search={{ season: 1, episode: 1 }}
      className={cn("group block relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/60 active:scale-95", className)}
    >
      <AspectRatio ratio={2 / 3} className="bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-opacity duration-300 pointer-events-none"
          loading="lazy"
        />
      </AspectRatio>

      {/* Always-visible bottom info (mobile-first) */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-8 pb-2 px-2 pointer-events-none">
        <h3 className="text-xs font-semibold text-white line-clamp-1 leading-tight">{title}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <Badge className="bg-yellow-500 text-black font-bold border-0 text-[9px] px-1.5 py-0 h-4 gap-0.5">
            <Star className="size-2 fill-black" />
            {item.vote_average.toFixed(1)}
          </Badge>
          {year && <span className="text-[9px] text-gray-400">{year}</span>}
        </div>
      </div>

      {/* Desktop hover overlay — enhances the always-visible info */}
      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:flex items-end p-3">
        <div>
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">{title}</h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Badge className="bg-yellow-500 text-black font-bold border-0 text-[10px] gap-0.5">
              <Star className="size-2.5 fill-black" />
              {item.vote_average.toFixed(1)}
            </Badge>
            {year && <span className="text-xs text-gray-300">{year}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
