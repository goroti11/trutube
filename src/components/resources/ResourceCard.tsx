import { Clock, BookOpen, TrendingUp, Eye } from 'lucide-react';
import { Resource } from '../../services/resourceService';

interface ResourceCardProps {
  resource: Resource;
  onClick: () => void;
}

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const typeIcons = {
  guide: BookOpen,
  tutorial: TrendingUp,
  documentation: BookOpen,
  video: Clock,
  pdf: BookOpen,
  link: TrendingUp
};

export default function ResourceCard({ resource, onClick }: ResourceCardProps) {
  const Icon = typeIcons[resource.type] || BookOpen;

  return (
    <div
      onClick={onClick}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-600/50 hover:bg-gray-900 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
          {resource.difficulty && (
            <span className={`px-2 py-1 rounded text-xs font-medium border ${difficultyColors[resource.difficulty]}`}>
              {resource.difficulty === 'beginner' && 'Débutant'}
              {resource.difficulty === 'intermediate' && 'Intermédiaire'}
              {resource.difficulty === 'advanced' && 'Avancé'}
            </span>
          )}
        </div>
        {resource.estimated_time && (
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            {resource.estimated_time} min
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
        {resource.title}
      </h3>

      {resource.description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {resource.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {resource.views.toLocaleString()}
          </div>
          {resource.category && (
            <span className="px-2 py-0.5 bg-gray-800 rounded text-gray-400">
              {resource.category.name}
            </span>
          )}
        </div>
      </div>

      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-800/50 rounded text-xs text-gray-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
