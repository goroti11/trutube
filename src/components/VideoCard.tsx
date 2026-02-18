import { Clock, Heart, MessageCircle } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick?: (video: Video) => void;
  universeColor?: string;
}

export default function VideoCard({ video, onClick, universeColor = 'cyan' }: VideoCardProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onClick={() => onClick?.(video)}
      className="group cursor-pointer bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all"
    >
      <div className="relative aspect-video bg-black">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-2 right-2 bg-black/90 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-base mb-1 line-clamp-2 leading-tight">
            {video.title}
          </h3>
          <p className="text-sm text-gray-400">
            {video.user?.displayName || 'Anonymous'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full bg-${universeColor}-500`} />
              {video.subUniverseId || 'General'}
            </span>
            <span>{formatDuration(video.duration)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`px-4 py-2 bg-${universeColor}-600 hover:bg-${universeColor}-700 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors`}
            >
              <Heart className="w-4 h-4" />
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
