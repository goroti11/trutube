import { useState } from 'react';
import { Video } from '../../types';
import { Clock, Eye, TrendingUp } from 'lucide-react';

interface RelatedVideosProps {
  videos: Video[];
  onVideoClick: (videoId: string) => void;
}

export default function RelatedVideos({ videos, onVideoClick }: RelatedVideosProps) {
  const [activeTab, setActiveTab] = useState<'popular' | 'recent' | 'oldest' | 'shorts'>('popular');

  const tabs = [
    { id: 'popular' as const, label: 'Plus populaires', icon: TrendingUp },
    { id: 'recent' as const, label: 'Récents', icon: Clock },
    { id: 'oldest' as const, label: 'Plus anciens', icon: Clock },
    { id: 'shorts' as const, label: 'Shorts', icon: Eye }
  ];

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)}sem`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)}mois`;
    return `Il y a ${Math.floor(diffDays / 365)}ans`;
  };

  const filteredVideos = videos.filter((video) => {
    if (activeTab === 'shorts') return video.isShort;
    return !video.isShort;
  }).sort((a, b) => {
    if (activeTab === 'popular') return b.viewCount - a.viewCount;
    if (activeTab === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (activeTab === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredVideos.map((video) => (
          <button
            key={video.id}
            onClick={() => onVideoClick(video.id)}
            className="flex gap-3 w-full hover:bg-gray-800/50 rounded-lg p-2 transition-colors group"
          >
            <div className="relative flex-shrink-0">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className={`object-cover rounded-lg ${
                  video.isShort ? 'w-32 h-48' : 'w-40 h-24'
                }`}
              />
              <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium">
                {formatDuration(video.duration)}
              </div>
              {video.isShort && (
                <div className="absolute top-1 left-1 bg-red-600 px-1.5 py-0.5 rounded text-xs font-bold">
                  SHORT
                </div>
              )}
            </div>

            <div className="flex-1 text-left min-w-0">
              <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
                {video.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{video.user?.displayName}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span>{formatViews(video.viewCount)} vues</span>
                <span>•</span>
                <span>{formatDate(video.createdAt)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">Aucune vidéo dans cette catégorie</p>
        </div>
      )}
    </div>
  );
}
