import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Eye, Calendar, Share2, Bookmark, Heart, Lightbulb, MessageCircle, ThumbsUp } from 'lucide-react';
import { blogService, BlogArticle, BlogComment } from '../services/blogService';
import { useAuth } from '../contexts/AuthContext';
import BlogRelatedArticles from '../components/blog/BlogRelatedArticles';
import BlogCommentSection from '../components/blog/BlogCommentSection';

interface BlogArticlePageProps {
  slug: string;
  onNavigate: (page: string, params?: any) => void;
}

export default function BlogArticlePage({ slug, onNavigate }: BlogArticlePageProps) {
  const { user } = useAuth();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasReacted, setHasReacted] = useState({
    like: false,
    love: false,
    insightful: false,
    bookmark: false
  });

  useEffect(() => {
    loadArticle();
    blogService.incrementArticleViews(slug);
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const [articleData, commentsData] = await Promise.all([
        blogService.getArticleBySlug(slug),
        blogService.getComments(slug)
      ]);

      if (articleData) {
        setArticle(articleData);
        const related = await blogService.getRelatedArticles(articleData.id);
        setRelatedArticles(related);
        setComments(commentsData);
      }
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type: 'like' | 'love' | 'insightful' | 'bookmark') => {
    if (!user || !article) return;

    try {
      if (hasReacted[type]) {
        await blogService.removeReaction(article.id, type);
        setHasReacted({ ...hasReacted, [type]: false });
      } else {
        await blogService.addReaction(article.id, type);
        setHasReacted({ ...hasReacted, [type]: true });
      }
      const updatedArticle = await blogService.getArticleBySlug(slug);
      if (updatedArticle) setArticle(updatedArticle);
    } catch (error) {
      console.error('Failed to update reaction:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-neutral-800 rounded w-3/4" />
            <div className="aspect-video bg-neutral-800 rounded-xl" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-neutral-800 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article non trouvé</h2>
          <button
            onClick={() => onNavigate('blog')}
            className="text-red-500 hover:text-red-400 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gradient-to-b from-neutral-950 to-black border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button
            onClick={() => onNavigate('blog')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </button>

          {article.category && (
            <div className="mb-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: article.category.color + '20', color: article.category.color }}
              >
                {article.category.name}
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-neutral-400 mb-8">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.published_at || article.created_at)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {article.reading_time} min de lecture
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {article.views.toLocaleString()} vues
            </div>
          </div>

          {article.author && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-800">
              {article.author.avatar_url ? (
                <img
                  src={article.author.avatar_url}
                  alt={article.author.username}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                  {article.author.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-white">{article.author.username}</p>
                <p className="text-sm text-neutral-400">Équipe Goroti</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {article.cover_image && (
        <div className="max-w-4xl mx-auto px-6 -mt-8 mb-12">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full aspect-video object-cover rounded-xl shadow-2xl border border-neutral-800"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-8 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleReaction('like')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasReacted.like
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{article.reactions?.likes || 0}</span>
            </button>

            <button
              onClick={() => handleReaction('love')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasReacted.love
                  ? 'bg-pink-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>{article.reactions?.loves || 0}</span>
            </button>

            <button
              onClick={() => handleReaction('insightful')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasReacted.insightful
                  ? 'bg-yellow-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>{article.reactions?.insightful || 0}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleReaction('bookmark')}
              className={`p-2 rounded-lg transition-colors ${
                hasReacted.bookmark
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
              title="Enregistrer"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 rounded-lg transition-colors"
              title="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <article className="prose prose-invert prose-lg max-w-none mb-12">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-neutral-800">
            {article.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigate('blog', { tag })}
                className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-full text-sm transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <BlogCommentSection
          articleId={article.id}
          comments={comments}
          onCommentAdded={loadArticle}
        />

        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-12 border-t border-neutral-800">
            <BlogRelatedArticles
              articles={relatedArticles}
              onArticleClick={(slug) => onNavigate('blog-article', { slug })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
