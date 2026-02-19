import { Crown, Gem, Star } from 'lucide-react';

interface PremiumBadgeProps {
  tier: 'premium' | 'platine' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export default function PremiumBadge({
  tier,
  size = 'md',
  showLabel = true,
  animated = true
}: PremiumBadgeProps) {
  const badges = {
    premium: {
      icon: Star,
      label: 'Premium',
      gradient: 'from-blue-400 to-cyan-400',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-400',
      shadowColor: 'shadow-blue-500/30',
    },
    platine: {
      icon: Gem,
      label: 'Platine',
      gradient: 'from-gray-300 to-gray-500',
      bgGradient: 'from-gray-400/20 to-gray-600/20',
      borderColor: 'border-gray-400',
      shadowColor: 'shadow-gray-400/30',
    },
    gold: {
      icon: Crown,
      label: 'Gold',
      gradient: 'from-yellow-400 to-amber-500',
      bgGradient: 'from-yellow-500/20 to-amber-500/20',
      borderColor: 'border-yellow-400',
      shadowColor: 'shadow-yellow-500/30',
    },
  };

  const badge = badges[tier];
  const Icon = badge.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`
        inline-flex items-center
        bg-gradient-to-r ${badge.bgGradient}
        ${badge.borderColor}
        ${sizeClasses[size]}
        rounded-full border-2 font-semibold
        shadow-lg ${badge.shadowColor}
        ${animated ? 'animate-pulse-slow hover:scale-105 transition-transform' : ''}
      `}
    >
      <Icon className={`${iconSizes[size]} bg-gradient-to-br ${badge.gradient} bg-clip-text text-transparent`}
        style={{
          fill: `url(#gradient-${tier})`,
          stroke: 'currentColor',
          strokeWidth: 0.5
        }}
      />
      <svg width="0" height="0">
        <defs>
          <linearGradient id={`gradient-${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tier === 'premium' ? '#60a5fa' : tier === 'platine' ? '#d1d5db' : '#fbbf24'} />
            <stop offset="100%" stopColor={tier === 'premium' ? '#22d3ee' : tier === 'platine' ? '#6b7280' : '#f59e0b'} />
          </linearGradient>
        </defs>
      </svg>
      {showLabel && (
        <span className={`bg-gradient-to-r ${badge.gradient} bg-clip-text text-transparent font-bold`}>
          {badge.label}
        </span>
      )}
    </div>
  );
}
