import { useEffect, useState } from 'react';
import {
  Plus, Settings, Globe, Lock, Users, Video, Eye,
  ChevronRight, Shield, AlertCircle, CheckCircle,
  MoreVertical, Trash2, Edit2, Star, ArrowLeft, Zap
} from 'lucide-react';
import { channelService, CreatorChannel, LegalProfile } from '../services/channelService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface Props {
  onNavigate: (page: string) => void;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function MyChannelsPage({ onNavigate }: Props) {
  const { user } = useAuth();
  const [channels, setChannels] = useState<CreatorChannel[]>([]);
  const [legalProfile, setLegalProfile] = useState<LegalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [newChannel, setNewChannel] = useState({
    channel_name: '',
    channel_slug: '',
    description: '',
    channel_category: '',
    visibility: 'public' as 'public' | 'private',
  });
  const [slugManual, setSlugManual] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);

  useEffect(() => {
    if (!user) {
      onNavigate('auth');
      return;
    }
    load();
  }, [user]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [channelData, legalData] = await Promise.all([
      channelService.getMyChannels(user.id),
      channelService.getLegalProfile(user.id),
    ]);
    setChannels(channelData);
    setLegalProfile(legalData);
    setLoading(false);
  };

  const handleNameChange = (name: string) => {
    setNewChannel(c => ({ ...c, channel_name: name }));
    if (!slugManual) {
      const slug = channelService.generateSlug(name);
      setNewChannel(c => ({ ...c, channel_slug: slug }));
      checkSlug(slug);
    }
  };

  const handleSlugChange = (slug: string) => {
    const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-');
    setSlugManual(true);
    setNewChannel(c => ({ ...c, channel_slug: clean }));
    checkSlug(clean);
  };

  const checkSlug = async (slug: string) => {
    if (!slug || slug.length < 3) { setSlugAvailable(null); return; }
    setSlugChecking(true);
    const available = await channelService.isSlugAvailable(slug);
    setSlugAvailable(available);
    setSlugChecking(false);
  };

  const handleCreate = async () => {
    if (!user || !newChannel.channel_name || !newChannel.channel_slug || !slugAvailable) return;
    setCreating(true);
    const created = await channelService.createChannel(user.id, newChannel);
    if (created) {
      setChannels(prev => [...prev, created]);
      setShowCreate(false);
      setNewChannel({ channel_name: '', channel_slug: '', description: '', channel_category: '', visibility: 'public' });
      setSlugManual(false);
      setSlugAvailable(null);
    }
    setCreating(false);
  };

  const handleDelete = async (channelId: string) => {
    const confirmed = window.confirm('Supprimer cette chaîne ? Cette action est irréversible.');
    if (!confirmed) return;
    const ok = await channelService.deleteChannel(channelId);
    if (ok) setChannels(prev => prev.filter(c => c.id !== channelId));
    setOpenMenuId(null);
  };

  const kycVerified = legalProfile?.kyc_status === 'verified';

  const CATEGORIES = [
    'Musique', 'Hip-Hop / Rap', 'R&B / Soul', 'Électronique', 'Jazz / Blues',
    'Pop', 'Rock', 'Classique', 'Vidéo / Film', 'Podcast', 'Gaming', 'Art', 'Autre'
  ];

  if (loading) {
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

      <main className="max-w-5xl mx-auto px-4 py-8 mt-16">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('settings')} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Mes Chaînes</h1>
              <p className="text-sm text-gray-400">{channels.length} chaîne{channels.length !== 1 ? 's' : ''} créée{channels.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Nouvelle chaîne
          </button>
        </div>

        {!kycVerified && (
          <div className="bg-amber-900/20 border border-amber-800 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-300 font-medium">Profil légal requis pour activer les paiements</p>
              <p className="text-xs text-gray-400 mt-0.5">Vos chaînes sont actives mais les revenus seront bloqués jusqu'à vérification KYC.</p>
            </div>
            <button
              onClick={() => onNavigate('legal-profile')}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap"
            >
              Compléter <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Profil Légal</p>
                <p className="text-xs text-gray-500">Identité juridique privée — wallet & revenus</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {legalProfile ? (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  kycVerified ? 'bg-green-900/40 text-green-400' :
                  legalProfile.kyc_status === 'pending' ? 'bg-amber-900/40 text-amber-400' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {channelService.getKycLabel(legalProfile.kyc_status)}
                </span>
              ) : (
                <span className="text-xs bg-gray-800 text-gray-500 px-2.5 py-1 rounded-full">Non configuré</span>
              )}
              <button
                onClick={() => onNavigate('legal-profile')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {channels.length === 0 && !showCreate ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-gray-700" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Aucune chaîne créée</h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
              Créez votre première identité artistique. Vous pouvez avoir plusieurs chaînes avec des univers différents.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Créer ma première chaîne
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {channels.map(channel => (
              <div key={channel.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4 p-4">
                  <div className="relative flex-shrink-0">
                    {channel.avatar_url ? (
                      <img src={channel.avatar_url} alt={channel.channel_name} className="w-14 h-14 rounded-xl object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-800 to-gray-800 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{channel.channel_name[0]?.toUpperCase()}</span>
                      </div>
                    )}
                    {channel.is_primary && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <Star className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-white truncate">{channel.channel_name}</p>
                      {channel.is_verified && <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        channel.visibility === 'public'
                          ? 'bg-green-900/40 text-green-400'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {channel.visibility === 'public' ? <><Globe className="w-2.5 h-2.5 inline mr-1" />Publique</> : <><Lock className="w-2.5 h-2.5 inline mr-1" />Privée</>}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">@{channel.channel_slug}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {formatCount(channel.subscriber_count)}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Video className="w-3 h-3" /> {channel.video_count} vidéos
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {formatCount(channel.total_views)} vues
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 relative">
                    <button
                      onClick={() => onNavigate(`channel-edit/${channel.id}`)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === channel.id ? null : channel.id)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenuId === channel.id && (
                      <div className="absolute right-0 top-10 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-10 min-w-[160px]">
                        <button
                          onClick={() => { setOpenMenuId(null); onNavigate(`channel-edit/${channel.id}`); }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-t-xl"
                        >
                          <Settings className="w-4 h-4" /> Paramètres
                        </button>
                        <button
                          onClick={() => handleDelete(channel.id)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 transition-colors rounded-b-xl"
                        >
                          <Trash2 className="w-4 h-4" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {channel.monetization_enabled && (
                  <div className="px-4 pb-3">
                    <div className="bg-green-900/20 border border-green-800/50 rounded-xl px-3 py-2 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-green-400">Monétisation active</span>
                      {channel.monetization_tier && <span className="text-xs text-gray-500">— tier {channel.monetization_tier}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showCreate && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6">
              <h2 className="text-lg font-bold text-white mb-5">Créer une nouvelle chaîne</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Nom de la chaîne *</label>
                  <input
                    value={newChannel.channel_name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="Ex: DJ Kalim Officiel"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">Handle (@)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 text-sm">@</span>
                    <input
                      value={newChannel.channel_slug}
                      onChange={e => handleSlugChange(e.target.value)}
                      placeholder="nom-de-chaine"
                      className={`w-full bg-gray-800 border rounded-xl pl-8 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                        slugAvailable === true ? 'border-green-600' :
                        slugAvailable === false ? 'border-red-500' :
                        'border-gray-700 focus:border-red-500'
                      }`}
                    />
                    <div className="absolute right-3 top-3">
                      {slugChecking && <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />}
                      {!slugChecking && slugAvailable === true && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {!slugChecking && slugAvailable === false && <AlertCircle className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>
                  {slugAvailable === false && <p className="text-xs text-red-400 mt-1">Ce handle est déjà pris.</p>}
                  {slugAvailable === true && <p className="text-xs text-green-400 mt-1">Handle disponible !</p>}
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">Catégorie</label>
                  <select
                    value={newChannel.channel_category}
                    onChange={e => setNewChannel(c => ({ ...c, channel_category: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">Choisir une catégorie</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">Description</label>
                  <textarea
                    value={newChannel.description}
                    onChange={e => setNewChannel(c => ({ ...c, description: e.target.value }))}
                    placeholder="Décrivez votre chaîne..."
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">Visibilité</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'public', label: 'Publique', desc: 'Visible par tous', icon: <Globe className="w-4 h-4" /> },
                      { value: 'private', label: 'Privée', desc: 'Accès par lien uniquement', icon: <Lock className="w-4 h-4" /> },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setNewChannel(c => ({ ...c, visibility: opt.value as 'public' | 'private' }))}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          newChannel.visibility === opt.value
                            ? 'border-red-500 bg-red-600/10'
                            : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                        }`}
                      >
                        <div className={`mt-0.5 ${newChannel.visibility === opt.value ? 'text-red-400' : 'text-gray-500'}`}>{opt.icon}</div>
                        <div>
                          <p className="text-sm font-medium text-white">{opt.label}</p>
                          <p className="text-xs text-gray-500">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl py-3 text-sm font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !newChannel.channel_name || !newChannel.channel_slug || slugAvailable !== true}
                  className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
                >
                  {creating ? 'Création...' : 'Créer la chaîne'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
