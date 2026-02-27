import { useState, useEffect } from 'react';
import { Globe, Sparkles, Volume2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { autoDubService, GlobalSettings } from '../services/autoDubService';

interface GlobalModeSettingsPageProps {
  onNavigate?: (page: string) => void;
}

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'hi', name: 'हिन्दी' }
];

export default function GlobalModeSettingsPage({ onNavigate }: GlobalModeSettingsPageProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [voiceConsent, setVoiceConsent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [globalSettings, consent] = await Promise.all([
        autoDubService.getCreatorGlobalSettings(user.id),
        autoDubService.getVoiceConsent(user.id)
      ]);

      setSettings(globalSettings || {
        id: '',
        creator_id: user.id,
        auto_subtitles_enabled: true,
        auto_dub_enabled: false,
        max_auto_languages: 2,
        voice_default_type: 'standard',
        lip_sync_enabled: false,
        preferred_languages: ['en', 'fr'],
        auto_publish_global: false,
        global_mode_active: false
      });

      setVoiceConsent(consent);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !settings) return;

    try {
      setSaving(true);
      await autoDubService.upsertGlobalSettings({
        ...settings,
        creator_id: user.id
      });
      setMessage({ type: 'success', text: 'Settings saved successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLanguage = (code: string) => {
    if (!settings) return;

    const languages = settings.preferred_languages.includes(code)
      ? settings.preferred_languages.filter(l => l !== code)
      : [...settings.preferred_languages, code];

    setSettings({ ...settings, preferred_languages: languages });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => onNavigate?.('studio')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Studio
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Global Mode</h1>
            <p className="text-gray-400">Expand your reach to a global audience</p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Global Mode Status</h2>
                <p className="text-sm text-gray-400">
                  Automatically translate and dub your videos
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, global_mode_active: !settings.global_mode_active })
                }
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  settings.global_mode_active
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {settings.global_mode_active ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {settings.global_mode_active && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">
                  Global Mode is active. New videos will automatically be processed for translation
                  and dubbing.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Automatic Features</h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Auto-generate Subtitles</div>
                  <div className="text-sm text-gray-400">
                    Automatically create subtitles for all videos
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auto_subtitles_enabled}
                  onChange={(e) =>
                    setSettings({ ...settings, auto_subtitles_enabled: e.target.checked })
                  }
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Auto-generate Dubs</div>
                  <div className="text-sm text-gray-400">
                    Automatically create audio dubs in multiple languages
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auto_dub_enabled}
                  onChange={(e) => setSettings({ ...settings, auto_dub_enabled: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Auto-publish Global</div>
                  <div className="text-sm text-gray-400">
                    Automatically publish dubbed versions to all regions
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auto_publish_global}
                  onChange={(e) =>
                    setSettings({ ...settings, auto_publish_global: e.target.checked })
                  }
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Voice Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Voice Type
                </label>
                <select
                  value={settings.voice_default_type}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      voice_default_type: e.target.value as 'standard' | 'premium' | 'clone'
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="standard">Standard AI Voice</option>
                  <option value="premium">Premium AI Voice</option>
                  <option value="clone" disabled={!voiceConsent?.consent_given}>
                    Voice Clone {!voiceConsent?.consent_given && '(Requires consent)'}
                  </option>
                </select>
              </div>

              <label className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Lip Sync (Premium)
                  </div>
                  <div className="text-sm text-gray-400">
                    Synchronize lip movements with dubbed audio
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.lip_sync_enabled}
                  onChange={(e) => setSettings({ ...settings, lip_sync_enabled: e.target.checked })}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Target Languages</h2>
            <p className="text-sm text-gray-400 mb-4">
              Select up to {settings.max_auto_languages} languages for automatic dubbing
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleToggleLanguage(lang.code)}
                  disabled={
                    !settings.preferred_languages.includes(lang.code) &&
                    settings.preferred_languages.length >= settings.max_auto_languages
                  }
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    settings.preferred_languages.includes(lang.code)
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-400">
              {settings.preferred_languages.length} of {settings.max_auto_languages} languages
              selected
            </div>
          </div>

          {!voiceConsent?.consent_given && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-bold mb-2">Voice Cloning Available</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Create a digital clone of your voice for more authentic multilingual content.
                    This requires your explicit consent and voice samples.
                  </p>
                  <button
                    onClick={() => onNavigate?.('voice-consent')}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Set Up Voice Clone
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-4">
            <button
              onClick={() => onNavigate?.('studio')}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
