import { Link } from '@tanstack/react-router';
import { PATHS } from '@/config/paths';

export function Header() {
  return (
    <div className="flex flex-col min-h-screen ">
    <header className="p-4 border-b border-gray-800 bg-slate-900 text-white flex justify-between items-center">
      <div className="font-bold text-xl">
        <Link to={PATHS.HOME}>ChillFlix</Link>
      </div>
      <nav className="flex gap-4">
        <Link to={PATHS.HOME} className="hover:text-cyan-400">Home</Link>
        <Link to={PATHS.ABOUT} className="hover:text-cyan-400">About</Link>
        <Link to={PATHS.LOGIN} className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-500 transition-colors">Login</Link>
      </nav>
    </header>
    </div>
  );
}
