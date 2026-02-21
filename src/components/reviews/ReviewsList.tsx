import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import ReviewStats from './ReviewStats';
import { reviewService, VideoReview, CreatorReview, ReviewStats as ReviewStatsType } from '../../services/reviewService';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewsListProps {
  targetId: string;
  reviewType: 'video' | 'creator';
  canRespond?: boolean;
}

export default function ReviewsList({ targetId, reviewType, canRespond = false }: ReviewsListProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<(VideoReview | CreatorReview)[]>([]);
  const [stats, setStats] = useState<ReviewStatsType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'rating'>('helpful');

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [targetId, reviewType]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = reviewType === 'video'
        ? await reviewService.getVideoReviews(targetId, user?.id)
        : await reviewService.getCreatorReviews(targetId, user?.id);
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = reviewType === 'video'
        ? await reviewService.getVideoReviewStats(targetId)
        : await reviewService.getCreatorReviewStats(targetId);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSubmitReview = async (reviewData: { rating: number; title: string; content: string }) => {
    try {
      if (editingReview) {
        if (reviewType === 'video') {
          await reviewService.updateVideoReview(editingReview, reviewData);
        } else {
          await reviewService.updateCreatorReview(editingReview, reviewData);
        }
        setEditingReview(null);
      } else {
        if (reviewType === 'video') {
          await reviewService.createVideoReview({ ...reviewData, video_id: targetId });
        } else {
          await reviewService.createCreatorReview({ ...reviewData, creator_id: targetId });
        }
      }
      setShowForm(false);
      await loadReviews();
      await loadStats();
    } catch (error) {
      throw error;
    }
  };

  const handleHelpful = async (reviewId: string, isHelpful: boolean) => {
    if (!user) return;

    try {
      const review = reviews.find(r => r.id === reviewId);
      if (review && review.user_helpfulness === isHelpful) {
        await reviewService.removeHelpfulness(reviewId, reviewType);
      } else {
        await reviewService.markReviewHelpful(reviewId, reviewType, isHelpful);
      }
      await loadReviews();
    } catch (error) {
      console.error('Failed to mark review helpful:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      if (reviewType === 'video') {
        await reviewService.deleteVideoReview(reviewId);
      } else {
        await reviewService.deleteCreatorReview(reviewId);
      }
      await loadReviews();
      await loadStats();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleEdit = (reviewId: string) => {
    setEditingReview(reviewId);
    setShowForm(true);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') {
      return b.helpful_count - a.helpful_count;
    } else if (sortBy === 'recent') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  const userReview = reviews.find(r => r.reviewer_id === user?.id);
  const editingReviewData = editingReview
    ? reviews.find(r => r.id === editingReview)
    : null;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats && <ReviewStats stats={stats} />}

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Reviews</h3>

          {user && !userReview && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Star className="w-5 h-5" />
              Write a Review
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-6">
            <ReviewForm
              onSubmit={handleSubmitReview}
              onCancel={() => {
                setShowForm(false);
                setEditingReview(null);
              }}
              initialValues={editingReviewData ? {
                rating: editingReviewData.rating,
                title: editingReviewData.title,
                content: editingReviewData.content
              } : undefined}
              isEditing={!!editingReview}
            />
          </div>
        )}

        {reviews.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400">Sort by:</span>
              <div className="flex gap-2">
                {[
                  { value: 'helpful', label: 'Most Helpful' },
                  { value: 'recent', label: 'Most Recent' },
                  { value: 'rating', label: 'Highest Rating' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`px-4 py-2 rounded-lg transition ${
                      sortBy === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  reviewType={reviewType}
                  onHelpful={handleHelpful}
                  onEdit={user?.id === review.reviewer_id ? handleEdit : undefined}
                  onDelete={user?.id === review.reviewer_id ? handleDelete : undefined}
                  onRespond={canRespond && user?.id !== review.reviewer_id ? () => {} : undefined}
                />
              ))}
            </div>
          </>
        )}

        {reviews.length === 0 && !showForm && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
            <p className="text-gray-400 mb-6">Be the first to share your experience!</p>
            {user && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Write the First Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
