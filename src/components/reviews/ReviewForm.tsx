import { useState } from 'react';
import { Star, X } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (review: { rating: number; title: string; content: string }) => Promise<void>;
  onCancel: () => void;
  initialValues?: {
    rating: number;
    title: string;
    content: string;
  };
  isEditing?: boolean;
}

export default function ReviewForm({
  onSubmit,
  onCancel,
  initialValues,
  isEditing = false
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialValues?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (title.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    if (content.length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, title, content });
      setRating(0);
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          {isEditing ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-3 text-white font-semibold">
                {rating} {rating === 1 ? 'star' : 'stars'}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Review Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience..."
            maxLength={200}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <p className="text-sm text-gray-400 mt-1">
            {title.length}/200 characters
          </p>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
            Your Review
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts and experiences..."
            rows={6}
            maxLength={5000}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            required
          />
          <p className="text-sm text-gray-400 mt-1">
            {content.length}/5000 characters
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
