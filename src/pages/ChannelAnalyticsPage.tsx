import { useEffect, useState } from 'react';
import {
  ArrowLeft, Users, Eye, Video, TrendingUp, Heart,
  MessageSquare, Share2, Clock, DollarSign, BarChart2,
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { channelService, CreatorChannel } from '../services/channelService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface Props {
  channelId: string;
  onNavigate: (page: string) => void;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function StatCard({
  label, value, sub, trend, icon
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs flex items-center gap-0.5 ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

type Period = '7d' | '30d' | '90d' | '1y';

export default function ChannelAnalyticsPage({ channelId, onNavigate }: Props) {
  const { user } = useAuth();
  const [channel, setChannel] = useState<CreatorChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('30d');
  const [activeSection, setActiveSection] = useState<'audience' | 'business' | 'engagement'>('audience');

  useEffect(() => {
    if (!user) { onNavigate('auth'); return; }
    load();
  }, [channelId, user]);

  const load = async () => {
    setLoading(true);
    const ch = await channelService.getChannel(channelId);
    setChannel(ch);
    setLoading(false);
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

  const PERIODS: { value: Period; label: string }[] = [
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '90 jours' },
    { value: '1y', label: '1 an' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 mt-16">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate(`channel-edit/${channelId}`)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">Analytics — {channel.channel_name}</h1>
            <p className="text-sm text-gray-400">@{channel.channel_slug}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
            {['audience', 'business', 'engagement'].map(s => (
              <button
                key={s}
                onClick={() => setActiveSection(s as typeof activeSection)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                  activeSection === s ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {s === 'audience' ? 'Audience' : s === 'business' ? 'Business' : 'Engagement'}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  period === p.value ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {activeSection === 'audience' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label="Abonnés" value={formatCount(channel.subscriber_count)} sub="total" trend="up" icon={<Users className="w-4 h-4" />} />
              <StatCard label="Vues totales" value={formatCount(channel.total_views)} sub="cumulées" trend="up" icon={<Eye className="w-4 h-4" />} />
              <StatCard label="Vidéos" value={channel.video_count.toString()} sub="publiées" icon={<Video className="w-4 h-4" />} />
              <StatCard label="Watchtime" value="0h" sub={`sur ${period}`} trend="neutral" icon={<Clock className="w-4 h-4" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Évolution des abonnés</h3>
                <div className="h-40 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Les données seront disponibles après les premières publications</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Sources de trafic</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Recherche Goroti', pct: 0 },
                    { label: 'Recommandations', pct: 0 },
                    { label: 'Liens externes', pct: 0 },
                    { label: 'Abonnements', pct: 0 },
                  ].map(({ label, pct }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-xs text-gray-500">{pct}%</p>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Rétention spectateurs</h3>
              <div className="h-32 flex items-center justify-center">
                <p className="text-xs text-gray-600">Disponible après publication de contenu vidéo</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'business' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label="Revenus bruts" value="0 €" sub={`sur ${period}`} trend="neutral" icon={<DollarSign className="w-4 h-4" />} />
              <StatCard label="Ventes premium" value="0" sub="transactions" icon={<TrendingUp className="w-4 h-4" />} />
              <StatCard label="Tips reçus" value="0 €" sub="total" icon={<Heart className="w-4 h-4" />} />
              <StatCard label="Taux conversion" value="0%" sub="visiteurs → acheteurs" icon={<BarChart2 className="w-4 h-4" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Répartition des revenus</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Contenus premium', color: 'bg-red-600' },
                    { label: 'Abonnements fans', color: 'bg-blue-600' },
                    { label: 'Tips & donations', color: 'bg-green-600' },
                    { label: 'Store / Merch', color: 'bg-amber-600' },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <p className="text-xs text-gray-400 flex-1">{label}</p>
                      <p className="text-xs text-gray-600">0 €</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-600">Activez la monétisation pour voir vos revenus</p>
                  {!channel.monetization_enabled && (
                    <button
                      onClick={() => onNavigate('studio')}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Activer la monétisation →
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Meilleures ventes</h3>
                <div className="text-center py-8">
                  <p className="text-xs text-gray-600">Aucune vente pour l'instant</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'engagement' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label="Likes" value="0" sub={`sur ${period}`} trend="neutral" icon={<Heart className="w-4 h-4" />} />
              <StatCard label="Commentaires" value="0" sub={`sur ${period}`} icon={<MessageSquare className="w-4 h-4" />} />
              <StatCard label="Partages" value="0" sub={`sur ${period}`} icon={<Share2 className="w-4 h-4" />} />
              <StatCard label="Taux engagement" value="0%" sub="moy. par vidéo" icon={<TrendingUp className="w-4 h-4" />} />
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Vidéos les plus engagées</h3>
              <div className="text-center py-10">
                <Video className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Publiez vos premières vidéos pour voir les statistiques d'engagement</p>
                <button
                  onClick={() => onNavigate('upload')}
                  className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Publier une vidéo →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Retour spectateurs</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Spectateurs récurrents</p>
                    <p className="text-xs text-gray-600">0%</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Nouveaux spectateurs</p>
                    <p className="text-xs text-gray-600">0%</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Top commentateurs</h3>
                <div className="text-center py-4">
                  <p className="text-xs text-gray-600">Aucun commentaire pour l'instant</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
