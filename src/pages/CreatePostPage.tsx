import { useState } from 'react';
import { ArrowLeft, FileText, Image, Video, BarChart3, MessageCircle, HelpCircle } from 'lucide-react';
import { communityService } from '../services/communityService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

type PostType = 'text' | 'image' | 'video' | 'poll' | 'thread' | 'qa';

interface CreatePostPageProps {
  slug?: string;
}

export default function CreatePostPage({ slug = 'music-afrobeat' }: CreatePostPageProps) {
  const { user } = useAuth();
  const [postType, setPostType] = useState<PostType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const postTypes = [
    { type: 'text' as PostType, icon: FileText, label: 'Texte', description: 'Discussion classique' },
    { type: 'image' as PostType, icon: Image, label: 'Image', description: 'Partager une image' },
    { type: 'video' as PostType, icon: Video, label: 'Vidéo', description: 'Mini-vidéo courte' },
    { type: 'poll' as PostType, icon: BarChart3, label: 'Sondage', description: 'Poser une question' },
    { type: 'thread' as PostType, icon: MessageCircle, label: 'Thread', description: 'Discussion en fil' },
    { type: 'qa' as PostType, icon: HelpCircle, label: 'Q&A', description: 'Question-réponse' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !slug) return;

    setLoading(true);
    try {
      const community = await communityService.getCommunityBySlug(slug);
      if (!community) return;

      const post = await communityService.createPost({
        community_id: community.id,
        author_id: user.id,
        title: title.trim() || undefined,
        content: content.trim(),
        post_type: postType,
        visibility: 'public',
      });

      if (post) {
        window.location.hash = `community/${slug}`;
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
        <a
          href={`#community/${slug}`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à la communauté
        </a>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Créer un post</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de post
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {postTypes.map((type) => (
                  <button
                    key={type.type}
                    type="button"
                    onClick={() => setPostType(type.type)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      postType === type.type
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <type.icon
                      className={`w-6 h-6 mb-2 ${
                        postType === type.type ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    />
                    <div className="font-medium text-gray-900 mb-1">{type.label}</div>
                    <div className="text-xs text-gray-600">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre (optionnel)
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Un titre accrocheur pour votre post..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Contenu *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Partagez vos pensées avec la communauté..."
                rows={10}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-600 mt-2">
                {content.length} caractères
              </p>
            </div>

            {postType === 'image' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition-colors cursor-pointer">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Cliquez pour ajouter une image
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF jusqu'à 10MB
                  </p>
                </div>
              </div>
            )}

            {postType === 'video' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vidéo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition-colors cursor-pointer">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Cliquez pour ajouter une vidéo
                  </p>
                  <p className="text-xs text-gray-500">
                    MP4, WebM jusqu'à 2 minutes
                  </p>
                </div>
              </div>
            )}

            {postType === 'poll' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options du sondage
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Option 1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Option 2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Ajouter une option
                  </button>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Rappel</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Respectez les règles de la communauté</li>
                <li>• Soyez respectueux envers les autres membres</li>
                <li>• Pas de spam ou de contenu promotionnel excessif</li>
                <li>• Vérifiez votre contenu avant de publier</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-4">
              <a
                href={`#community/${slug}`}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-block"
              >
                Annuler
              </a>
              <button
                type="submit"
                disabled={!content.trim() || loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publication...' : 'Publier'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
