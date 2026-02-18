import { useState, useEffect } from 'react';
import {
  ArrowLeft, Camera, Upload, X, Plus, Link2, Save,
  Twitter, Instagram, Youtube, ExternalLink, Copy, Check, Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileEnhancedService, SocialLink } from '../services/profileEnhancedService';

interface EditProfilePageProps {
  onNavigate: (page: string) => void;
}

export default function EditProfilePage({ onNavigate }: EditProfilePageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    bio: '',
    about: '',
    channel_url: '',
    avatar_url: '',
    banner_url: ''
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({ platform: 'website' as SocialLink['platform'], url: '' });
  const [channelUrlCopied, setChannelUrlCopied] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const profile = await profileEnhancedService.getEnhancedProfile(user.id);
      if (profile) {
        setFormData({
          display_name: profile.display_name || '',
          username: profile.username || '',
          bio: profile.bio || '',
          about: profile.about || '',
          channel_url: profile.channel_url || '',
          avatar_url: profile.avatar_url || '',
          banner_url: profile.banner_url || ''
        });
      }

      const links = await profileEnhancedService.getSocialLinks(user.id);
      setSocialLinks(links);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const success = await profileEnhancedService.updateProfileInfo(user.id, {
        display_name: formData.display_name,
        username: formData.username,
        bio: formData.bio,
        about: formData.about,
        channel_url: formData.channel_url
      });

      if (success) {
        setSuccess('Profil mis à jour avec succès!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Erreur lors de la mise à jour du profil');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (type: 'avatar' | 'banner') => {
    alert('Fonction d\'upload à implémenter avec Supabase Storage');
  };

  const handleGenerateChannelUrl = async () => {
    const generated = await profileEnhancedService.generateChannelUrl(formData.username);
    setFormData({ ...formData, channel_url: generated });
  };

  const handleCopyChannelUrl = async () => {
    const fullUrl = `${window.location.origin}/channel/${formData.channel_url}`;
    await navigator.clipboard.writeText(fullUrl);
    setChannelUrlCopied(true);
    setTimeout(() => setChannelUrlCopied(false), 2000);
  };

  const handleAddSocialLink = async () => {
    if (!user || !newLink.url) return;

    const result = await profileEnhancedService.addSocialLink(
      user.id,
      newLink.platform,
      newLink.url,
      socialLinks.length
    );

    if (result) {
      setSocialLinks([...socialLinks, result]);
      setNewLink({ platform: 'website', url: '' });
      setShowAddLink(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    const success = await profileEnhancedService.deleteSocialLink(linkId);
    if (success) {
      setSocialLinks(socialLinks.filter(link => link.id !== linkId));
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      default: return <Link2 className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 bg-gray-950 bg-opacity-95 backdrop-blur border-b border-gray-800 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Modifier le profil</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-primary-500/20 to-accent-500/20">
              {formData.banner_url && (
                <img
                  src={formData.banner_url}
                  alt="Bannière"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => handleImageUpload('banner')}
                className="absolute bottom-4 right-4 px-4 py-2 bg-gray-900/90 hover:bg-gray-800 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Changer la bannière
              </button>
            </div>

            <div className="px-6 pb-6">
              <div className="relative -mt-16 mb-6">
                <div className="w-32 h-32 bg-gray-800 rounded-full border-4 border-gray-900 overflow-hidden">
                  {formData.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                      {formData.display_name?.[0] || '?'}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleImageUpload('avatar')}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nom d'affichage</label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
                placeholder="@nomutilisateur"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL de la chaîne</label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                  <span className="text-gray-500 mr-2">trutube.com/channel/</span>
                  <input
                    type="text"
                    value={formData.channel_url}
                    onChange={(e) => setFormData({ ...formData, channel_url: e.target.value })}
                    className="flex-1 bg-transparent outline-none"
                    placeholder="mon-url"
                  />
                </div>
                <button
                  onClick={handleCopyChannelUrl}
                  className="px-4 py-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg transition-colors"
                  title="Copier l'URL"
                >
                  {channelUrlCopied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleGenerateChannelUrl}
                  className="px-4 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Générer
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                URL complète: {window.location.origin}/channel/{formData.channel_url || '...'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 min-h-[80px] resize-none"
                placeholder="Quelques mots sur vous..."
                maxLength={150}
              />
              <p className="text-sm text-gray-400 mt-1">{formData.bio.length}/150 caractères</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description de la chaîne</label>
              <textarea
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 min-h-[150px] resize-none"
                placeholder="Décrivez votre chaîne en détail..."
              />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Liens externes</h3>
              <button
                onClick={() => setShowAddLink(!showAddLink)}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un lien
              </button>
            </div>

            {showAddLink && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <select
                    value={newLink.platform}
                    onChange={(e) => setNewLink({ ...newLink, platform: e.target.value as SocialLink['platform'] })}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                  >
                    <option value="website">Site web</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitch">Twitch</option>
                    <option value="discord">Discord</option>
                    <option value="other">Autre</option>
                  </select>
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://..."
                    className="md:col-span-2 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddSocialLink}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors"
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => setShowAddLink(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {socialLinks.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Aucun lien ajouté</p>
              ) : (
                socialLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between bg-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        {getPlatformIcon(link.platform)}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{link.platform}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-400 hover:underline flex items-center gap-1"
                        >
                          {link.url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="w-8 h-8 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors text-red-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
