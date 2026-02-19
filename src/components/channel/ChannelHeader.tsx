import { User, Users, Video, Share2, MoreVertical, Edit } from 'lucide-react';
import { useState } from 'react';

interface ChannelHeaderProps {
  channelData: {
    id: string;
    banner_url: string;
    avatar_url: string;
    display_name: string;
    subscriber_count: number;
    video_count: number;
    description: string;
    social_links?: Array<{ platform: string; url: string; icon?: string }>;
    country?: string;
    created_at: string;
    total_views: number;
    channel_url: string;
    is_verified?: boolean;
  };
  isOwner: boolean;
  isSubscribed: boolean;
  onSubscribe: () => void;
  onEdit?: () => void;
}

export default function ChannelHeader({
  channelData,
  isOwner,
  isSubscribed,
  onSubscribe,
  onEdit
}: ChannelHeaderProps) {
  const [showMore, setShowMore] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const handleShare = async () => {
    const channelLink = `${window.location.origin}/channel/${channelData.channel_url}`;
    try {
      await navigator.clipboard.writeText(channelLink);
      alert('Lien de la chaîne copié!');
    } catch (err) {
      console.error('Erreur copie:', err);
    }
  };

  return (
    <div className="bg-neutral-900 border-b border-neutral-800">
      <div
        className="h-48 md:h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${channelData.banner_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/80"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 relative z-10">
          <div className="w-32 h-32 rounded-full border-4 border-neutral-900 overflow-hidden bg-neutral-800 flex-shrink-0">
            {channelData.avatar_url ? (
              <img
                src={channelData.avatar_url}
                alt={channelData.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-16 h-16 text-neutral-600" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white truncate">
                {channelData.display_name}
              </h1>
              {channelData.is_verified && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-neutral-400 text-sm mb-3">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {formatNumber(channelData.subscriber_count)} abonnés
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Video className="w-4 h-4" />
                {channelData.video_count} vidéos
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {!isOwner && (
                <button
                  onClick={onSubscribe}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    isSubscribed
                      ? 'bg-neutral-700 text-white hover:bg-neutral-600'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isSubscribed ? 'Abonné' : 'S\'abonner'}
                </button>
              )}

              {isOwner && (
                <>
                  <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-full font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier la chaîne
                  </button>
                  <button
                    onClick={() => window.location.href = '/subscribers'}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Voir vos abonnés
                  </button>
                </>
              )}

              <button
                onClick={handleShare}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full font-semibold flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Partager
              </button>

              <button
                onClick={() => setShowMore(!showMore)}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {channelData.description && (
          <div className="mt-4 max-w-4xl">
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="text-neutral-400 hover:text-white transition-colors text-sm"
            >
              {showDescription ? 'Masquer la description' : 'Afficher la description'}
            </button>

            {showDescription && (
              <div className="mt-2 p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-neutral-300 whitespace-pre-wrap">{channelData.description}</p>

                {channelData.social_links && channelData.social_links.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-neutral-700">
                    {channelData.social_links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-full text-sm text-white transition-colors"
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-neutral-700 text-sm text-neutral-400">
                  {channelData.country && (
                    <span>🌍 {channelData.country}</span>
                  )}
                  <span>📅 Actif depuis {formatDate(channelData.created_at)}</span>
                  <span>👁️ {formatNumber(channelData.total_views)} vues cumulées</span>
                  <button
                    onClick={handleShare}
                    className="hover:text-white transition-colors"
                  >
                    🔗 Copier le lien
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showMore && (
        <div className="absolute right-4 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50">
          <div className="py-2">
            <button className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700 transition-colors">
              Signaler la chaîne
            </button>
            <button className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700 transition-colors">
              Bloquer la chaîne
            </button>
            <button
              onClick={handleShare}
              className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700 transition-colors"
            >
              Copier le lien
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
