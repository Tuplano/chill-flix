import { Link } from '@tanstack/react-router';
import { PATHS } from '@/config/paths';
import { Film, Bell, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { HeaderSearch } from './HeaderSearch';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-10",
        scrolled 
          ? "bg-black/70 backdrop-blur-xl border-b border-white/5 h-16" 
          : "bg-gradient-to-b from-black/80 to-transparent h-20"
      )}
    >
      <div className="relative flex h-full items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link to={PATHS.HOME} className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-black p-1.5 rounded-lg border border-yellow-500/50">
                <Film className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <span className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Chill<span className="text-yellow-500">Flix</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
          {[
            { label: 'Movies', href: '/browse/$mediaType', params: { mediaType: 'movies' }, search: { page: 1 } },
            { label: 'TV Shows', href: '/browse/$mediaType', params: { mediaType: 'tv-shows' }, search: { page: 1 } },
          ].map((link) => (
            <Link 
              key={link.label}
              to={link.href}
              params={link.params}
              search={link.search}
              className="px-6 py-2 text-sm font-bold text-slate-400 hover:text-white transition-all rounded-full hover:bg-white/10"
              activeProps={{ className: "text-white bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Header Search Component */}
          <HeaderSearch />

          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full relative hover:cursor-pointer" asChild>
            <Link to={PATHS.BOOKMARKS}>
              <Bookmark className="h-5 w-5" />
            </Link>
          </Button>

        </div>
      </div>
    </header>
  );
}