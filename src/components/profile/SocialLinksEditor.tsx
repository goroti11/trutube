import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, ExternalLink, TrendingUp } from 'lucide-react';
import { socialLinksService, SOCIAL_PLATFORMS, SocialPlatform, SocialLink } from '../../services/socialLinksService';
import { useAuth } from '../../contexts/AuthContext';

interface SocialLinksEditorProps {
  userId: string;
  isOwnProfile: boolean;
}

export default function SocialLinksEditor({ userId, isOwnProfile }: SocialLinksEditorProps) {
  const { user } = useAuth();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLink, setNewLink] = useState({ platform: 'website' as SocialPlatform, url: '' });
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Record<string, number>>({});

  useEffect(() => {
    loadLinks();
    if (isOwnProfile) {
      loadAnalytics();
    }
  }, [userId]);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const data = await socialLinksService.getUserSocialLinks(userId);
      setLinks(data);
    } catch (error) {
      console.error('Erreur chargement liens:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await socialLinksService.getLinkAnalytics(userId);
      setAnalytics(data);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    }
  };

  const handleAddLink = async () => {
    if (!newLink.url.trim() || !user) return;

    try {
      await socialLinksService.addSocialLink(user.id, newLink.platform, newLink.url);
      await loadLinks();
      setIsAddingNew(false);
      setNewLink({ platform: 'website', url: '' });
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'ajout du lien');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!user) return;
    if (!confirm('Supprimer ce lien ?')) return;

    try {
      await socialLinksService.deleteSocialLink(linkId, user.id);
      await loadLinks();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleLinkClick = async (link: SocialLink) => {
    // Tracker le clic
    await socialLinksService.trackClick(link.id);
    // Ouvrir le lien
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const getPlatformInfo = (platform: SocialPlatform) => {
    return SOCIAL_PLATFORMS.find(p => p.value === platform);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Réseaux sociaux</h3>
          <p className="text-gray-400 text-sm mt-1">
            {isOwnProfile ? 'Ajoutez vos liens de réseaux sociaux' : 'Suivez sur les réseaux'}
          </p>
        </div>
        {isOwnProfile && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            {isEditing ? 'Terminer' : 'Modifier'}
          </button>
        )}
      </div>

      {/* Liste des liens */}
      {links.length === 0 && !isEditing ? (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {isOwnProfile ? 'Aucun lien ajouté' : 'Aucun réseau social renseigné'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => {
            const platformInfo = getPlatformInfo(link.platform);
            const clickCount = analytics[link.platform] || 0;

            return (
              <div
                key={link.id}
                className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors group"
              >
                {isEditing && (
                  <button className="cursor-move text-gray-500 hover:text-gray-300">
                    <GripVertical className="w-5 h-5" />
                  </button>
                )}

                <div
                  className="flex-1 flex items-center gap-3 cursor-pointer"
                  onClick={() => !isEditing && handleLinkClick(link)}
                >
                  {/* Icône de la plateforme */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: platformInfo?.color + '20' }}
                  >
                    {platformInfo?.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {platformInfo?.label}
                      </span>
                      {!isEditing && (
                        <ExternalLink className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm truncate max-w-md">
                      {link.url}
                    </p>
                  </div>

                  {/* Analytics pour le propriétaire */}
                  {isOwnProfile && !isEditing && clickCount > 0 && (
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{clickCount} clics</span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ajouter un nouveau lien */}
      {isEditing && (
        <div className="mt-4">
          {!isAddingNew ? (
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter un réseau social</span>
            </button>
          ) : (
            <div className="p-4 bg-gray-900 rounded-lg space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Plateforme</label>
                <select
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value as SocialPlatform })}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.icon} {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">URL</label>
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddLink}
                  disabled={!newLink.url.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewLink({ platform: 'website', url: '' });
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics globales */}
      {isOwnProfile && !isEditing && Object.keys(analytics).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total des clics</span>
            <span className="text-white font-semibold">
              {Object.values(analytics).reduce((a, b) => a + b, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
