import { useRef } from "react"
import { Movie, TVShow } from "@/types"
import { Link } from "@tanstack/react-router"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
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
    <section className="relative w-full h-[90vh] overflow-hidden">
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

            return (
              <CarouselItem
                key={item.id}
                className="pl-0 h-[90vh] relative group cursor-pointer"
              >
                {/* FULL CLICK OVERLAY */}
                <Link
                  to="/watch/$mediaType/$id"
                  params={{
                    mediaType: "title" in item ? "movies" : "tv-shows",
                    id: item.id.toString(),
                  }}
                  search={{ season: 1, episode: 1 }}
                  className="absolute inset-0 z-10"
                />

                {/* BACKGROUND */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={backdropUrl}
                    alt={title}
                    loading="eager"
                    className="
                      h-full w-full object-cover
                      scale-100
                      transition-transform duration-[1500ms] ease-out
                      group-hover:scale-105
                    "
                  />

                  {/* GRADIENT OVERLAYS */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

                  {/* DARK HOVER FADE */}
                  <div
                    className="
                      absolute inset-0 bg-black/30 opacity-0
                      transition-opacity duration-500
                      group-hover:opacity-100
                    "
                  />
                </div>

                {/* CONTENT */}
                <div className="absolute inset-0 flex items-end p-8 md:p-16 pb-24 md:pb-32 z-20 pointer-events-none">
                  <div
                    className="
                      w-full md:w-2/3 lg:w-1/2 space-y-4
                      transform translate-y-8 opacity-0
                      transition-all duration-700 ease-out
                      group-hover:translate-y-0 group-hover:opacity-100
                    "
                  >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl leading-tight">
                      {title}
                    </h1>

                    <p className="text-sm md:text-lg text-gray-200 line-clamp-3 font-medium drop-shadow-md max-w-2xl">
                      {overview}
                    </p>

                    <span className="inline-block text-white/80 text-sm tracking-wide">
                      ▶ Click to watch
                    </span>
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
