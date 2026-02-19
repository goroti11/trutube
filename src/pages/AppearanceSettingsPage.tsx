import { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor, Type, Layout, Sidebar, Eye, Save } from 'lucide-react';
import Header from '../components/Header';
import ImageUploader from '../components/ImageUploader';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  accent_color: string;
  font_size: 'small' | 'medium' | 'large';
  layout: 'default' | 'compact' | 'comfortable';
  sidebar_position: 'left' | 'right';
  show_thumbnails: boolean;
  autoplay_videos: boolean;
}

interface AppearanceSettingsPageProps {
  onNavigate: (page: string) => void;
}

export default function AppearanceSettingsPage({ onNavigate }: AppearanceSettingsPageProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: 'dark',
    accent_color: '#ef4444',
    font_size: 'medium',
    layout: 'default',
    sidebar_position: 'left',
    show_thumbnails: true,
    autoplay_videos: false
  });
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadSettings();
    loadProfile();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_appearance_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          theme: data.theme,
          accent_color: data.accent_color,
          font_size: data.font_size,
          layout: data.layout,
          sidebar_position: data.sidebar_position,
          show_thumbnails: data.show_thumbnails,
          autoplay_videos: data.autoplay_videos
        });
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_appearance_settings')
        .upsert({
          user_id: user.id,
          ...settings
        });

      if (error) throw error;
      alert('Paramètres enregistrés!');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const accentColors = [
    { name: 'Rouge', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Jaune', value: '#eab308' },
    { name: 'Vert', value: '#22c55e' },
    { name: 'Bleu', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Violet', value: '#a855f7' },
    { name: 'Rose', value: '#ec4899' }
  ];

  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="min-h-screen bg-gray-950 text-white pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Apparence</h1>
              <p className="text-gray-400">Personnalisez l'apparence de votre interface</p>
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>

          {/* Photo de profil et bannière */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Palette className="w-6 h-6" />
              Photos de profil
            </h2>

            <div className="space-y-8">
              <ImageUploader
                bucket="avatars"
                currentImageUrl={profile?.avatar_url}
                onUploadComplete={(url) => {
                  setProfile({ ...profile, avatar_url: url });
                }}
                aspectRatio="1/1"
                maxSizeMB={5}
                label="Photo de profil"
                description="Recommandé: 400x400px, JPG ou PNG, max 5MB"
              />

              <ImageUploader
                bucket="banners"
                currentImageUrl={profile?.banner_url}
                onUploadComplete={(url) => {
                  setProfile({ ...profile, banner_url: url });
                }}
                aspectRatio="21/9"
                maxSizeMB={10}
                label="Bannière de profil"
                description="Recommandé: 1920x820px, JPG ou PNG, max 10MB"
              />
            </div>
          </div>

          {/* Thème */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Monitor className="w-6 h-6" />
              Thème
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <ThemeOption
                icon={Sun}
                label="Clair"
                selected={settings.theme === 'light'}
                onClick={() => setSettings({ ...settings, theme: 'light' })}
              />
              <ThemeOption
                icon={Moon}
                label="Sombre"
                selected={settings.theme === 'dark'}
                onClick={() => setSettings({ ...settings, theme: 'dark' })}
              />
              <ThemeOption
                icon={Monitor}
                label="Auto"
                selected={settings.theme === 'auto'}
                onClick={() => setSettings({ ...settings, theme: 'auto' })}
              />
            </div>
          </div>

          {/* Couleur d'accent */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Couleur d'accent</h2>

            <div className="grid grid-cols-4 gap-4">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSettings({ ...settings, accent_color: color.value })}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    settings.accent_color === color.value
                      ? 'border-white scale-110'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div
                    className="w-full h-12 rounded-lg mb-2"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-sm font-medium">{color.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Taille de police */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Type className="w-6 h-6" />
              Taille de police
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <SizeOption
                label="Petit"
                size="small"
                selected={settings.font_size === 'small'}
                onClick={() => setSettings({ ...settings, font_size: 'small' })}
              />
              <SizeOption
                label="Moyen"
                size="medium"
                selected={settings.font_size === 'medium'}
                onClick={() => setSettings({ ...settings, font_size: 'medium' })}
              />
              <SizeOption
                label="Grand"
                size="large"
                selected={settings.font_size === 'large'}
                onClick={() => setSettings({ ...settings, font_size: 'large' })}
              />
            </div>
          </div>

          {/* Layout */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layout className="w-6 h-6" />
              Disposition
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <LayoutOption
                label="Par défaut"
                selected={settings.layout === 'default'}
                onClick={() => setSettings({ ...settings, layout: 'default' })}
              />
              <LayoutOption
                label="Compact"
                selected={settings.layout === 'compact'}
                onClick={() => setSettings({ ...settings, layout: 'compact' })}
              />
              <LayoutOption
                label="Confortable"
                selected={settings.layout === 'comfortable'}
                onClick={() => setSettings({ ...settings, layout: 'comfortable' })}
              />
            </div>
          </div>

          {/* Position sidebar */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sidebar className="w-6 h-6" />
              Position de la barre latérale
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <SidebarOption
                label="Gauche"
                selected={settings.sidebar_position === 'left'}
                onClick={() => setSettings({ ...settings, sidebar_position: 'left' })}
              />
              <SidebarOption
                label="Droite"
                selected={settings.sidebar_position === 'right'}
                onClick={() => setSettings({ ...settings, sidebar_position: 'right' })}
              />
            </div>
          </div>

          {/* Options d'affichage */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Options d'affichage
            </h2>

            <div className="space-y-4">
              <ToggleOption
                label="Afficher les miniatures"
                description="Afficher les aperçus des vidéos"
                checked={settings.show_thumbnails}
                onChange={(checked: boolean) => setSettings({ ...settings, show_thumbnails: checked })}
              />
              <ToggleOption
                label="Lecture automatique"
                description="Lancer automatiquement la vidéo suivante"
                checked={settings.autoplay_videos}
                onChange={(checked: boolean) => setSettings({ ...settings, autoplay_videos: checked })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ThemeOption({ icon: Icon, label, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-lg border-2 transition-all ${
        selected
          ? 'border-red-600 bg-red-600/10'
          : 'border-gray-700 hover:border-gray-600 bg-gray-800'
      }`}
    >
      <Icon className="w-8 h-8 mx-auto mb-2" />
      <p className="font-semibold">{label}</p>
    </button>
  );
}

function SizeOption({ label, size, selected, onClick }: any) {
  const textSize = size === 'small' ? 'text-sm' : size === 'large' ? 'text-xl' : 'text-base';

  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-lg border-2 transition-all ${
        selected
          ? 'border-red-600 bg-red-600/10'
          : 'border-gray-700 hover:border-gray-600 bg-gray-800'
      }`}
    >
      <p className={`${textSize} font-semibold mb-1`}>Aa</p>
      <p className="text-sm text-gray-400">{label}</p>
    </button>
  );
}

function LayoutOption({ label, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-lg border-2 transition-all ${
        selected
          ? 'border-red-600 bg-red-600/10'
          : 'border-gray-700 hover:border-gray-600 bg-gray-800'
      }`}
    >
      <p className="font-semibold">{label}</p>
    </button>
  );
}

function SidebarOption({ label, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-lg border-2 transition-all ${
        selected
          ? 'border-red-600 bg-red-600/10'
          : 'border-gray-700 hover:border-gray-600 bg-gray-800'
      }`}
    >
      <p className="font-semibold">{label}</p>
    </button>
  );
}

function ToggleOption({ label, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-950 rounded-lg">
      <div>
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-red-600' : 'bg-gray-700'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  );
}
