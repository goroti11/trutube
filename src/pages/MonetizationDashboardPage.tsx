import { useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Link2,
  ShoppingBag,
  Briefcase,
  Music,
  GraduationCap,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Package,
  Users,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { affiliationService } from '../services/affiliationService';
import { merchandisingService } from '../services/merchandisingService';
import { brandDealsService } from '../services/brandDealsService';
import { musicStreamingService } from '../services/musicStreamingService';
import { digitalProductsService } from '../services/digitalProductsService';

interface MonetizationDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export default function MonetizationDashboardPage({ onNavigate }: MonetizationDashboardPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'affiliation' | 'merchandising' | 'brands' | 'music' | 'digital'>('overview');

  const [affiliationStats, setAffiliationStats] = useState<any>(null);
  const [merchandisingStats, setMerchandisingStats] = useState<any>(null);
  const [brandDealsStats, setBrandDealsStats] = useState<any>(null);
  const [musicStats, setMusicStats] = useState<any>(null);
  const [digitalStats, setDigitalStats] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      loadAllStats();
    }
  }, [user]);

  const loadAllStats = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [affiliation, merchandising, brands, music, digital] = await Promise.all([
        affiliationService.getAffiliateStats(user.id),
        merchandisingService.getMerchandiseStats(user.id),
        brandDealsService.getBrandDealStats(user.id),
        musicStreamingService.getMusicStats(user.id),
        digitalProductsService.getDigitalProductStats(user.id),
      ]);

      setAffiliationStats(affiliation);
      setMerchandisingStats(merchandising);
      setBrandDealsStats(brands);
      setMusicStats(music);
      setDigitalStats(digital);
    } catch (error) {
      console.error('Error loading monetization stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const totalRevenue =
    (affiliationStats?.totalRevenue || 0) +
    (merchandisingStats?.totalRevenue || 0) +
    (brandDealsStats?.totalEarned || 0) +
    (musicStats?.totalRevenue || 0) +
    (digitalStats?.totalRevenue || 0);

  const revenueChannels = [
    {
      id: 'affiliation',
      name: 'Affiliation',
      icon: Link2,
      color: 'bg-blue-500',
      revenue: affiliationStats?.totalRevenue || 0,
      metrics: `${formatNumber(affiliationStats?.totalClicks || 0)} clicks • ${affiliationStats?.conversionRate?.toFixed(2) || 0}% conversion`,
    },
    {
      id: 'merchandising',
      name: 'Merchandising',
      icon: ShoppingBag,
      color: 'bg-green-500',
      revenue: merchandisingStats?.totalRevenue || 0,
      metrics: `${merchandisingStats?.totalOrders || 0} commandes • ${merchandisingStats?.activeProducts || 0} produits`,
    },
    {
      id: 'brands',
      name: 'Brand Deals',
      icon: Briefcase,
      color: 'bg-purple-500',
      revenue: brandDealsStats?.totalEarned || 0,
      metrics: `${brandDealsStats?.activeDeals || 0} deals actifs • ${brandDealsStats?.sponsoredVideos || 0} vidéos`,
    },
    {
      id: 'music',
      name: 'Streaming Musique',
      icon: Music,
      color: 'bg-pink-500',
      revenue: musicStats?.totalRevenue || 0,
      metrics: `${formatNumber(musicStats?.totalStreams || 0)} streams • ${musicStats?.totalTracks || 0} tracks`,
    },
    {
      id: 'digital',
      name: 'Formations & Services',
      icon: GraduationCap,
      color: 'bg-orange-500',
      revenue: digitalStats?.totalRevenue || 0,
      metrics: `${digitalStats?.totalProductSales || 0} ventes • ${digitalStats?.totalServiceBookings || 0} réservations`,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <div className="sticky top-0 z-30 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Monétisation Multi-Canaux</h1>
                <p className="text-sm text-gray-400">Gérez tous vos revenus depuis une seule interface</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-400">Revenus Totaux</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {revenueChannels.map((channel) => {
                const Icon = channel.icon;
                const percentage = totalRevenue > 0 ? (channel.revenue / totalRevenue) * 100 : 0;

                return (
                  <div
                    key={channel.id}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                    onClick={() => setActiveTab(channel.id as any)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${channel.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-500" />
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{channel.name}</h3>
                    <p className="text-2xl font-bold text-white mb-2">{formatCurrency(channel.revenue)}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${channel.color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400">{percentage.toFixed(1)}%</span>
                    </div>
                    <p className="text-sm text-gray-400">{channel.metrics}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Statistiques Globales
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Liens d'affiliation actifs</p>
                  <p className="text-2xl font-bold">{affiliationStats?.topPerformingLinks?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Produits en stock faible</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {merchandisingStats?.lowStockProducts?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Livrables en attente</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {brandDealsStats?.pendingDeliverables || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Cours/Services actifs</p>
                  <p className="text-2xl font-bold">
                    {(digitalStats?.totalProducts || 0) + (digitalStats?.totalServices || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Top Performers - Affiliation
                </h3>
                <div className="space-y-3">
                  {affiliationStats?.topPerformingLinks?.slice(0, 5).map((link: any, idx: number) => (
                    <div key={link.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-400">
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{link.title}</p>
                        <p className="text-sm text-gray-400">
                          {link.total_clicks} clicks • {link.total_conversions} conversions
                        </p>
                      </div>
                      <p className="font-bold text-green-400">{formatCurrency(link.total_revenue)}</p>
                    </div>
                  ))}
                  {(!affiliationStats?.topPerformingLinks || affiliationStats.topPerformingLinks.length === 0) && (
                    <p className="text-center text-gray-400 py-4">Aucun lien d'affiliation pour le moment</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-pink-400" />
                  Top Tracks - Musique
                </h3>
                <div className="space-y-3">
                  {musicStats?.topTracks?.slice(0, 5).map((track: any, idx: number) => (
                    <div key={track.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                      <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center text-sm font-bold text-pink-400">
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-gray-400">
                          {formatNumber(track.total_streams)} streams
                        </p>
                      </div>
                      <p className="font-bold text-green-400">{formatCurrency(track.total_revenue)}</p>
                    </div>
                  ))}
                  {(!musicStats?.topTracks || musicStats.topTracks.length === 0) && (
                    <p className="text-center text-gray-400 py-4">Aucune musique publiée pour le moment</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Diversifiez vos revenus</h2>
              <p className="text-blue-100 mb-6">
                Les créateurs qui utilisent plusieurs canaux de monétisation gagnent en moyenne 3x plus
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => onNavigate('help')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Guide complet
                </button>
                <button
                  onClick={() => onNavigate('support')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors"
                >
                  Contacter le support
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'affiliation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                Ajouter un lien
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <p className="text-sm text-gray-400 mb-1">Total Clicks</p>
                <p className="text-3xl font-bold">{formatNumber(affiliationStats?.totalClicks || 0)}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <p className="text-sm text-gray-400 mb-1">Conversions</p>
                <p className="text-3xl font-bold text-green-400">
                  {formatNumber(affiliationStats?.totalConversions || 0)}
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <p className="text-sm text-gray-400 mb-1">Taux de conversion</p>
                <p className="text-3xl font-bold text-blue-400">
                  {affiliationStats?.conversionRate?.toFixed(2) || 0}%
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <p className="text-sm text-gray-400 mb-1">Revenus</p>
                <p className="text-3xl font-bold text-green-400">
                  {formatCurrency(affiliationStats?.totalRevenue || 0)}
                </p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center py-12">
              <Link2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Gérez vos liens d'affiliation</h3>
              <p className="text-gray-400 mb-6">
                Partagez des produits et gagnez des commissions sur chaque vente
              </p>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                Créer mon premier lien
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
