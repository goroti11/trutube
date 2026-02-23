import { Link, Outlet, useLocation } from 'react-router-dom';
import { LegalAcceptanceGate } from '../../../components/LegalAcceptanceGate';

export function GamingLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/gaming', label: 'Hub', exact: true },
    { path: '/gaming/live', label: 'Live' },
    { path: '/gaming/tournaments', label: 'Tournaments' },
    { path: '/gaming/teams', label: 'Teams' },
    { path: '/gaming/leaderboards', label: 'Leaderboards' },
    { path: '/gaming/seasons', label: 'Seasons' },
    { path: '/gaming/arena-fund', label: 'Arena Fund' },
    { path: '/gaming/studio', label: 'Studio' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <LegalAcceptanceGate domain="gaming">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <nav className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-blue-500 border-opacity-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  GOROTI GAMING
                </div>
              </div>
              <div className="flex items-center gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path, item.exact)
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                        : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
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
