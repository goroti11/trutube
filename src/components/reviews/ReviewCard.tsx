import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MoreVertical, Flag, Edit, Trash2, MessageSquare, CheckCircle } from 'lucide-react';
import { VideoReview, CreatorReview } from '../../services/reviewService';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewCardProps {
  review: VideoReview | CreatorReview;
  reviewType: 'video' | 'creator';
  onHelpful: (reviewId: string, isHelpful: boolean) => void;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onRespond?: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  reviewType,
  onHelpful,
  onEdit,
  onDelete,
  onReport,
  onRespond
}: ReviewCardProps) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = user?.id === review.reviewer_id;
  const verifiedLabel = reviewType === 'video'
    ? (review as VideoReview).verified_purchase
    : (review as CreatorReview).verified_supporter;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <img
            src={review.reviewer?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer?.username}`}
            alt={review.reviewer?.display_name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-white">{review.reviewer?.display_name}</h4>
              {verifiedLabel && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified {reviewType === 'video' ? 'Purchase' : 'Supporter'}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span>{formatDate(review.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 z-10">
              {isOwner && onEdit && (
                <button
                  onClick={() => {
                    onEdit(review.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-300 hover:bg-gray-800 rounded-t-lg"
                >
                  <Edit className="w-4 h-4" />
                  Edit Review
                </button>
              )}
              {isOwner && onDelete && (
                <button
                  onClick={() => {
                    onDelete(review.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-400 hover:bg-gray-800"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Review
                </button>
              )}
              {!isOwner && onReport && (
                <button
                  onClick={() => {
                    onReport(review.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-300 hover:bg-gray-800 rounded-b-lg"
                >
                  <Flag className="w-4 h-4" />
                  Report Review
                </button>
              )}
              {!isOwner && onRespond && (
                <button
                  onClick={() => {
                    onRespond(review.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-300 hover:bg-gray-800 rounded-b-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  Respond
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-white text-lg mb-2">{review.title}</h3>
      <p className="text-gray-300 mb-4 leading-relaxed">{review.content}</p>

      {review.response && (
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">Creator Response</span>
          </div>
          <p className="text-gray-300 text-sm">{review.response.content}</p>
          <p className="text-xs text-gray-500 mt-2">
            {formatDate(review.response.created_at)}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => onHelpful(review.id, true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            review.user_helpfulness === true
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm">Helpful</span>
          {review.helpful_count > 0 && (
            <span className="text-sm font-semibold">({review.helpful_count})</span>
          )}
        </button>

        <button
          onClick={() => onHelpful(review.id, false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            review.user_helpfulness === false
              ? 'bg-red-500/20 text-red-400'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span className="text-sm">Not Helpful</span>
        </button>
      </div>
    </div>
  );
}
