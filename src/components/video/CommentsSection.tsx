import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, MoreVertical, Flag, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string;
  };
  content: string;
  likeCount: number;
  createdAt: string;
  isLiked: boolean;
}

interface CommentsSectionProps {
  comments: Comment[];
  commentCount: number;
  currentUserId?: string;
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string) => void;
  onReportComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export default function CommentsSection({
  comments,
  commentCount,
  currentUserId,
  onAddComment,
  onLikeComment,
  onReportComment,
  onDeleteComment
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('popular');
  const [showMenuForComment, setShowMenuForComment] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likeCount - a.likeCount;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          {commentCount} commentaire{commentCount > 1 ? 's' : ''}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy('popular')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'popular'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Les plus populaires
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'recent'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Les plus récents
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setNewComment('')}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Commenter
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <img
              src={comment.user.avatarUrl}
              alt={comment.user.displayName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">
                      {comment.user.displayName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setShowMenuForComment(
                        showMenuForComment === comment.id ? null : comment.id
                      )
                    }
                    className="w-8 h-8 hover:bg-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>

                  {showMenuForComment === comment.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenuForComment(null)}
                      />
                      <div className="absolute right-0 top-10 bg-gray-900 rounded-lg shadow-2xl border border-gray-800 w-48 overflow-hidden z-50">
                        {currentUserId === comment.user.id ? (
                          <button
                            onClick={() => {
                              onDeleteComment(comment.id);
                              setShowMenuForComment(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm">Supprimer</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onReportComment(comment.id);
                              setShowMenuForComment(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left text-red-400"
                          >
                            <Flag className="w-4 h-4" />
                            <span className="text-sm">Signaler</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => onLikeComment(comment.id)}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    comment.isLiked
                      ? 'text-blue-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {comment.likeCount > 0 && (
                    <span>{formatCount(comment.likeCount)}</span>
                  )}
                </button>

                <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                </button>

                <button className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
                  Répondre
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Aucun commentaire pour le moment</p>
          <p className="text-sm text-gray-500 mt-1">Soyez le premier à commenter</p>
        </div>
      )}
    </div>
  );
}
