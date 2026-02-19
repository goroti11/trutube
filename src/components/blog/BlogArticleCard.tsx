import { Clock, Eye, Heart, Calendar } from 'lucide-react';
import { BlogArticle } from '../../services/blogService';

interface BlogArticleCardProps {
  article: BlogArticle;
  onClick: () => void;
}

export default function BlogArticleCard({ article, onClick }: BlogArticleCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article
      onClick={onClick}
      className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-red-600 transition-all cursor-pointer group"
    >
      {article.cover_image && (
        <div className="aspect-video overflow-hidden bg-neutral-800">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {article.category && (
          <div className="mb-3">
            <span
              className="inline-block px-2 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: article.category.color + '20', color: article.category.color }}
            >
              {article.category.name}
            </span>
          </div>
        )}

        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-red-500 transition-colors">
          {article.title}
        </h3>

        <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(article.published_at || article.created_at)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.reading_time} min
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {article.views.toLocaleString()}
          </div>
          {article.reactions && article.reactions.likes > 0 && (
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {article.reactions.likes}
            </div>
          )}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-800">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
