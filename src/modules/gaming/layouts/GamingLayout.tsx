import { Link, Outlet, useLocation } from 'react-router-dom';
import { LegalAcceptanceGate } from '../../../components/LegalAcceptanceGate';

export function GamingLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <LegalAcceptanceGate domain="gaming">
      <div className="min-h-screen bg-gray-900">
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-bold text-white">
                  GOROTI
                </Link>
                <div className="flex space-x-4">
                  <Link
                    to="/gaming"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/gaming') && location.pathname === '/gaming'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Hub
                  </Link>
                  <Link
                    to="/gaming/tournaments"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/gaming/tournaments')
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Tournaments
                  </Link>
                  <Link
                    to="/gaming/leaderboards"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/gaming/leaderboards')
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Leaderboards
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </LegalAcceptanceGate>
  );
}
