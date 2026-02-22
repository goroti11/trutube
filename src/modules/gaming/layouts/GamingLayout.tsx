import { ReactNode } from 'react';
import { Gamepad2, Trophy, Users, TrendingUp, Wallet, Home, Clock } from 'lucide-react';

interface GamingLayoutProps {
  children: ReactNode;
  activeTab?: string;
  onNavigate: (page: string) => void;
}

export function GamingLayout({ children, activeTab, onNavigate }: GamingLayoutProps) {
  const tabs = [
    { id: 'gaming-hub', label: 'Hub', icon: Home },
    { id: 'gaming-tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'gaming-teams', label: 'Teams', icon: Users },
    { id: 'gaming-leaderboards', label: 'Leaderboards', icon: TrendingUp },
    { id: 'gaming-seasons', label: 'Seasons', icon: Clock },
    { id: 'gaming-arena-fund', label: 'Arena Fund', icon: Wallet }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950">
      {/* Gaming Header */}
      <div className="bg-gray-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  GOROTI GAMING
                </h1>
                <p className="text-xs text-gray-400">Competitive Gaming Division</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
            >
              Back to GOROTI
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>

      {/* Gaming Footer Accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
    </div>
  );
}
