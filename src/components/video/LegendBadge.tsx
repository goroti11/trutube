import React from 'react';
import { type VideoLegendAward } from '../../services/legendService';

interface LegendBadgeProps {
  award: VideoLegendAward;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export default function LegendBadge({ award, size = 'md', showTooltip = true }: LegendBadgeProps) {
  const badge = award.legend_badges;
  if (!badge) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'red': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'cyan': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'purple': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'gold': return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/40';
      case 'bronze': return 'bg-orange-700/20 text-orange-300 border-orange-700/40';
      case 'silver': return 'bg-gray-400/20 text-gray-300 border-gray-400/40';
      case 'diamond': return 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40';
      case 'platinum': return 'bg-purple-400/20 text-purple-300 border-purple-400/40';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <div
      className={`
        inline-flex items-center space-x-1 rounded-full border font-semibold
        ${sizeClasses[size]} ${getColorClasses(badge.color)}
        ${showTooltip ? 'group relative cursor-help' : ''}
      `}
    >
      <span>{badge.icon}</span>
      <span>{badge.name}</span>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
          <p className="text-xs font-semibold text-white">{badge.description}</p>
          <p className="text-xs text-gray-400 mt-1">Period: {award.period}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}
