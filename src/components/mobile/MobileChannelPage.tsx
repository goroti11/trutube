import React, { useState, useRef } from 'react';
import { Bell, BellOff, Share2, ChevronRight } from 'lucide-react';

interface MobileChannelPageProps {
  channelName: string;
  channelAvatar: string;
  subscriberCount: string;
  videoCount: number;
  description: string;
  isSubscribed: boolean;
  onSubscribe: () => void;
}

const tabs = [
  { id: 'videos', label: 'Vidéos' },
  { id: 'shorts', label: 'Shorts' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'community', label: 'Communauté' },
  { id: 'about', label: 'À propos' },
];

export default function MobileChannelPage({
  channelName,
  channelAvatar,
  subscriberCount,
  videoCount,
  description,
  isSubscribed,
  onSubscribe
}: MobileChannelPageProps) {
  const [activeTab, setActiveTab] = useState('videos');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollToTab = (tabId: string) => {
    setActiveTab(tabId);
    const tabElement = document.getElementById(`tab-${tabId}`);
    if (tabElement && tabsRef.current) {
      tabElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0B0B0D] pb-4">
        <div className="relative h-32 bg-gradient-to-r from-[#D8A0B6]/20 to-[#B8849C]/20" />

        <div className="px-4 -mt-12">
          <img
            src={channelAvatar}
            alt={channelName}
            className="w-24 h-24 rounded-full border-4 border-[#0B0B0D] bg-[#1A1A1A]"
          />

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-white">{channelName}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
              <span>{subscriberCount} abonnés</span>
              <span>•</span>
              <span>{videoCount} vidéos</span>
            </div>
            <p className="mt-3 text-sm text-gray-300 line-clamp-2">{description}</p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onSubscribe}
              className={`flex-1 px-6 py-3 rounded-full font-medium transition-colors ${
                isSubscribed
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-[#D8A0B6] text-white hover:bg-[#C890A6]'
              }`}
            >
              {isSubscribed ? 'Abonné' : "S'abonner"}
            </button>
            {isSubscribed && (
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
              >
                {notificationsEnabled ? (
                  <Bell size={20} className="text-white" />
                ) : (
                  <BellOff size={20} className="text-white" />
                )}
              </button>
            )}
            <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
              <Share2 size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={tabsRef}
        className="flex gap-6 px-4 py-3 overflow-x-auto border-b border-gray-800 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => scrollToTab(tab.id)}
            className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-[#D8A0B6] border-b-2 border-[#D8A0B6]'
                : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'videos' && (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-video bg-gray-800 rounded-lg" />
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}
        {activeTab === 'about' && (
          <div className="space-y-4 text-white">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Statistiques</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Abonnés</span>
                  <span>{subscriberCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vidéos</span>
                  <span>{videoCount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
