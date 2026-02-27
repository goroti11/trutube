import React from 'react';
import { Crown, Star, Gem, Sparkles } from 'lucide-react';

interface LegendBadgeProps {
  level: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
  compositeScore?: number;
}

export default function LegendBadge({
  level,
  size = 'md',
  animated = true,
  showLabel = false,
  compositeScore
}: LegendBadgeProps) {
  const configs = {
    1: {
      icon: Star,
      label: 'LÉGENDE I',
      shortLabel: 'L1',
      gradient: 'from-yellow-400 to-orange-500',
      glow: 'shadow-yellow-500/50',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-400/50'
    },
    2: {
      icon: Sparkles,
      label: 'LÉGENDE II',
      shortLabel: 'L2',
      gradient: 'from-blue-400 to-cyan-500',
      glow: 'shadow-cyan-500/50',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-cyan-400/50'
    },
    3: {
      icon: Gem,
      label: 'LÉGENDE III',
      shortLabel: 'L3',
      gradient: 'from-purple-400 to-pink-500',
      glow: 'shadow-purple-500/50',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-400/50'
    },
    4: {
      icon: Crown,
      label: 'LÉGENDE ULTIME',
      shortLabel: 'LU',
      gradient: 'from-amber-300 via-yellow-400 to-orange-500',
      glow: 'shadow-yellow-500/70',
      bgGradient: 'from-amber-500/20 via-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-300/70'
    }
  };

  const config = configs[level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: 'w-6 h-6',
      icon: 'w-3 h-3',
      text: 'text-xs px-1.5 py-0.5'
    },
    md: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-sm px-2 py-1'
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-base px-3 py-1.5'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className="inline-flex items-center space-x-2">
      <div
        className={`${classes.container} rounded-full bg-gradient-to-br ${config.bgGradient} border-2 ${config.border} ${config.glow} shadow-lg flex items-center justify-center relative overflow-hidden ${animated ? 'animate-pulse-slow' : ''}`}
        title={`${config.label}${compositeScore ? ` - Score: ${compositeScore.toFixed(1)}` : ''}`}
      >
        {level === 4 && animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        )}

        <Icon className={`${classes.icon} text-white relative z-10`} />
      </div>

      {showLabel && (
        <span className={`${classes.text} font-bold rounded-full bg-gradient-to-r ${config.bgGradient} border ${config.border}`}>
          <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {config.shortLabel}
          </span>
        </span>
      )}
    </div>
  );
}
