import { Link } from '@tanstack/react-router';
import { PATHS } from '@/config/paths';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Film, User } from 'lucide-react';

export function Header() {
  const isAuthenticated = false;

  return (
    <header className="h-16 w-full bg-slate-900 px-10">
      <div className="flex h-full items-center justify-between">
        <Link to={PATHS.HOME} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Film className="h-6 w-6 text-cyan-500" />
          <span className="font-bold text-xl text-white">ChillFlix</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/browse/$mediaType" params={{ mediaType: 'movies' }} search={{ page: 1 }}>
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " bg-transparent text-gray-300 hover:text-white hover:bg-slate-800 cursor-pointer"}>
                  Movies
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/browse/$mediaType" params={{ mediaType: 'tv-shows' }} search={{ page: 1 }}>
                <NavigationMenuLink className={navigationMenuTriggerStyle() + " bg-transparent text-gray-300 hover:text-white hover:bg-slate-800 cursor-pointer"}>
                  TV Shows
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {/* {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-cyan-600 text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 text-white border-gray-700" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                  My List
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer text-red-400">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={PATHS.LOGIN}>
              <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Sign In
              </Button>
            </Link>
          )} */}
        </div>
      </div>
    </header>
  );
}