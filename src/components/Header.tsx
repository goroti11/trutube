import { Link } from 'react-router-dom';
import { Trophy, Sparkles, Play, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-800">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Play className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-gradient text-gradient-primary">
              GOROTI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/legende"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">LÉGENDE</span>
            </Link>

            <Link
              to="/gaming"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-300 hover:text-white"
            >
              <Trophy className="w-4 h-4" />
              <span>Gaming</span>
            </Link>

            <Link
              to="/live"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-300 hover:text-white"
            >
              <div className="relative">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse absolute -top-1 -right-1"></div>
                <Play className="w-4 h-4" />
              </div>
              <span>Live</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="btn btn-secondary"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
