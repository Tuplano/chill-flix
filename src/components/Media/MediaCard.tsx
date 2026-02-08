import { Movie, TVShow } from '@/types';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from '@tanstack/react-router';

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
      search={mediaType === 'tv-shows' ? { season: 1, episode: 1 } : {}}
      preload="intent"
      className={cn("group block relative cursor-pointer overflow-hidden rounded-md transition-transform hover:scale-105", className)}
    >
      <AspectRatio ratio={2 / 3} className="bg-muted">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-opacity duration-300 pointer-events-none"
          loading="lazy"
        />
      </AspectRatio>

      {/* Hover Overlay - simple version */}
      <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-end p-4">
        <div>
          <h3 className="text-sm font-bold text-white line-clamp-2">{title}</h3>
          <p className="text-xs text-gray-300">{year}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] bg-yellow-500 text-black px-1 rounded font-bold">
              {item.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
