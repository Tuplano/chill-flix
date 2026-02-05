import { useRef } from 'react';
import { Movie, TVShow } from '@/types';
import { MediaCard } from './MediaCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import Autoplay from "embla-carousel-autoplay"
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface MediaRowProps {
  title: string;
  items: (Movie | TVShow)[];
  className?: string;
  autoPlay?: boolean;
}

export function MediaRow({ title, items, className, autoPlay = false }: MediaRowProps) {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  if (!items || items.length === 0) return null;

  return (
    <div className={cn("py-8 space-y-4", className)}>
      <div className="flex items-center justify-between px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
          {title}
          <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-yellow-500" />
        </h2>
        <Button variant="ghost" className="text-sm font-semibold text-slate-400 hover:text-white hover:bg-transparent group cursor-pointer">
          See All
          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="relative px-4 md:px-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={autoPlay ? [plugin.current] : []}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {items.map((item) => (
              <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-1/2 xs:basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                <MediaCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 md:-left-4 hidden md:flex" />
          <CarouselNext className="right-0 md:-right-4 hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
}
