import { useRef } from 'react';
import { Movie, TVShow } from '@/types';
import { Button } from '@/components/ui/button';
import { Play, Info } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import Fade from "embla-carousel-fade"

interface HeroProps {
  items: (Movie | TVShow)[];
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export function Hero({ items }: HeroProps) {
  const plugin = useRef(
    Autoplay({ delay: 8000, stopOnInteraction: true })
  )
  const fadePlugin = useRef(
    Fade()
  )

  if (!items || items.length === 0) return null;

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      <Carousel
        opts={{
          loop: true,
          duration: 60,
        }}
        plugins={[plugin.current, fadePlugin.current]}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0 h-full">
          {items.slice(0, 10).map((item) => {
             const title = 'title' in item ? item.title : item.name;
             const overview = item.overview;
             const backdropUrl = item.backdrop_path 
               ? `${IMAGE_BASE_URL}${item.backdrop_path}` 
               : '/placeholder-hero.jpg';

             return (
              <CarouselItem key={item.id} className="pl-0 h-[90vh] relative">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={backdropUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                    loading="eager" 
                  />
                  {/* Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full h-full flex items-end p-8 md:p-16 pb-24 md:pb-32">
                  <div className="w-full md:w-2/3 lg:w-1/2 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl leading-tight">
                      {title}
                    </h1>
                    <p className="text-sm md:text-lg text-gray-200 line-clamp-3 font-medium drop-shadow-md max-w-2xl">
                      {overview}
                    </p>
                    
                    <div className="flex items-center gap-4 pt-4">
                      <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer font-bold px-8 h-12 rounded-md border-none">
                        <Play className="mr-2 h-5 w-5 fill-black" />
                        Play
                      </Button>
                      <Button size="lg" variant="secondary" className="bg-white/20 text-white hover:bg-white/30 cursor-pointer backdrop-blur-md font-bold px-8 h-12 rounded-md border border-white/20">
                        <Info className="mr-2 h-5 w-5" />
                        More Info
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
             );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
