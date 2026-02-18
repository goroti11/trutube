import { useEffect, useState } from 'react';
import {
  ArrowLeft, Save, CheckCircle, Globe, Lock, Camera, Link,
  Instagram, Twitter, Youtube, Music, AlertCircle, Trash2, Plus, Eye
} from 'lucide-react';
import { channelService, CreatorChannel } from '../services/channelService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface Props {
  channelId: string;
  onNavigate: (page: string) => void;
}

type Tab = 'branding' | 'info' | 'social' | 'visibility' | 'danger';

const SOCIAL_PLATFORMS = [
  { key: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4" />, placeholder: 'https://youtube.com/@chaine' },
  { key: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" />, placeholder: 'https://instagram.com/pseudo' },
  { key: 'twitter', label: 'Twitter / X', icon: <Twitter className="w-4 h-4" />, placeholder: 'https://x.com/pseudo' },
  { key: 'tiktok', label: 'TikTok', icon: <Music className="w-4 h-4" />, placeholder: 'https://tiktok.com/@pseudo' },
  { key: 'spotify', label: 'Spotify', icon: <Music className="w-4 h-4" />, placeholder: 'https://open.spotify.com/artist/...' },
  { key: 'soundcloud', label: 'SoundCloud', icon: <Music className="w-4 h-4" />, placeholder: 'https://soundcloud.com/pseudo' },
  { key: 'website', label: 'Site web', icon: <Globe className="w-4 h-4" />, placeholder: 'https://monsite.com' },
];

const CATEGORIES = [
  'Musique', 'Hip-Hop / Rap', 'R&B / Soul', 'Électronique', 'Jazz / Blues',
  'Pop', 'Rock', 'Classique', 'Vidéo / Film', 'Podcast', 'Gaming', 'Art', 'Autre'
];

export default function ChannelEditPage({ channelId, onNavigate }: Props) {
  const { user } = useAuth();
  const [channel, setChannel] = useState<CreatorChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('branding');

  const [form, setForm] = useState({
    channel_name: '',
    description: '',
    channel_category: '',
    avatar_url: '',
    banner_url: '',
    contact_email: '',
    display_country: '',
    website_url: '',
    visibility: 'public' as 'public' | 'private',
    social_links: {} as Record<string, string>,
  });

  useEffect(() => {
    if (!user) { onNavigate('auth'); return; }
    loadChannel();
  }, [channelId, user]);

  const loadChannel = async () => {
    setLoading(true);
    const data = await channelService.getChannel(channelId);
    if (data) {
      setChannel(data);
      setForm({
        channel_name: data.channel_name || '',
        description: data.description || '',
        channel_category: data.channel_category || '',
        avatar_url: data.avatar_url || '',
        banner_url: data.banner_url || '',
        contact_email: data.contact_email || '',
        display_country: data.display_country || '',
        website_url: data.website_url || '',
        visibility: data.visibility || 'public',
        social_links: data.social_links || {},
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!channel) return;
    setSaving(true);
    const updated = await channelService.updateChannel(channel.id, form);
    if (updated) {
      setChannel(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  const setSocialLink = (platform: string, url: string) => {
    setForm(f => ({
      ...f,
      social_links: { ...f.social_links, [platform]: url },
    }));
  };

  const removeSocialLink = (platform: string) => {
    setForm(f => {
      const links = { ...f.social_links };
      delete links[platform];
      return { ...f, social_links: links };
    });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'branding', label: 'Branding' },
    { id: 'info', label: 'Informations' },
    { id: 'social', label: 'Liens sociaux' },
    { id: 'visibility', label: 'Visibilité' },
    { id: 'danger', label: 'Danger' },
  ];

  if (loading || !channel) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="flex justify-center items-center py-32 mt-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 mt-16">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('my-channels')} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{channel.channel_name}</h1>
            <p className="text-sm text-gray-400">@{channel.channel_slug}</p>
          </div>
          <button
            onClick={() => onNavigate(`profile/${channel.channel_slug}`)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" /> Voir
          </button>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? tab.id === 'danger' ? 'bg-red-900/40 text-red-400' : 'bg-gray-800 text-white'
                  : tab.id === 'danger' ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h2 className="font-semibold text-white">Identité visuelle</h2>

              <div>
                <label className="block text-xs text-gray-400 mb-3">Photo de profil</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                    {form.avatar_url ? (
                      <img src={form.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      value={form.avatar_url}
                      onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))}
                      placeholder="URL de l'image (https://...)"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Format carré recommandé, min 400×400px</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-3">Bannière</label>
                <div className="relative w-full h-28 rounded-xl overflow-hidden bg-gray-800 border border-gray-700 mb-3">
                  {form.banner_url ? (
                    <img src={form.banner_url} alt="banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>
                <input
                  value={form.banner_url}
                  onChange={e => setForm(f => ({ ...f, banner_url: e.target.value }))}
                  placeholder="URL de la bannière (https://...)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
                <p className="text-xs text-gray-500 mt-1.5">Dimensions recommandées : 2560×1440px</p>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-white mb-2">Informations publiques</h2>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Nom de la chaîne *</label>
                <input
                  value={form.channel_name}
                  onChange={e => setForm(f => ({ ...f, channel_name: e.target.value }))}
                  placeholder="Nom artistique ou de marque"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Décrivez votre univers artistique..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Catégorie</label>
                  <select
                    value={form.channel_category}
                    onChange={e => setForm(f => ({ ...f, channel_category: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Choisir...</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Pays affiché (optionnel)</label>
                  <input
                    value={form.display_country}
                    onChange={e => setForm(f => ({ ...f, display_country: e.target.value }))}
                    placeholder="France"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Email de contact professionnel (optionnel)</label>
                <input
                  value={form.contact_email}
                  onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
                  placeholder="booking@monartiste.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
                <p className="text-xs text-gray-500 mt-1">Visible publiquement sur votre profil de chaîne.</p>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-white mb-2">Liens sociaux</h2>
              <p className="text-xs text-gray-400">Ajoutez vos présences sur d'autres plateformes. Ces liens seront affichés sur votre profil public.</p>

              <div className="space-y-3">
                {SOCIAL_PLATFORMS.map(platform => {
                  const value = form.social_links[platform.key] || '';
                  return (
                    <div key={platform.key} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0 text-gray-400">
                        {platform.icon}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          value={value}
                          onChange={e => setSocialLink(platform.key, e.target.value)}
                          placeholder={platform.placeholder}
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                        />
                        {value && (
                          <button
                            onClick={() => removeSocialLink(platform.key)}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'visibility' && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white mb-2">Visibilité de la chaîne</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    value: 'public',
                    label: 'Chaîne Publique',
                    desc: 'Visible par tous les utilisateurs TruTube. Apparaît dans les recherches et recommandations.',
                    icon: <Globe className="w-5 h-5" />,
                    use: 'Lancement officiel, accroître sa visibilité',
                  },
                  {
                    value: 'private',
                    label: 'Chaîne Privée',
                    desc: 'Accessible uniquement par lien direct ou membres invités. N\'apparaît pas dans les recherches.',
                    icon: <Lock className="w-5 h-5" />,
                    use: 'Avant sortie officielle, label interne, contenu exclusif',
                  },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm(f => ({ ...f, visibility: opt.value as 'public' | 'private' }))}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      form.visibility === opt.value
                        ? 'border-red-500 bg-red-600/10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className={`mb-3 ${form.visibility === opt.value ? 'text-red-400' : 'text-gray-400'}`}>
                      {opt.icon}
                    </div>
                    <p className="font-semibold text-white text-sm mb-1">{opt.label}</p>
                    <p className="text-xs text-gray-400 mb-2">{opt.desc}</p>
                    <p className="text-xs text-gray-500 italic">Cas d'usage: {opt.use}</p>
                  </button>
                ))}
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-400">
                  <strong className="text-gray-300">Note :</strong> Même si votre chaîne est privée ou anonyme, votre profil légal reste le responsable juridique de tout le contenu publié. TruTube conserve l'association entre chaîne et titulaire pour assurer la conformité légale.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-red-400 mb-2">Zone de danger</h2>

              <div className="bg-red-900/20 border border-red-800 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-300">Supprimer la chaîne</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Cette action est irréversible. Tous les contenus, abonnés et statistiques liés à cette chaîne seront définitivement supprimés. Les revenus déjà générés resteront sur votre profil légal.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Supprimer définitivement la chaîne "${channel.channel_name}" ? Cette action est irréversible.`)) {
                      channelService.deleteChannel(channel.id).then(() => onNavigate('my-channels'));
                    }
                  }}
                  className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer cette chaîne
                </button>
              </div>
            </div>
          )}

        </div>

        {activeTab !== 'danger' && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              {saved ? <><CheckCircle className="w-4 h-4" /> Sauvegardé</> : saving ? 'Sauvegarde...' : <><Save className="w-4 h-4" /> Sauvegarder</>}
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
