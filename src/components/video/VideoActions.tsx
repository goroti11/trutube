import { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Flag,
  Bookmark,
  BookmarkCheck,
  Scissors,
  ListPlus,
  Sparkles,
  MoreHorizontal
} from 'lucide-react';

interface VideoActionsProps {
  likeCount: number;
  dislikeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onDislike: () => void;
  onShare: () => void;
  onSave: () => void;
  onDownload: () => void;
  onReport: () => void;
  onCreateClip: () => void;
  onAddToPlaylist: () => void;
  onRemix: () => void;
}

export default function VideoActions({
  likeCount,
  dislikeCount,
  isLiked,
  isDisliked,
  isSaved,
  onLike,
  onDislike,
  onShare,
  onSave,
  onDownload,
  onReport,
  onCreateClip,
  onAddToPlaylist,
  onRemix
}: VideoActionsProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const mainActions = [
    {
      icon: ThumbsUp,
      label: formatCount(likeCount),
      active: isLiked,
      onClick: onLike,
      className: isLiked ? 'text-blue-500' : ''
    },
    {
      icon: ThumbsDown,
      label: formatCount(dislikeCount),
      active: isDisliked,
      onClick: onDislike,
      className: isDisliked ? 'text-red-500' : ''
    },
    {
      icon: Share2,
      label: 'Partager',
      active: false,
      onClick: onShare
    },
    {
      icon: isSaved ? BookmarkCheck : Bookmark,
      label: isSaved ? 'Enregistré' : 'Enregistrer',
      active: isSaved,
      onClick: onSave,
      className: isSaved ? 'text-yellow-500' : ''
    }
  ];

  const moreActions = [
    {
      icon: Download,
      label: 'Télécharger',
      onClick: onDownload
    },
    {
      icon: Scissors,
      label: 'Créer un clip',
      onClick: onCreateClip
    },
    {
      icon: ListPlus,
      label: 'Ajouter à la playlist',
      onClick: onAddToPlaylist
    },
    {
      icon: Sparkles,
      label: 'Remixer',
      onClick: onRemix
    },
    {
      icon: Flag,
      label: 'Signaler',
      onClick: onReport,
      className: 'text-red-400'
    }
  ];

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        {mainActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-full transition-all ${
              action.active ? 'ring-2 ring-blue-500/50' : ''
            } ${action.className}`}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {showMoreMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMoreMenu(false)}
            />
            <div className="absolute right-0 top-12 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 w-64 overflow-hidden z-50">
              {moreActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    setShowMoreMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left ${
                    action.className || 'text-gray-300'
                  }`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
