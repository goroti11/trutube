import { Clock, Heart, MessageCircle, Crown, TrendingUp } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick?: (video: Video) => void;
  universeColor?: string;
  legendLevel?: number;
  legendScore?: number;
  isLegendPromoted?: boolean;
}

export default function VideoCard({ video, onClick, universeColor = 'cyan', legendLevel, legendScore, isLegendPromoted }: VideoCardProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLegendLevelInfo = (level?: number) => {
    if (!level) return null;

    const configs = {
      1: { name: 'Legend I', color: 'from-yellow-600 to-yellow-400', glow: 'shadow-yellow-500/50' },
      2: { name: 'Legend II', color: 'from-yellow-500 to-orange-400', glow: 'shadow-orange-500/50' },
      3: { name: 'Legend III', color: 'from-orange-500 to-red-500', glow: 'shadow-red-500/50' },
      4: { name: 'Legend IV', color: 'from-purple-600 to-pink-500', glow: 'shadow-purple-500/50' }
    };

    return configs[level as keyof typeof configs];
  };

  const legendInfo = getLegendLevelInfo(legendLevel);

  return (
    <div
      onClick={() => onClick?.(video)}
      className={`group cursor-pointer bg-gray-900/50 border rounded-xl overflow-hidden hover:border-gray-700 transition-all ${
        isLegendPromoted && legendInfo
          ? `border-2 border-transparent bg-gradient-to-br ${legendInfo.color} p-[2px] shadow-lg ${legendInfo.glow}`
          : 'border-gray-800'
      }`}
    >
      <div className={isLegendPromoted && legendInfo ? 'bg-gray-900 rounded-[10px] overflow-hidden' : ''}>
        <div className="relative aspect-video bg-black">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />

          {isLegendPromoted && legendInfo && (
            <div className={`absolute top-2 left-2 bg-gradient-to-r ${legendInfo.color} px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2`}>
              <Crown className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-bold">{legendInfo.name}</span>
              {legendScore && (
                <span className="text-white/90 text-xs">
                  {legendScore.toFixed(0)}
                </span>
              )}
            </div>
          )}

          {isLegendPromoted && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-cyan-600 to-blue-600 px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-bold">Promoted</span>
            </div>
          )}

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
    </div>
  );
}
