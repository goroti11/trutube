import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Trash2 } from 'lucide-react';
import { profileEnhancedService, ProfileReview } from '../../services/profileEnhancedService';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileReviewsSectionProps {
  profileId: string;
  isOwnProfile: boolean;
}

export default function ProfileReviewsSection({ profileId, isOwnProfile }: ProfileReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ProfileReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [profileId]);

  const loadReviews = async () => {
    setLoading(true);
    const data = await profileEnhancedService.getProfileReviews(profileId);
    setReviews(data);
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (!user || isOwnProfile) return;

    setSubmitting(true);
    const result = await profileEnhancedService.addReview(
      user.id,
      profileId,
      rating,
      reviewText
    );

    if (result) {
      setShowAddReview(false);
      setReviewText('');
      setRating(5);
      await loadReviews();
    }
    setSubmitting(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('Supprimer cet avis?')) {
      const success = await profileEnhancedService.deleteReview(reviewId);
      if (success) {
        await loadReviews();
      }
    }
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && setRating(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= count
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Avis ({reviews.length})</h3>
        {!isOwnProfile && user && (
          <button
            onClick={() => setShowAddReview(!showAddReview)}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors"
          >
            Laisser un avis
          </button>
        )}
      </div>

      {showAddReview && (
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h4 className="font-semibold mb-3">Votre avis</h4>
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Note</label>
            {renderStars(rating, true)}
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Partagez votre expérience... (optionnel)"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 mb-4 min-h-[100px] resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {submitting ? 'Envoi...' : 'Publier'}
            </button>
            <button
              onClick={() => setShowAddReview(false)}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun avis pour le moment</p>
            {!isOwnProfile && user && (
              <p className="text-sm mt-1">Soyez le premier à laisser un avis</p>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                    {review.reviewer?.avatar_url ? (
                      <img
                        src={review.reviewer.avatar_url}
                        alt={review.reviewer.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {review.reviewer?.display_name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {review.reviewer?.display_name || 'Utilisateur'}
                    </p>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-400">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                {user?.id === review.reviewer_id && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="w-8 h-8 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                )}
              </div>
              {review.review_text && (
                <p className="text-gray-300 mb-3">{review.review_text}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <button className="flex items-center gap-1 hover:text-white transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Utile ({review.helpful_count})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
