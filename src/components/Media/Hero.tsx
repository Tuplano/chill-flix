import { useRef } from "react"
import { Movie, TVShow } from "@/types"
import { Link } from "@tanstack/react-router"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Star } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"
import Fade from "embla-carousel-fade"

interface HeroProps {
  items: (Movie | TVShow)[]
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

export function Hero({ items }: HeroProps) {
  const autoplay = useRef(
    Autoplay({ delay: 8000, stopOnInteraction: true })
  )
  const fade = useRef(Fade())

  if (!items || items.length === 0) return null

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[88vh] overflow-hidden">
      <Carousel
        opts={{ loop: true, duration: 60 }}
        plugins={[autoplay.current, fade.current]}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0 h-full">
          {items.slice(0, 10).map((item) => {
            const title = "title" in item ? item.title : item.name
            const overview = item.overview
            const backdropUrl = item.backdrop_path
              ? `${IMAGE_BASE_URL}${item.backdrop_path}`
              : "/placeholder-hero.jpg"
            const mediaType = "title" in item ? "movies" : "tv-shows"
            const isMovie = "title" in item

            return (
              <CarouselItem
                key={item.id}
                className="pl-0 h-[60vh] sm:h-[70vh] md:h-[88vh] relative group cursor-pointer"
              >
                {/* FULL CLICK OVERLAY */}
                <Link
                  to="/watch/$mediaType/$id"
                  params={{ mediaType, id: item.id.toString() }}
                  search={{ season: 1, episode: 1 }}
                  className="absolute inset-0 z-10"
                />

                {/* BACKGROUND */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={backdropUrl}
                    alt={title}
                    loading="eager"
                    className="h-full w-full object-cover scale-100 transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                  />

                  {/* GRADIENT OVERLAYS */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

                  {/* DARK HOVER FADE */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                {/* CONTENT — always visible, subtle lift on hover */}
                <div className="absolute inset-0 flex items-end px-5 pb-10 sm:px-8 sm:pb-14 md:px-16 md:pb-28 z-20 pointer-events-none">
                  <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 space-y-2 md:space-y-4 transition-transform duration-700 ease-out md:group-hover:-translate-y-1">
                    {/* Badges row */}
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500 text-black font-bold border-0 text-[10px] sm:text-xs px-2 py-0.5">
                        <Star className="size-2.5 mr-0.5 fill-black" />
                        {item.vote_average.toFixed(1)}
                      </Badge>
                      <Badge variant="outline" className="text-white border-white/40 text-[10px] sm:text-xs">
                        {isMovie ? "Movie" : "TV Show"}
                      </Badge>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl leading-tight line-clamp-2">
                      {title}
                    </h1>

                    <p className="hidden sm:block text-sm md:text-base text-gray-300 line-clamp-2 md:line-clamp-3 font-medium drop-shadow-md max-w-2xl">
                      {overview}
                    </p>

                    <Button
                      size="sm"
                      className="pointer-events-none bg-white text-black hover:bg-white/90 font-bold rounded-full px-5 gap-2 text-xs sm:text-sm"
                    >
                      <Play className="size-3.5 fill-black" />
                      Watch Now
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
