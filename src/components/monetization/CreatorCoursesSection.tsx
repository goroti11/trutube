import { useState, useEffect } from 'react';
import { GraduationCap, Clock, Star, Users, Play } from 'lucide-react';
import { digitalProductsService, DigitalProduct } from '../../services/digitalProductsService';

interface CreatorCoursesSectionProps {
  creatorId: string;
  onCourseClick?: (courseId: string) => void;
}

export default function CreatorCoursesSection({ creatorId, onCourseClick }: CreatorCoursesSectionProps) {
  const [courses, setCourses] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, [creatorId]);

  const loadCourses = async () => {
    setLoading(true);
    const data = await digitalProductsService.getPublishedProducts(creatorId);
    setCourses(data.filter(p => p.product_type === 'course').slice(0, 3));
    setLoading(false);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const getLevelBadge = (level: string | null) => {
    const badges: Record<string, { label: string; color: string }> = {
      beginner: { label: 'Débutant', color: 'bg-green-500' },
      intermediate: { label: 'Intermédiaire', color: 'bg-yellow-500' },
      advanced: { label: 'Avancé', color: 'bg-red-500' },
    };

    return badges[level || 'beginner'] || badges.beginner;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-48 mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-800 rounded-xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-orange-400" />
        Formations & Cours
      </h3>

      <div className="space-y-4">
        {courses.map((course) => {
          const levelBadge = getLevelBadge(course.level);

          return (
            <button
              key={course.id}
              onClick={() => onCourseClick?.(course.id)}
              className="w-full bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-all group text-left"
            >
              <div className="flex gap-4">
                <div className="w-32 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                  {course.cover_image_url ? (
                    <img
                      src={course.cover_image_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  {course.preview_video_url && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-lg line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {course.title}
                    </h4>
                    <span className={`${levelBadge.color} text-white text-xs px-2 py-1 rounded font-medium whitespace-nowrap`}>
                      {levelBadge.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    {course.duration_hours && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration_hours}h
                      </span>
                    )}
                    {course.total_sales > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.total_sales} étudiants
                      </span>
                    )}
                    {course.average_rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {course.average_rating.toFixed(1)} ({course.total_reviews})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-orange-400">
                      {formatPrice(course.price, course.currency)}
                    </p>
                    {course.is_featured && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded font-medium">
                        RECOMMANDÉ
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors">
        Voir toutes les formations
      </button>
    </div>
  );
}
