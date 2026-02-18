import { Award, Crown, Star } from 'lucide-react';

interface CreatorTierBadgeProps {
  tier: 'Basic' | 'Pro' | 'Elite';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function CreatorTierBadge({ tier, size = 'md', showLabel = true }: CreatorTierBadgeProps) {
  const config = {
    Basic: {
      icon: Award,
      color: 'from-gray-600 to-gray-700',
      textColor: 'text-gray-300',
      borderColor: 'border-gray-600',
      bgColor: 'bg-gray-900',
    },
    Pro: {
      icon: Star,
      color: 'from-blue-600 to-blue-700',
      textColor: 'text-blue-300',
      borderColor: 'border-blue-600',
      bgColor: 'bg-blue-900',
    },
    Elite: {
      icon: Crown,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-300',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-900',
    },
  };

  const sizeConfig = {
    sm: {
      iconSize: 'w-3 h-3',
      padding: 'px-2 py-1',
      text: 'text-xs',
      badgeSize: 'w-5 h-5',
    },
    md: {
      iconSize: 'w-4 h-4',
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      badgeSize: 'w-6 h-6',
    },
    lg: {
      iconSize: 'w-5 h-5',
      padding: 'px-4 py-2',
      text: 'text-base',
      badgeSize: 'w-8 h-8',
    },
  };

  const tierConfig = config[tier];
  const sizeStyles = sizeConfig[size];
  const Icon = tierConfig.icon;

  if (!showLabel) {
    return (
      <div
        className={`${sizeStyles.badgeSize} rounded-full bg-gradient-to-br ${tierConfig.color} flex items-center justify-center border-2 ${tierConfig.borderColor}`}
        title={`Créateur ${tier}`}
      >
        <Icon className={`${sizeStyles.iconSize} text-white`} />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 ${sizeStyles.padding} rounded-full ${tierConfig.bgColor} border-2 ${tierConfig.borderColor}`}
    >
      <Icon className={`${sizeStyles.iconSize} ${tierConfig.textColor}`} />
      <span className={`font-semibold ${sizeStyles.text} ${tierConfig.textColor}`}>
        {tier}
      </span>
    </div>
  );
}
