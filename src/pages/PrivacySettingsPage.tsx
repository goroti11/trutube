import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Users, Save, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileEnhancedService } from '../services/profileEnhancedService';

interface PrivacySettingsPageProps {
  onNavigate: (page: string) => void;
}

export default function PrivacySettingsPage({ onNavigate }: PrivacySettingsPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const [settings, setSettings] = useState({
    show_email: false,
    show_subscribers: true,
    allow_messages: true,
    show_activity: true,
    public_profile: true,
    show_liked_videos: false,
    show_playlists: true,
    allow_comments: true,
    allow_video_responses: true,
    mature_content_warning: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const profile = await profileEnhancedService.getEnhancedProfile(user.id);
      if (profile?.privacy_settings) {
        setSettings({ ...settings, ...profile.privacy_settings });
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const success = await profileEnhancedService.updatePrivacySettings(user.id, settings);

    if (success) {
      setSuccess('Paramètres de confidentialité enregistrés!');
      setTimeout(() => setSuccess(''), 3000);
    }
    setSaving(false);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
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
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary-400" />
              <h1 className="text-xl font-bold">Confidentialité</h1>
            </div>
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

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-semibold">Visibilité du profil</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium">Profil public</p>
                  <p className="text-sm text-gray-400">Permettre aux autres de voir votre profil</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.public_profile}
                  onChange={() => toggleSetting('public_profile')}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium">Afficher l'email</p>
                  <p className="text-sm text-gray-400">Rendre votre adresse email visible</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.show_email}
                  onChange={() => toggleSetting('show_email')}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium">Afficher les abonnés</p>
                  <p className="text-sm text-gray-400">Montrer le nombre d'abonnés</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.show_subscribers}
                  onChange={() => toggleSetting('show_subscribers')}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium">Afficher l'activité</p>
                  <p className="text-sm text-gray-400">Partager vos vues et interactions</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.show_activity}
                  onChange={() => toggleSetting('show_activity')}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium">Afficher les vidéos aimées</p>
                  <p className="text-sm text-gray-400">Rendre visible votre liste de likes</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.show_liked_videos}
                  onChange={() => toggleSetting('show_liked_videos')}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium">Afficher les playlists</p>
                  <p className="text-sm text-gray-400">Rendre vos playlists publiques</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.show_playlists}
                  onChange={() => toggleSetting('show_playlists')}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </label>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-semibold">Interactions</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium">Autoriser les messages</p>
                  <p className="text-sm text-gray-400">Recevoir des messages privés</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allow_messages}
                  onChange={() => toggleSetting('allow_messages')}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium">Autoriser les commentaires</p>
                  <p className="text-sm text-gray-400">Permettre aux autres de commenter vos vidéos</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allow_comments}
                  onChange={() => toggleSetting('allow_comments')}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium">Réponses vidéo</p>
                  <p className="text-sm text-gray-400">Autoriser les réponses en vidéo</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allow_video_responses}
                  onChange={() => toggleSetting('allow_video_responses')}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </label>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-semibold">Contenu sensible</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div>
                  <p className="font-medium">Avertissement contenu mature</p>
                  <p className="text-sm text-gray-400">Afficher un avertissement pour le contenu sensible</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.mature_content_warning}
                  onChange={() => toggleSetting('mature_content_warning')}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </label>
            </div>
          </div>

          <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Protection de vos données</h3>
                <p className="text-sm text-gray-300">
                  TruTube respecte votre vie privée. Vos informations sont sécurisées et ne seront
                  jamais partagées avec des tiers sans votre consentement explicite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
