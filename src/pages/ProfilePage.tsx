import { ArrowLeft, Heart, Share2, Video as VideoIcon } from 'lucide-react';
import { User, Video } from '../types';
import { recommendedVideos } from '../data/mockData';

interface ProfilePageProps {
  user: User;
  onBack: () => void;
  onVideoClick: (video: Video) => void;
  onSupportClick: () => void;
}

export default function ProfilePage({ user, onBack, onVideoClick, onSupportClick }: ProfilePageProps) {
  const userVideos = recommendedVideos.filter(v => v.userId === user.id);

  const formatSubscribers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const formatViews = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button className="w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="relative -mt-16 mb-4">
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="w-32 h-32 rounded-full border-4 border-black object-cover"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">{user.displayName}</h1>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-xs font-medium border border-primary-500/30">
              Independent Artist
            </div>
          </div>
          <p className="text-gray-400 mb-4">{formatSubscribers(user.subscriberCount)} Subscribers</p>
          <button
            onClick={onSupportClick}
            className="w-full py-3 bg-accent-500 hover:bg-accent-600 rounded-lg font-semibold transition-colors shadow-lg shadow-accent-500/20"
          >
            Support Creator
          </button>
        </div>

        <div className="border-b border-gray-800 mb-6">
          <div className="flex gap-6">
            <button className="pb-3 border-b-2 border-primary-500 text-primary-400 font-medium">
              Videos
            </button>
            <button className="pb-3 text-gray-400 hover:text-white transition-colors">
              Shorts
            </button>
            <button className="pb-3 text-gray-400 hover:text-white transition-colors">
              Live
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-8">
          {userVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => onVideoClick(video)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs">
                  {formatViews(video.viewCount)}
                </div>
              </div>
              <h3 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h3>
              <p className="text-xs text-gray-400">
                <VideoIcon className="w-3 h-3 inline mr-1" />
                {formatViews(video.viewCount)} views
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
