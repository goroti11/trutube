import { Home, Video, Zap, ShoppingBag, List, MessageSquare, Calendar } from 'lucide-react';

export type ChannelTabType = 'home' | 'videos' | 'shorts' | 'releases' | 'playlists' | 'posts' | 'events';

interface ChannelTabsProps {
  activeTab: ChannelTabType;
  onTabChange: (tab: ChannelTabType) => void;
  counts?: {
    videos?: number;
    shorts?: number;
    releases?: number;
    playlists?: number;
    posts?: number;
    events?: number;
  };
}

export default function ChannelTabs({ activeTab, onTabChange, counts = {} }: ChannelTabsProps) {
  const tabs = [
    { id: 'home' as ChannelTabType, label: 'Accueil', icon: Home },
    { id: 'videos' as ChannelTabType, label: 'Vidéos', icon: Video, count: counts.videos },
    { id: 'shorts' as ChannelTabType, label: 'Shorts', icon: Zap, count: counts.shorts },
    { id: 'releases' as ChannelTabType, label: 'Sorties', icon: ShoppingBag, count: counts.releases },
    { id: 'playlists' as ChannelTabType, label: 'Playlists', icon: List, count: counts.playlists },
    { id: 'posts' as ChannelTabType, label: 'Posts', icon: MessageSquare, count: counts.posts },
    { id: 'events' as ChannelTabType, label: 'Événements', icon: Calendar, count: counts.events },
  ];

  return (
    <div className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'text-red-500 border-red-500'
                    : 'text-neutral-400 border-transparent hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-neutral-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
