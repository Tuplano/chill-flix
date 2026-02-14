import { createFileRoute, Link, notFound, useNavigate, redirect } from '@tanstack/react-router';
import { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

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
import { useContinueWatching } from '@/hooks/useContinueWatching';
import { useWatchHistory } from '@/hooks/useWatchHistory';
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
  season: z.coerce.number().optional(),
  episode: z.coerce.number().optional(),
});

export const Route = createFileRoute('/_public/watch/$mediaType/$id')({
  validateSearch: (search) => watchPageSearchSchema.parse(search),
  beforeLoad: ({ params, search }) => {
    if (params.mediaType === 'tv-shows' && (!search.season || !search.episode)) {
      throw redirect({
        to: '.',
        search: (prev) => ({ ...prev, season: 1, episode: 1 }),
        replace: true,
      });
    }

    if (params.mediaType === 'movies' && (search.season || search.episode)) {
      throw redirect({
        to: '.',
        search: (prev) => {
          const { season: _, episode: __, ...rest } = prev;
          return rest;
        },
        replace: true,
      });
    }
  },
  loaderDeps: ({ search: { season, episode } }) => ({ season, episode }),
  loader: async ({ params, context }) => {
    const { mediaType, id } = params;
    const { queryClient } = context;
    const numericId = parseInt(id);

    if (isNaN(numericId)) throw notFound();

    try {
      if (mediaType === 'movies') {
        const details = await queryClient.ensureQueryData(movieDetailsQueryOptions(numericId));
        return { details, type: 'movie' as const };
      } else if (mediaType === 'tv-shows') {
        const details = await queryClient.ensureQueryData(tvShowDetailsQueryOptions(numericId));
        return { details, type: 'tv' as const };
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
  const { details, type } = Route.useLoaderData();
  const { id } = Route.useParams();
  const { season = 1, episode = 1 } = Route.useSearch();
  const numericId = parseInt(id);
  const navigate = useNavigate();

  // Background fetch recommendations
  const movieRecs = useQuery({
    ...movieRecommendationsQueryOptions(numericId),
    enabled: type === 'movie'
  });
  const tvRecs = useQuery({
    ...tvShowRecommendationsQueryOptions(numericId),
    enabled: type === 'tv'
  });

  const movieSimilar = useQuery({
    ...similarMoviesQueryOptions(numericId),
    enabled: type === 'movie'
  });
  const tvSimilar = useQuery({
    ...similarTVShowsQueryOptions(numericId),
    enabled: type === 'tv'
  });

  const { data: seasonDetails } = useQuery({
    ...seasonDetailsQueryOptions(numericId, season),
    enabled: type === 'tv'
  });

  const recommendations = useMemo(() => {
    const recs = type === 'movie' ? movieRecs.data : tvRecs.data;
    const similar = type === 'movie' ? movieSimilar.data : tvSimilar.data;

    const combined = [
      ...(recs?.results || []),
      ...(similar?.results || [])
    ];
    return Array.from(new Map(combined.map(item => [item.id, item])).values());
  }, [type, movieRecs.data, tvRecs.data, movieSimilar.data, tvSimilar.data]);

  const title = 'title' in details ? details.title : details.name;
  const overview = details.overview;
  const genres = details.genres.map((genre: { name: string }) => genre.name).join(', ');
  const rating = details.vote_average;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';


  const [selectedServer, setSelectedServer] = useState<'vidsrc' | 'letsembed' | 'autoembed' | 'vidsrc-online' | 'vidstreams'>('letsembed');

  const servers = [
    // { id: 'vidsrc' as const, name: 'Server 1' },
    // { id: 'letsembed' as const, name: 'Server 1' },
    { id: 'autoembed' as const, name: 'Server 1' },
    { id: 'vidsrc-online' as const, name: 'Server 2' },
    { id: 'vidstreams' as const, name: 'Server 3' },
  ];




  const baseUrl = import.meta.env.VITE_PLAYER_BASE_URL || 'https://vidsrcme.ru//embed/';
  const letsEmbedBaseUrl = import.meta.env.VITE_LETSEMBED_BASE_URL || 'https://letsembed.cc/embed/';
  const autoEmbedBaseUrl = import.meta.env.VITE_AUTOEMBED_BASE_URL || 'https://player.autoembed.cc/embed/';
  const vidsrcOnlineBaseUrl = import.meta.env.VITE_VIDSRC_ONLINE_BASE_URL || 'https://vidsrc.online/embed/';
  const vidstreamsBaseUrl = import.meta.env.VITE_VIDSTREAMS_BASE_URL || 'https://vidstreams.net/embed/';

  const getPlayerUrl = () => {
    if (selectedServer === 'vidsrc') {
      return type === 'movie'
        ? `${baseUrl}movie/${id}`
        : `${baseUrl}tv/${id}/${season}/${episode}`;
    } else if (selectedServer === 'letsembed') {
      return type === 'movie'
        ? `${letsEmbedBaseUrl}movie/?id=${id}`
        : `${letsEmbedBaseUrl}tv/?id=${id}/${season}/${episode}`;
    } else if (selectedServer === 'autoembed') {
      return type === 'movie'
        ? `${autoEmbedBaseUrl}movie/${id}`
        : `${autoEmbedBaseUrl}tv/${id}/${season}/${episode}`;
    } else if (selectedServer === 'vidsrc-online') {
      return type === 'movie'
        ? `${vidsrcOnlineBaseUrl}movie/${id}`
        : `${vidsrcOnlineBaseUrl}tv/${id}/${season}/${episode}`;
    } else {
      return type === 'movie'
        ? `${vidstreamsBaseUrl}tmdb${id}/`
        : `${vidstreamsBaseUrl}tvm${id}/${season}/${episode}/`;
    }
  };






  const playerUrl = getPlayerUrl();

  const { saveProgress } = useContinueWatching();

  const { markAsWatched, isWatched } = useWatchHistory();

  useEffect(() => {
    if (details) {
      const progressItem = {
        id: Number(id),
        mediaType: type,
        title: title || '',
        poster_path: details.poster_path || '',
        backdrop_path: details.backdrop_path || '',
        season: type === 'tv' ? season : undefined,
        episode: type === 'tv' ? episode : undefined,
      };

      saveProgress(progressItem);
      markAsWatched(progressItem);
    }
  }, [id, type, season, episode, details]);

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

            {/* Server Selection */}
            <div className="space-y-4">
              <div className="inline-flex flex-col sm:flex-row sm:items-center gap-3 bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10 w-full sm:w-fit overflow-hidden">
                <span className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest px-3 py-1 sm:py-0 border-b sm:border-b-0 sm:border-r border-white/5">
                  Servers
                </span>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 px-2 sm:px-0 scrollbar-none snap-x h-9 items-center">
                  {servers.map((server) => (
                    <Button
                      key={server.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedServer(server.id)}
                      className={cn(
                        "rounded-xl px-4 py-1.5 h-8 text-[11px] sm:text-xs font-bold transition-all flex-shrink-0 snap-align-start",
                        selectedServer === server.id
                          ? "bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {server.name}
                    </Button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500/60 leading-relaxed px-1 max-w-lg">
                <span className="text-yellow-500/50 font-bold uppercase mr-2 tracking-tighter">Pro Tip:</span>
                If a server is slow or not working, try switching. Use <span className="text-slate-400 underline decoration-slate-400/20 underline-offset-2">Brave Browser</span> for an ad-free experience.
              </p>
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
                genres={genres}
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
                  {seasonDetails.episodes.map((ep) => {
                    const watched = isWatched(Number(id), 'tv', season, ep.episode_number);
                    const active = ep.episode_number === episode;

                    return (
                      <Button
                        key={ep.id}
                        variant="outline"
                        onClick={() => handleEpisodeChange(ep.episode_number)}
                        className={cn(
                          "h-12 w-full font-bold transition-all duration-300 rounded-xl border-0 relative overflow-hidden",
                          active
                            ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                            : watched
                              ? 'bg-white/10 text-slate-500 hover:bg-white/15 hover:text-slate-400'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        {ep.episode_number}
                        {watched && !active && (
                          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-500/50" />
                        )}
                      </Button>
                    );
                  })}
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
                genres={genres}
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
function DesktopInfoPanel({ details, title, type, season, episode, rating, year, releaseDate, overview, genres }: any) {
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
          {genres && (
            <>
              <div className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="text-slate-400 text-sm">{genres}</span>
            </>
          )}
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
function MobileInfoPanel({ details, title, type, season, episode, rating, year, releaseDate, overview, genres }: any) {
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

          <div className="flex flex-col gap-1 text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {rating.toFixed(1)}
              </div>
              <span>•</span>
              <span>{year}</span>
            </div>
            {genres && (
              <span className="text-xs text-slate-500 line-clamp-1">{genres}</span>
            )}
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