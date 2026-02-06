import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router';
import { 
  movieDetailsQueryOptions,
  tvShowDetailsQueryOptions,
  movieRecommendationsQueryOptions,
  tvShowRecommendationsQueryOptions,
  seasonDetailsQueryOptions,
  similarMoviesQueryOptions,
  similarTVShowsQueryOptions,
} from '@/services/tmdb/queries';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MediaRow } from '@/components/Media/MediaRow';
import { Star, ChevronLeft, Bookmark, Share2, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const watchPageSearchSchema = z.object({
  season: z.coerce.number().optional().default(1),
  episode: z.coerce.number().optional().default(1),
});

export const Route = createFileRoute('/_public/watch/$mediaType/$id')({
  validateSearch: (search) => watchPageSearchSchema.parse(search),
  loaderDeps: ({ search: { season, episode } }) => ({ season, episode }),
  loader: async ({ params, deps: { season, episode }, context }) => {
    const { mediaType, id } = params;
    const { queryClient } = context;
    const numericId = parseInt(id);

    if (isNaN(numericId)) throw notFound();

    try {
      if (mediaType === 'movies') {
        const [details, recommendationsData, similarData] = await Promise.all([
          queryClient.ensureQueryData(movieDetailsQueryOptions(numericId)),
          queryClient.ensureQueryData(movieRecommendationsQueryOptions(numericId)),
          queryClient.ensureQueryData(similarMoviesQueryOptions(numericId))
        ]);

        const combined = [...recommendationsData.results, ...similarData.results];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

        return { 
          details, 
          recommendations: unique, 
          type: 'movie' as const,
          seasonDetails: null 
        };
      } else if (mediaType === 'tv-shows') {
        const [details, recommendationsData, similarData, seasonDetails] = await Promise.all([
          queryClient.ensureQueryData(tvShowDetailsQueryOptions(numericId)),
          queryClient.ensureQueryData(tvShowRecommendationsQueryOptions(numericId)),
          queryClient.ensureQueryData(similarTVShowsQueryOptions(numericId)),
          queryClient.ensureQueryData(seasonDetailsQueryOptions(numericId, season))
        ]);

        const combined = [...recommendationsData.results, ...similarData.results];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

        return { 
          details, 
          recommendations: unique, 
          type: 'tv' as const,
          seasonDetails
        };
      } else {
        throw notFound();
      }
    } catch (error) {
      console.error('Error loading watch page:', error);
      throw notFound();
    }
  },
  component: WatchPage,
});

function WatchPage() {
  const { details, recommendations, type, seasonDetails } = Route.useLoaderData();
  const { id } = Route.useParams();
  const { season, episode } = Route.useSearch();
  const navigate = useNavigate();

  const title = 'title' in details ? details.title : details.name;
  const overview = details.overview;
  const rating = details.vote_average;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  
  const baseUrl = import.meta.env.VITE_PLAYER_BASE_URL || 'https://vidsrc-embed.ru/embed/';
  const playerUrl = type === 'movie' 
    ? `${baseUrl}movie?tmdb=${id}&autoplay=1`
    : `${baseUrl}tv?tmdb=${id}&season=${season}&episode=${episode}&autoplay=1&autonext=1`; 

  const handleEpisodeChange = (newEpisode: number) => {
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, episode: newEpisode }),
    });
  };

  const handleSeasonChange = (newSeason: number) => {
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, season: newSeason, episode: 1 }),
    });
  };

  return (
    
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Top Navigation / Back Button - Floating Glass */}
      {/* Top Navigation / Back Button - Floating Glass */}
      <div className="fixed top-20 left-0 right-0 z-40 pointer-events-none">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/browse/$mediaType" 
            params={{ mediaType: type === 'movie' ? 'movies' : 'tv-shows' }}
            search={{ page: 1 }}
            className="inline-flex items-center text-slate-300 hover:text-white transition-all gap-2 group bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 pointer-events-auto hover:bg-white/10 hover:border-white/20"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Back to Browse</span>
          </Link>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 xl:gap-12">
          {/* Left Side: Player & TV Controls */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Video Player */}
            <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <AspectRatio ratio={16 / 9} className="bg-slate-900">
                <iframe
                  key={`${season}-${episode}`}
                  src={playerUrl}
                  className="h-full w-full"
                  allowFullScreen
                  frameBorder="0"
                  scrolling="no"
                  title={title}
                />
              </AspectRatio>
            </div>

            {/* Mobile Info Panel (visible only on smaller screens) */}
            <div className="xl:hidden">
              <MobileInfoPanel 
                details={details}
                title={title}
                type={type}
                season={season}
                episode={episode}
                rating={rating}
                year={year}
                releaseDate={releaseDate}
                overview={overview}
              />
            </div>

            {/* Episode Selector for TV Shows */}
            {type === 'tv' && seasonDetails && (
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Season {season}</h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 gap-2 h-9 rounded-full px-4"
                        >
                          Switch Season 
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-900/95 border-slate-800 text-slate-200 max-h-[300px] overflow-y-auto backdrop-blur-xl">
                        {'seasons' in details && details.seasons.map((s) => (
                          <DropdownMenuItem 
                            key={s.id}
                            onClick={() => handleSeasonChange(s.season_number)}
                            className={cn(
                              "focus:bg-yellow-500/20 focus:text-yellow-400 cursor-pointer transition-colors py-2.5",
                              season === s.season_number ? "bg-yellow-500/10 text-yellow-500 font-semibold" : ""
                            )}
                          >
                            {s.name || `Season ${s.season_number}`}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-slate-300 hover:bg-white/15 px-3 py-1.5 h-auto">
                    {seasonDetails.episodes.length} Episodes
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {seasonDetails.episodes.map((ep) => (
                    <Button
                      key={ep.id}
                      variant="outline"
                      onClick={() => handleEpisodeChange(ep.episode_number)}
                      className={cn(
                        "h-12 w-full font-bold transition-all duration-300 rounded-xl border-0 relative overflow-hidden",
                        ep.episode_number === episode 
                          ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      {ep.episode_number}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Info Panel (Desktop) */}
          <div className="hidden xl:block">
            <div className="sticky top-28 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <DesktopInfoPanel 
                details={details}
                title={title}
                type={type}
                season={season}
                episode={episode}
                rating={rating}
                year={year}
                releaseDate={releaseDate}
                overview={overview}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 py-16">
          <MediaRow 
            title="You may also like" 
            items={recommendations} 
            mediaType={type === 'movie' ? 'movies' : 'tv-shows'}
          />
        </div>
      </div>
    </div>
  );
}

// Desktop Info Panel Component
function DesktopInfoPanel({ details, title, type, season, episode, rating, year, releaseDate, overview }: any) {
  return (
    <>
      {/* Poster */}
      <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 aspect-[2/3] relative group mb-6">
        <img 
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        
        {/* Rating Overlay */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-white font-bold">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white leading-tight mb-2 tracking-tight">
            {title}
          </h1>
          {type === 'tv' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-sm">
              Season {season} • Episode {episode}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="border-white/20 text-slate-300 px-3 py-1 h-7">
            {year}
          </Badge>
          <Badge variant="outline" className="border-white/20 text-slate-300 px-3 py-1 h-7">
            HD
          </Badge>
          <div className="w-1 h-1 rounded-full bg-slate-500" />
          <span className="text-slate-400 text-sm">{releaseDate}</span>
        </div>

        {/* Overview */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          {'tagline' in details && details.tagline && (
            <p className="text-slate-400 italic text-sm font-medium leading-relaxed">
              "{details.tagline}"
            </p>
          )}
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Synopsis</h3>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-[10]">
            {overview}
          </p>
        </div>


      </div>
    </>
  );
}

// Mobile Info Panel Component
function MobileInfoPanel({ details, title, type, season, episode, rating, year, releaseDate, overview }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 space-y-6">
      <div className="flex gap-5">
        {/* Poster Thumbnail */}
        <div className="w-28 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg aspect-[2/3]">
          <img 
            src={`https://image.tmdb.org/t/p/w200${details.poster_path}`} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title and Metadata */}
        <div className="flex-1 space-y-3 py-1">
          <h1 className="text-xl font-bold text-white leading-tight line-clamp-2">
            {title}
          </h1>
          
          {type === 'tv' && (
             <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-xs">
              S{season} E{episode}
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-slate-400">
             <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              {rating.toFixed(1)}
            </div>
            <span>•</span>
            <span>{year}</span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        {'tagline' in details && details.tagline && (
          <p className="text-slate-400 italic text-sm">"{details.tagline}"</p>
        )}
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
          {overview}
        </p>
      </div>


    </div>
  );
}