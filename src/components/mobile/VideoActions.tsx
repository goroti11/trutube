import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2, Bookmark, Flag, Download } from 'lucide-react';

interface VideoActionsProps {
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onDislike: () => void;
  onShare: () => void;
  onSave: () => void;
  onReport: () => void;
  onDownload?: () => void;
}

export default function VideoActions({
  likes,
  dislikes,
  isLiked,
  isDisliked,
  isSaved,
  onLike,
  onDislike,
  onShare,
  onSave,
  onReport,
  onDownload
}: VideoActionsProps) {
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-3 px-4 scrollbar-hide">
      <button
        onClick={onLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          isLiked
            ? 'bg-[#D8A0B6] text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        <ThumbsUp size={18} />
        <span className="text-sm font-medium">{formatCount(likes)}</span>
      </button>

      <button
        onClick={onDislike}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          isDisliked
            ? 'bg-gray-700 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        <ThumbsDown size={18} />
        <span className="text-sm font-medium">{formatCount(dislikes)}</span>
      </button>

      <button
        onClick={onShare}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition-colors"
      >
        <Share2 size={18} />
        <span className="text-sm font-medium">Partager</span>
      </button>

      <button
        onClick={onSave}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          isSaved
            ? 'bg-[#D8A0B6] text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        <span className="text-sm font-medium">Enregistrer</span>
      </button>

      {onDownload && (
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition-colors"
        >
          <Download size={18} />
          <span className="text-sm font-medium">Télécharger</span>
        </button>
      )}

      <button
        onClick={onReport}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition-colors"
      >
        <Flag size={18} />
        <span className="text-sm font-medium">Signaler</span>
      </button>
    </div>
  );
}
