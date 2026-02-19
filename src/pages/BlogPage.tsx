import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Clock, Eye, Tag as TagIcon } from 'lucide-react';
import { blogService, BlogArticle, BlogCategory } from '../services/blogService';
import BlogArticleCard from '../components/blog/BlogArticleCard';
import BlogCategoryFilter from '../components/blog/BlogCategoryFilter';
import BlogTrendingTags from '../components/blog/BlogTrendingTags';

interface BlogPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedTag, sortBy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, articlesData] = await Promise.all([
        blogService.getCategories(),
        blogService.getArticles({
          category: selectedCategory || undefined,
          tag: selectedTag || undefined,
          limit: 20
        })
      ]);

      setCategories(categoriesData);
      setArticles(articlesData.articles);
    } catch (error) {
      console.error('Failed to load blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }

    setLoading(true);
    try {
      const { articles: searchResults } = await blogService.getArticles({
        search: searchQuery,
        limit: 20
      });
      setArticles(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    setSelectedTag(null);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSelectedCategory(null);
  };

  const sortedArticles = [...articles].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'trending':
        return (b.reactions?.likes || 0) - (a.reactions?.likes || 0);
      case 'recent':
      default:
        return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gradient-to-b from-red-950/30 to-black border-b border-red-900/20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              TruTube Blog Officiel
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Découvrez les dernières actualités, guides et mises à jour de la plateforme
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Rechercher des articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-4 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <BlogCategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            <BlogTrendingTags
              onTagClick={handleTagClick}
              selectedTag={selectedTag}
            />

            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-red-500" />
                Trier par
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'recent', label: 'Plus récent', icon: Clock },
                  { value: 'popular', label: 'Plus populaire', icon: Eye },
                  { value: 'trending', label: 'Tendances', icon: TrendingUp }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      sortBy === option.value
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {selectedCategory && (
              <div className="mb-6 flex items-center gap-2">
                <span className="text-neutral-400">Catégorie:</span>
                <span className="px-3 py-1 bg-red-600 rounded-full text-sm font-medium">
                  {categories.find(c => c.slug === selectedCategory)?.name}
                </span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 text-neutral-400 hover:text-white"
                >
                  Effacer
                </button>
              </div>
            )}

            {selectedTag && (
              <div className="mb-6 flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-400">Tag:</span>
                <span className="px-3 py-1 bg-blue-600 rounded-full text-sm font-medium">
                  {selectedTag}
                </span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="ml-2 text-neutral-400 hover:text-white"
                >
                  Effacer
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-neutral-900 rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-neutral-800" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-neutral-800 rounded w-3/4" />
                      <div className="h-4 bg-neutral-800 rounded w-1/2" />
                      <div className="h-20 bg-neutral-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedArticles.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-400 mb-2">
                  Aucun article trouvé
                </h3>
                <p className="text-neutral-500">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {sortedArticles.map((article) => (
                  <BlogArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => onNavigate('blog-article', { slug: article.slug })}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
