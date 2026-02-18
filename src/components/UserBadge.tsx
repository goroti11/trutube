import { UserStatus } from '../types';
import { Crown, Star, Sparkles, User, Award } from 'lucide-react';

interface UserBadgeProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function UserBadge({ status, size = 'md', showLabel = true }: UserBadgeProps) {
  const badges = {
    viewer: {
      icon: User,
      label: 'Viewer',
      color: 'text-gray-400',
      bgColor: 'bg-gray-700',
      borderColor: 'border-gray-600',
    },
    supporter: {
      icon: Star,
      label: 'Supporter',
      color: 'text-amber-600',
      bgColor: 'bg-amber-900/30',
      borderColor: 'border-amber-700',
    },
    creator: {
      icon: Sparkles,
      label: 'Creator',
      color: 'text-gray-300',
      bgColor: 'bg-gray-700',
      borderColor: 'border-gray-500',
    },
    pro: {
      icon: Award,
      label: 'Pro',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/30',
      borderColor: 'border-yellow-600',
    },
    elite: {
      icon: Crown,
      label: 'Elite',
      color: 'text-primary-400',
      bgColor: 'bg-primary-900/30',
      borderColor: 'border-primary-500',
    },
  };

  const badge = badges[status];
  const Icon = badge.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${badge.bgColor} ${badge.borderColor} ${badge.color} ${sizeClasses[size]} rounded-full border font-medium`}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{badge.label}</span>}
    </div>
  );
}
