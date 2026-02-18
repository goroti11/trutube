import { Video, VideoScore } from '../../types';
import { TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';

interface VideoScoreCardProps {
  video: Video;
  score: VideoScore;
}

export default function VideoScoreCard({ video, score }: VideoScoreCardProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getScoreColor = (value: number): string => {
    if (value >= 70) return 'text-green-400';
    if (value >= 40) return 'text-accent-400';
    return 'text-red-400';
  };

  const scoreComponents = [
    {
      label: 'Engagement',
      value: score.engagementScore.toFixed(1),
      weight: '40%',
      color: 'text-primary-400',
    },
    {
      label: 'Support',
      value: score.supportScore.toFixed(1),
      weight: '30%',
      color: 'text-accent-400',
    },
    {
      label: 'Freshness',
      value: score.freshnessScore.toFixed(1),
      weight: '20%',
      color: 'text-green-400',
    },
    {
      label: 'Diversity',
      value: score.diversityBoost.toFixed(1),
      weight: '10%',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex gap-4">
        <div className="w-40 h-24 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-2 line-clamp-1">{video.title}</h3>

          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(video.viewCount)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {formatNumber(video.likeCount)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {formatNumber(video.commentCount)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${getScoreColor(score.finalScore)}`} />
              <span className={`text-lg font-bold ${getScoreColor(score.finalScore)}`}>
                {score.finalScore.toFixed(0)}
              </span>
              <span className="text-xs text-gray-500">Final Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-4 gap-2">
          {scoreComponents.map((component) => (
            <div key={component.label} className="text-center">
              <p className={`text-sm font-bold ${component.color}`}>{component.value}</p>
              <p className="text-xs text-gray-500">{component.label}</p>
              <p className="text-xs text-gray-600">{component.weight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 p-2 bg-gray-900 rounded-lg">
        <p className="text-xs text-gray-400">
          💡 <span className="font-medium">Tip:</span> Your engagement score can be improved by
          increasing watch time and encouraging comments.
        </p>
      </div>
    </div>
  );
}
