import { useEffect, useState } from 'react';
import {
  ArrowLeft, Save, CheckCircle, Globe, Lock, Camera, Link,
  Instagram, Twitter, Youtube, Music, AlertCircle, Trash2, Eye,
  Hash, Bell, BellOff, GripVertical, Plus, ListVideo,
  BarChart2, UserPlus, Settings, Zap
} from 'lucide-react';
import {
  channelService, CreatorChannel, ChannelPlaylist, PlaylistType,
  CHANNEL_SECTIONS, COLLABORATOR_ROLES
} from '../services/channelService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface Props {
  channelId: string;
  onNavigate: (page: string) => void;
}

type Tab = 'branding' | 'info' | 'sections' | 'playlists' | 'social' | 'notifications' | 'visibility' | 'monetization' | 'danger';

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

const PLAYLIST_TYPES: { value: PlaylistType; label: string; desc: string }[] = [
  { value: 'standard', label: 'Standard', desc: 'Playlist classique' },
  { value: 'series', label: 'Série', desc: 'Série de vidéos ordonnées' },
  { value: 'album', label: 'Album', desc: 'Album musical' },
  { value: 'course', label: 'Cours', desc: 'Formation ou tutoriels' },
  { value: 'season', label: 'Saison', desc: 'Saison de contenu' },
];

const TABS: { id: Tab; label: string }[] = [
  { id: 'branding', label: 'Branding' },
  { id: 'info', label: 'Informations' },
  { id: 'sections', label: 'Sections' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'social', label: 'Liens sociaux' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'visibility', label: 'Visibilité' },
  { id: 'monetization', label: 'Monétisation' },
  { id: 'danger', label: 'Danger' },
];

export default function ChannelEditPage({ channelId, onNavigate }: Props) {
  const { user } = useAuth();
  const [channel, setChannel] = useState<CreatorChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('branding');

  const [playlists, setPlaylists] = useState<ChannelPlaylist[]>([]);
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ title: '', playlist_type: 'standard' as PlaylistType, visibility: 'public' as 'public' | 'unlisted' | 'private', is_premium_locked: false });
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');

  const [form, setForm] = useState({
    channel_name: '',
    description: '',
    channel_category: '',
    channel_language: 'fr',
    avatar_url: '',
    banner_url: '',
    intro_video_url: '',
    trailer_visitors_url: '',
    trailer_subscribers_url: '',
    contact_email: '',
    display_country: '',
    website_url: '',
    visibility: 'public' as 'public' | 'private',
    social_links: {} as Record<string, string>,
    official_hashtags: [] as string[],
    page_sections_order: [] as string[],
    notification_settings: {
      video_release: true,
      album_release: true,
      live_start: true,
      merch_promo: false,
      preorder: false,
    },
  });

  useEffect(() => {
    if (!user) { onNavigate('auth'); return; }
    loadChannel();
  }, [channelId, user]);

  const loadChannel = async () => {
    setLoading(true);
    const [data, pls] = await Promise.all([
      channelService.getChannel(channelId),
      channelService.getPlaylists(channelId),
    ]);
    if (data) {
      setChannel(data);
      setForm({
        channel_name: data.channel_name || '',
        description: data.description || '',
        channel_category: data.channel_category || '',
        channel_language: data.channel_language || 'fr',
        avatar_url: data.avatar_url || '',
        banner_url: data.banner_url || '',
        intro_video_url: data.intro_video_url || '',
        trailer_visitors_url: data.trailer_visitors_url || '',
        trailer_subscribers_url: data.trailer_subscribers_url || '',
        contact_email: data.contact_email || '',
        display_country: data.display_country || '',
        website_url: data.website_url || '',
        visibility: data.visibility === 'unlisted' ? 'public' : (data.visibility || 'public'),
        social_links: data.social_links || {},
        official_hashtags: data.official_hashtags || [],
        page_sections_order: data.page_sections_order?.length
          ? data.page_sections_order
          : CHANNEL_SECTIONS.map(s => s.id),
        notification_settings: data.notification_settings || {
          video_release: true, album_release: true, live_start: true, merch_promo: false, preorder: false,
        },
      });
    }
    setPlaylists(pls);
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
    setForm(f => ({ ...f, social_links: { ...f.social_links, [platform]: url } }));
  };

  const removeSocialLink = (platform: string) => {
    setForm(f => {
      const links = { ...f.social_links };
      delete links[platform];
      return { ...f, social_links: links };
    });
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, '').toLowerCase();
    if (!tag || form.official_hashtags.includes(tag)) { setHashtagInput(''); return; }
    setForm(f => ({ ...f, official_hashtags: [...f.official_hashtags, tag] }));
    setHashtagInput('');
  };

  const removeHashtag = (tag: string) => {
    setForm(f => ({ ...f, official_hashtags: f.official_hashtags.filter(h => h !== tag) }));
  };

  const moveSectionUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...form.page_sections_order];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    setForm(f => ({ ...f, page_sections_order: arr }));
  };

  const moveSectionDown = (idx: number) => {
    if (idx === form.page_sections_order.length - 1) return;
    const arr = [...form.page_sections_order];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    setForm(f => ({ ...f, page_sections_order: arr }));
  };

  const toggleNotif = (key: keyof typeof form.notification_settings) => {
    setForm(f => ({
      ...f,
      notification_settings: { ...f.notification_settings, [key]: !f.notification_settings[key] },
    }));
  };

  const handleCreatePlaylist = async () => {
    if (!user || !newPlaylist.title) return;
    setCreatingPlaylist(true);
    const pl = await channelService.createPlaylist(channelId, user.id, newPlaylist);
    if (pl) {
      setPlaylists(prev => [pl, ...prev]);
      setShowNewPlaylist(false);
      setNewPlaylist({ title: '', playlist_type: 'standard', visibility: 'public', is_premium_locked: false });
    }
    setCreatingPlaylist(false);
  };

  const handleDeletePlaylist = async (id: string) => {
    if (!window.confirm('Supprimer cette playlist ?')) return;
    await channelService.deletePlaylist(id);
    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

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

  const getSectionLabel = (id: string) => CHANNEL_SECTIONS.find(s => s.id === id)?.label ?? id;

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
            <p className="text-sm text-gray-400">@{channel.channel_slug} — {channelService.getChannelTypeLabel(channel.channel_type)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate(`channel-team/${channel.id}`)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <UserPlus className="w-4 h-4" /> Équipe
            </button>
            <button
              onClick={() => onNavigate(`channel-analytics/${channel.id}`)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <BarChart2 className="w-4 h-4" /> Stats
            </button>
            <button
              onClick={() => onNavigate(`profile/${channel.channel_slug}`)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <Eye className="w-4 h-4" /> Voir
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 overflow-x-auto scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
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

              <div className="border-t border-gray-800 pt-5">
                <h3 className="text-sm font-medium text-white mb-4">Vidéos de présentation</h3>
                <div className="space-y-3">
                  {[
                    { key: 'intro_video_url', label: 'Intro vidéo', desc: 'Jouée au début de chaque visite' },
                    { key: 'trailer_visitors_url', label: 'Trailer visiteurs', desc: 'Pour les non-abonnés' },
                    { key: 'trailer_subscribers_url', label: 'Trailer abonnés', desc: 'Pour les abonnés' },
                  ].map(({ key, label, desc }) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-400 mb-1.5">{label} <span className="text-gray-600">— {desc}</span></label>
                      <input
                        value={(form as Record<string, string>)[key] || ''}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder="URL de la vidéo (https://...)"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  ))}
                </div>
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
                  <label className="block text-xs text-gray-400 mb-2">Langue principale</label>
                  <select
                    value={form.channel_language}
                    onChange={e => setForm(f => ({ ...f, channel_language: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="es">Espagnol</option>
                    <option value="ar">Arabe</option>
                    <option value="pt">Portugais</option>
                    <option value="de">Allemand</option>
                    <option value="it">Italien</option>
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
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Email professionnel (optionnel)</label>
                  <input
                    value={form.contact_email}
                    onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
                    placeholder="booking@artiste.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Hashtags officiels</label>
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-3 text-gray-500">#</span>
                    <input
                      value={hashtagInput}
                      onChange={e => setHashtagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addHashtag()}
                      placeholder="monhashtag"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-7 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    onClick={addHashtag}
                    className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.official_hashtags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-gray-800 border border-gray-700 px-3 py-1 rounded-full text-xs text-gray-300">
                      #{tag}
                      <button onClick={() => removeHashtag(tag)} className="text-gray-500 hover:text-red-400 transition-colors ml-1">&times;</button>
                    </span>
                  ))}
                  {form.official_hashtags.length === 0 && (
                    <p className="text-xs text-gray-600">Aucun hashtag officiel</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-white">Organisation de la page</h2>
                  <p className="text-xs text-gray-400 mt-1">Réorganisez l'ordre des sections sur votre page publique.</p>
                </div>
              </div>

              <div className="space-y-2">
                {form.page_sections_order.map((sectionId, idx) => {
                  const section = CHANNEL_SECTIONS.find(s => s.id === sectionId);
                  return (
                    <div key={sectionId} className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                      <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{section?.label ?? sectionId}</p>
                        <p className="text-xs text-gray-500">{section?.desc}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveSectionUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-500 hover:text-white disabled:opacity-30 transition-colors text-xs font-bold"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveSectionDown(idx)}
                          disabled={idx === form.page_sections_order.length - 1}
                          className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-500 hover:text-white disabled:opacity-30 transition-colors text-xs font-bold"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">Playlists</h2>
                  <p className="text-xs text-gray-400 mt-1">{playlists.length} playlist{playlists.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => setShowNewPlaylist(true)}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" /> Créer
                </button>
              </div>

              {showNewPlaylist && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-white">Nouvelle playlist</h3>
                  <input
                    value={newPlaylist.title}
                    onChange={e => setNewPlaylist(p => ({ ...p, title: e.target.value }))}
                    placeholder="Titre de la playlist"
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Type</label>
                      <select
                        value={newPlaylist.playlist_type}
                        onChange={e => setNewPlaylist(p => ({ ...p, playlist_type: e.target.value as PlaylistType }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        {PLAYLIST_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Visibilité</label>
                      <select
                        value={newPlaylist.visibility}
                        onChange={e => setNewPlaylist(p => ({ ...p, visibility: e.target.value as 'public' | 'unlisted' | 'private' }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="public">Publique</option>
                        <option value="unlisted">Non répertoriée</option>
                        <option value="private">Privée</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPlaylist.is_premium_locked}
                      onChange={e => setNewPlaylist(p => ({ ...p, is_premium_locked: e.target.checked }))}
                      className="w-4 h-4 rounded accent-red-500"
                    />
                    <span className="text-sm text-gray-300">Réservée aux membres premium</span>
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => setShowNewPlaylist(false)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition-colors">Annuler</button>
                    <button
                      onClick={handleCreatePlaylist}
                      disabled={creatingPlaylist || !newPlaylist.title}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      {creatingPlaylist ? 'Création...' : 'Créer'}
                    </button>
                  </div>
                </div>
              )}

              {playlists.length === 0 && !showNewPlaylist ? (
                <div className="text-center py-8 text-gray-600">
                  <ListVideo className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Aucune playlist</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {playlists.map(pl => (
                    <div key={pl.id} className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{pl.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{PLAYLIST_TYPES.find(t => t.value === pl.playlist_type)?.label}</span>
                          <span className="text-gray-700">·</span>
                          <span className="text-xs text-gray-500">{pl.video_count} vidéos</span>
                          {pl.is_premium_locked && <span className="text-xs text-amber-500">Premium</span>}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        pl.visibility === 'public' ? 'bg-green-900/30 text-green-400' :
                        pl.visibility === 'unlisted' ? 'bg-gray-700 text-gray-400' :
                        'bg-gray-700 text-gray-500'
                      }`}>
                        {pl.visibility === 'public' ? 'Publique' : pl.visibility === 'unlisted' ? 'Non répertoriée' : 'Privée'}
                      </span>
                      <button onClick={() => handleDeletePlaylist(pl.id)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-white mb-2">Liens sociaux</h2>
              <p className="text-xs text-gray-400">Vos présences sur d'autres plateformes, affichées sur votre profil public.</p>

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
                          <button onClick={() => removeSocialLink(platform.key)} className="absolute right-3 top-2.5 text-gray-500 hover:text-red-400 transition-colors">
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

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-white">Notifications abonnés</h2>
                <p className="text-xs text-gray-400 mt-1">Choisissez pour quels événements vos abonnés reçoivent une notification.</p>
              </div>

              <div className="space-y-2">
                {[
                  { key: 'video_release' as const, label: 'Sortie de vidéo', desc: 'Notifier à chaque publication' },
                  { key: 'album_release' as const, label: 'Sortie d\'album', desc: 'Notifier à chaque sortie musicale' },
                  { key: 'live_start' as const, label: 'Début de live', desc: 'Notifier quand un live démarre' },
                  { key: 'merch_promo' as const, label: 'Promo merch', desc: 'Notifier les offres boutique' },
                  { key: 'preorder' as const, label: 'Précommande', desc: 'Notifier les lancements en précommande' },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer hover:border-gray-600 transition-colors"
                    onClick={() => toggleNotif(key)}
                  >
                    <div className="flex items-center gap-3">
                      {form.notification_settings[key] ? (
                        <Bell className="w-4 h-4 text-red-400" />
                      ) : (
                        <BellOff className="w-4 h-4 text-gray-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${form.notification_settings[key] ? 'bg-red-600' : 'bg-gray-700'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.notification_settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                ))}
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
                    desc: 'Visible par tous. Apparaît dans les recherches et recommandations.',
                    icon: <Globe className="w-5 h-5" />,
                    use: 'Lancement officiel, accroître sa visibilité',
                  },
                  {
                    value: 'private',
                    label: 'Chaîne Privée',
                    desc: "Accessible uniquement par lien direct. N'apparaît pas dans les recherches.",
                    icon: <Lock className="w-5 h-5" />,
                    use: 'Avant sortie officielle, label interne, contenu exclusif',
                  },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm(f => ({ ...f, visibility: opt.value as 'public' | 'private' }))}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      form.visibility === opt.value ? 'border-red-500 bg-red-600/10' : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className={`mb-3 ${form.visibility === opt.value ? 'text-red-400' : 'text-gray-400'}`}>{opt.icon}</div>
                    <p className="font-semibold text-white text-sm mb-1">{opt.label}</p>
                    <p className="text-xs text-gray-400 mb-2">{opt.desc}</p>
                    <p className="text-xs text-gray-500 italic">Cas d'usage : {opt.use}</p>
                  </button>
                ))}
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-400">
                  <strong className="text-gray-300">Note :</strong> Même si votre chaîne est privée, votre profil légal reste le responsable juridique de tout le contenu publié. TruTube conserve l'association entre chaîne et titulaire pour assurer la conformité légale.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'monetization' && (
            <div className="space-y-5">
              <div>
                <h2 className="font-semibold text-white">Monétisation</h2>
                <p className="text-xs text-gray-400 mt-1">Activez les canaux de revenus pour cette chaîne.</p>
              </div>

              <div className={`rounded-xl p-4 border ${channel.monetization_enabled ? 'bg-green-900/20 border-green-800' : 'bg-gray-800 border-gray-700'}`}>
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 ${channel.monetization_enabled ? 'text-green-400' : 'text-gray-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Monétisation {channel.monetization_enabled ? 'active' : 'inactive'}</p>
                    {channel.monetization_tier && <p className="text-xs text-gray-400 mt-0.5">Tier : {channel.monetization_tier}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Vente de contenu premium', desc: 'Accès payant à des vidéos ou albums' },
                  { label: 'Abonnement fans', desc: 'Membership mensuel avec avantages' },
                  { label: 'Tips & donations', desc: 'Dons libres des spectateurs' },
                  { label: 'Store / Merch', desc: 'Vente de produits dérivés' },
                  { label: 'Services & coaching', desc: 'Sessions privées, consultations' },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('studio')}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
                    >
                      Configurer
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500">Pour activer la monétisation, rendez-vous dans le Studio Créateur.</p>
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

        {activeTab !== 'danger' && activeTab !== 'playlists' && (
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
