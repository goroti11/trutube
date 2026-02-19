import { useState } from 'react';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { BlogComment, blogService } from '../../services/blogService';
import { useAuth } from '../../contexts/AuthContext';

interface BlogCommentSectionProps {
  articleId: string;
  comments: BlogComment[];
  onCommentAdded: () => void;
}

export default function BlogCommentSection({
  articleId,
  comments,
  onCommentAdded
}: BlogCommentSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      await blogService.addComment(articleId, newComment);
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return;

    setSubmitting(true);
    try {
      await blogService.addComment(articleId, replyContent, parentId);
      setReplyContent('');
      setReplyTo(null);
      onCommentAdded();
    } catch (error) {
      console.error('Failed to add reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) return;

    try {
      await blogService.deleteComment(commentId);
      onCommentAdded();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / 60000);

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return commentDate.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold">
          Commentaires ({comments.length})
        </h2>
      </div>

      {user ? (
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Partagez votre avis..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            rows={4}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Envoi...' : 'Publier'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 text-center">
          <p className="text-neutral-400 mb-4">Connectez-vous pour commenter</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {comment.user?.avatar_url ? (
                  <img
                    src={comment.user.avatar_url}
                    alt={comment.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    {comment.user?.username?.[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium">{comment.user?.username || 'Utilisateur'}</p>
                  <p className="text-xs text-neutral-500">{formatDate(comment.created_at)}</p>
                </div>
              </div>

              {user?.id === comment.user_id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-neutral-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-neutral-300 mb-3">{comment.content}</p>

            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="text-sm text-red-500 hover:text-red-400 transition-colors"
            >
              Répondre
            </button>

            {replyTo === comment.id && user && (
              <div className="mt-4 pl-4 border-l-2 border-red-600">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Votre réponse..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                    className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim() || submitting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Répondre
                  </button>
                </div>
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 pl-6 space-y-4 border-l-2 border-neutral-800">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-neutral-800/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {reply.user?.avatar_url ? (
                          <img
                            src={reply.user.avatar_url}
                            alt={reply.user.username}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {reply.user?.username?.[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{reply.user?.username || 'Utilisateur'}</p>
                          <p className="text-xs text-neutral-500">{formatDate(reply.created_at)}</p>
                        </div>
                      </div>

                      {user?.id === reply.user_id && (
                        <button
                          onClick={() => handleDeleteComment(reply.id)}
                          className="text-neutral-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-neutral-300">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            Aucun commentaire pour le moment. Soyez le premier à commenter!
          </div>
        )}
      </div>
    </div>
  );
}
