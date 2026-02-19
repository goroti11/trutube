import { ArrowRight } from 'lucide-react';
import { BlogArticle } from '../../services/blogService';
import BlogArticleCard from './BlogArticleCard';

interface BlogRelatedArticlesProps {
  articles: BlogArticle[];
  onArticleClick: (slug: string) => void;
}

export default function BlogRelatedArticles({ articles, onArticleClick }: BlogRelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Articles connexes
        <ArrowRight className="w-6 h-6 text-red-500" />
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <BlogArticleCard
            key={article.id}
            article={article}
            onClick={() => onArticleClick(article.slug)}
          />
        ))}
      </div>
    </div>
  );
}
