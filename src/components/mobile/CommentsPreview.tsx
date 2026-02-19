import { MessageCircle, ThumbsUp, ChevronRight } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  likes: number;
  timeAgo: string;
}

interface CommentsPreviewProps {
  comments: Comment[];
  commentCount: number;
  onViewAll: () => void;
}

export default function CommentsPreview({ comments, commentCount, onViewAll }: CommentsPreviewProps) {
  const topComments = comments.slice(0, 3);

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-gray-400" />
          <span className="text-white font-medium">
            Commentaires <span className="text-gray-400">({commentCount})</span>
          </span>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-[#D8A0B6] text-sm font-medium"
        >
          Voir tout
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="space-y-4">
        {topComments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img
              src={comment.authorAvatar}
              alt={comment.author}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">{comment.author}</span>
                <span className="text-xs text-gray-400">{comment.timeAgo}</span>
              </div>
              <p className="text-sm text-gray-300 line-clamp-2">{comment.content}</p>
              <div className="flex items-center gap-4 mt-2">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                  <ThumbsUp size={14} />
                  <span>{comment.likes}</span>
                </button>
                <button className="text-xs text-gray-400 hover:text-white transition-colors">
                  Répondre
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onViewAll}
        className="w-full mt-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition-colors"
      >
        Afficher les {commentCount} commentaires
      </button>
    </div>
  );
}
