import { Star } from 'lucide-react';
import { ReviewStats as ReviewStatsType } from '../../services/reviewService';

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
  const { average_rating, total_reviews, rating_distribution } = stats;

  const getPercentage = (count: number) => {
    return total_reviews > 0 ? (count / total_reviews) * 100 : 0;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-6">Customer Reviews</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-white mb-2">
            {average_rating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(average_rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400">
            Based on {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = rating_distribution[stars as keyof typeof rating_distribution];
            const percentage = getPercentage(count);

            return (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-300">{stars}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
