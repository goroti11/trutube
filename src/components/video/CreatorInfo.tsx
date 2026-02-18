import { useState } from 'react';
import { Bell, BellOff, Check, Heart } from 'lucide-react';
import { User } from '../../types';

interface CreatorInfoProps {
  creator: User;
  isSubscribed: boolean;
  subscriberCount: number;
  hasNotifications: boolean;
  onSubscribe: () => void;
  onToggleNotifications: () => void;
  onTip: () => void;
}

export default function CreatorInfo({
  creator,
  isSubscribed,
  subscriberCount,
  hasNotifications,
  onSubscribe,
  onToggleNotifications,
  onTip
}: CreatorInfoProps) {
  const [isHoveringNotif, setIsHoveringNotif] = useState(false);

  const formatSubscribers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={creator.avatarUrl}
          alt={creator.displayName}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-800"
        />

        <div>
          <h3 className="font-semibold text-white">{creator.displayName}</h3>
          <p className="text-sm text-gray-400">
            {formatSubscribers(subscriberCount)} abonné{subscriberCount > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSubscribed ? (
          <>
            <button
              onClick={onSubscribe}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Check className="w-4 h-4" />
              <span className="font-medium">Abonné</span>
            </button>

            <button
              onClick={onToggleNotifications}
              onMouseEnter={() => setIsHoveringNotif(true)}
              onMouseLeave={() => setIsHoveringNotif(false)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                hasNotifications
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}
              title={
                hasNotifications
                  ? 'Désactiver les notifications'
                  : 'Activer les notifications'
              }
            >
              {hasNotifications && !isHoveringNotif ? (
                <Bell className="w-5 h-5" />
              ) : hasNotifications && isHoveringNotif ? (
                <BellOff className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </button>
          </>
        ) : (
          <button
            onClick={onSubscribe}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-lg shadow-red-500/20"
          >
            <span className="font-semibold">S'abonner</span>
          </button>
        )}

        <button
          onClick={onTip}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 rounded-full transition-all shadow-lg"
        >
          <Heart className="w-4 h-4" />
          <span className="font-medium">Tip</span>
        </button>
      </div>
    </div>
  );
}
