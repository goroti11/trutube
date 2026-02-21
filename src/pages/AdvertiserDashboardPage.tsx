import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  DollarSign,
  Target,
  BarChart3,
  PlayCircle,
  Calendar,
  Settings,
  Plus,
  ExternalLink,
  CheckCircle,
  Clock,
  Pause,
  AlertCircle,
  Download,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'scheduled' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  startDate: string;
  endDate: string;
  targeting: {
    universes: string[];
    demographics: string[];
    interests: string[];
  };
}

export default function AdvertiserDashboardPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    activeCampaigns: 0,
    avgCTR: 0,
    avgCPC: 0
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'scheduled' | 'completed'>('all');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    // Mock data - à remplacer par vraie API
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Campagne Musique Été 2026',
        status: 'active',
        budget: 5000,
        spent: 3240,
        impressions: 450000,
        clicks: 12500,
        conversions: 380,
        ctr: 2.78,
        cpc: 0.26,
        startDate: '2026-02-01',
        endDate: '2026-03-31',
        targeting: {
          universes: ['Musique', 'Divertissement'],
          demographics: ['18-34'],
          interests: ['Hip-Hop', 'R&B', 'Pop']
        }
      },
      {
        id: '2',
        name: 'Lancement Produit Gaming',
        status: 'scheduled',
        budget: 10000,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        targeting: {
          universes: ['Gaming', 'Tech'],
          demographics: ['18-44'],
          interests: ['E-sports', 'Streaming']
        }
      }
    ];

    setCampaigns(mockCampaigns);

    // Calculer stats globales
    const totalSpent = mockCampaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalImpressions = mockCampaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = mockCampaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = mockCampaigns.reduce((sum, c) => sum + c.conversions, 0);
    const activeCampaigns = mockCampaigns.filter(c => c.status === 'active').length;

    setStats({
      totalSpent,
      totalImpressions,
      totalClicks,
      totalConversions,
      activeCampaigns,
      avgCTR: totalClicks > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      avgCPC: totalClicks > 0 ? totalSpent / totalClicks : 0
    });
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'En pause';
      case 'scheduled':
        return 'Planifiée';
      case 'completed':
        return 'Terminée';
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const filteredCampaigns = filter === 'all'
    ? campaigns
    : campaigns.filter(c => c.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Tableau de Bord Publicitaire
            </h1>
            <p className="text-gray-400">
              Gérez vos campagnes et analysez vos performances
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.hash = 'create-ad-campaign'}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Campagne
            </button>
            <button className="p-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-xs text-green-500 font-medium">+12.5%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stats.totalSpent.toFixed(2)} €
            </div>
            <div className="text-sm text-gray-400">Dépenses totales</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-green-500 font-medium">+24.3%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stats.totalImpressions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Impressions</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <MousePointerClick className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xs text-green-500 font-medium">+8.7%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stats.totalClicks.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Clics</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-red-500 font-medium">-2.1%</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stats.avgCTR.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-400">CTR Moyen</div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Performance des 30 derniers jours</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                7j
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
                30j
              </button>
              <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                90j
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <BarChart3 className="w-16 h-16 opacity-50" />
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Mes Campagnes</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    filter === 'all' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    filter === 'active' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Actives
                </button>
                <button
                  onClick={() => setFilter('paused')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    filter === 'paused' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Pausées
                </button>
                <button
                  onClick={() => setFilter('scheduled')}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    filter === 'scheduled' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Planifiées
                </button>
              </div>
              <button className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => window.location.hash = `advertiser-campaign/${campaign.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{campaign.name}</h3>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        {getStatusText(campaign.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(campaign.startDate).toLocaleDateString('fr-FR')} - {new Date(campaign.endDate).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Target className="w-4 h-4" />
                        {campaign.targeting.universes.join(', ')}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Budget utilisé</span>
                    <span className="text-white font-medium">
                      {campaign.spent.toFixed(2)} € / {campaign.budget.toFixed(2)} €
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-orange-600"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {campaign.impressions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Impressions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {campaign.clicks.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Clics</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {campaign.conversions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Conversions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      {campaign.ctr.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-400">CTR</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">
                      {campaign.cpc.toFixed(2)} €
                    </div>
                    <div className="text-xs text-gray-400">CPC</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                Aucune campagne {filter !== 'all' ? getStatusText(filter).toLowerCase() : ''}
              </h3>
              <p className="text-gray-500 mb-6">
                Créez votre première campagne pour commencer à promouvoir votre marque
              </p>
              <button
                onClick={() => window.location.hash = 'create-ad-campaign'}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all font-medium"
              >
                Créer une campagne
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
