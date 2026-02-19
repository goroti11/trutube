import { User, Users } from 'lucide-react';

interface CreatorAboutProps {
  channelId: string;
  channelName: string;
  channelAvatar?: string;
  subscriberCount: number;
  channelDescription?: string;
  isVerified?: boolean;
  onVisitChannel: () => void;
}

export default function CreatorAbout({
  channelName,
  channelAvatar,
  subscriberCount,
  channelDescription,
  isVerified,
  onVisitChannel
}: CreatorAboutProps) {
  const formatSubscribers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-4">À propos du créateur</h3>

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
          {channelAvatar ? (
            <img
              src={channelAvatar}
              alt={channelName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-bold truncate">{channelName}</h4>
            {isVerified && (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
            <Users className="w-4 h-4" />
            <span>{formatSubscribers(subscriberCount)} abonnés</span>
          </div>

          {channelDescription && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
              {channelDescription}
            </p>
          )}

          <button
            onClick={onVisitChannel}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors"
          >
            Visiter la chaîne
          </button>
        </div>
      </div>
    </div>
  );
}
