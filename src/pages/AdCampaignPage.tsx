import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adCampaignService, AdCampaign, CampaignStats } from '../services/adCampaignService';
import { videoService, VideoWithCreator } from '../services/videoService';
import { Play, Pause, TrendingUp, MousePointerClick, Target, DollarSign, PlusCircle, Edit, Trash2, BarChart3 } from 'lucide-react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

export default function AdCampaignPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [videos, setVideos] = useState<VideoWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [_selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [campaignStats, setCampaignStats] = useState<Record<string, CampaignStats>>({});

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [campaignsData, allVideos] = await Promise.all([
        adCampaignService.getCampaignsByCreator(user.id),
        videoService.getVideos(100)
      ]);

      const videosData = allVideos.filter(v => v.creator_id === user.id);

      setCampaigns(campaignsData);
      setVideos(videosData);

      const stats: Record<string, CampaignStats> = {};
      for (const campaign of campaignsData) {
        const campaignStat = await adCampaignService.getCampaignStats(campaign.id);
        if (campaignStat) {
          stats[campaign.id] = campaignStat;
        }
      }
      setCampaignStats(stats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseCampaign = async (campaignId: string) => {
    const success = await adCampaignService.pauseCampaign(campaignId);
    if (success) {
      await loadData();
    }
  };

  const handleResumeCampaign = async (campaignId: string) => {
    const success = await adCampaignService.resumeCampaign(campaignId);
    if (success) {
      await loadData();
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) return;

    const success = await adCampaignService.deleteCampaign(campaignId);
    if (success) {
      await loadData();
    }
  };

  const totalBudgetSpent = campaigns.reduce((sum, c) => sum + c.budget_spent, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.total_impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.total_clicks, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Campagnes Publicitaires</h1>
          <p className="text-gray-300">Promouvez votre contenu auprès d'audiences ciblées</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">${totalBudgetSpent.toFixed(2)}</div>
            <div className="text-gray-300 text-sm">Budget dépensé</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white">{totalImpressions.toLocaleString()}</div>
            <div className="text-gray-300 text-sm">Impressions totales</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <MousePointerClick className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">{totalClicks.toLocaleString()}</div>
            <div className="text-gray-300 text-sm">Clics totaux</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white">{avgCTR.toFixed(2)}%</div>
            <div className="text-gray-300 text-sm">CTR moyen</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Mes Campagnes</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Créer une campagne
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center border border-white/20">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Aucune campagne</h3>
            <p className="text-gray-300 mb-6">Créez votre première campagne publicitaire pour promouvoir votre contenu</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Créer une campagne
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const stats = campaignStats[campaign.id];
              const video = videos.find(v => v.id === campaign.target_video_id);

              return (
                <div key={campaign.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{campaign.campaign_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          campaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          campaign.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                          campaign.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      {video && (
                        <p className="text-gray-300 text-sm">Vidéo: {video.title}</p>
                      )}
                      <p className="text-gray-400 text-sm">
                        Du {new Date(campaign.start_date).toLocaleDateString()}
                        {campaign.end_date && ` au ${new Date(campaign.end_date).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {campaign.status === 'active' && (
                        <button
                          onClick={() => handlePauseCampaign(campaign.id)}
                          className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                          title="Mettre en pause"
                        >
                          <Pause className="w-5 h-5" />
                        </button>
                      )}
                      {campaign.status === 'paused' && (
                        <button
                          onClick={() => handleResumeCampaign(campaign.id)}
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                          title="Reprendre"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Impressions</div>
                        <div className="text-white font-semibold">{stats.impressions.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Clics</div>
                        <div className="text-white font-semibold">{stats.clicks.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">CTR</div>
                        <div className="text-white font-semibold">{(stats.ctr * 100).toFixed(2)}%</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Dépensé</div>
                        <div className="text-white font-semibold">${stats.totalSpent.toFixed(2)}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400 text-xs mb-1">Restant</div>
                        <div className="text-white font-semibold">${stats.remainingBudget.toFixed(2)}</div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 bg-white/5 rounded-lg overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{
                        width: `${(campaign.budget_spent / campaign.budget_total) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Budget utilisé: {((campaign.budget_spent / campaign.budget_total) * 100).toFixed(1)}%</span>
                    <span>${campaign.budget_spent.toFixed(2)} / ${campaign.budget_total.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showCreateModal && (
          <CreateCampaignModal
            videos={videos}
            onClose={() => setShowCreateModal(false)}
            onSuccess={loadData}
            userId={user!.id}
          />
        )}
      </main>

      <Footer onNavigate={() => {}} />
    </div>
  );
}

function CreateCampaignModal({
  videos,
  onClose,
  onSuccess,
  userId
}: {
  videos: VideoWithCreator[];
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}) {
  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_type: 'video_promotion' as const,
    target_video_id: '',
    budget_total: 100,
    daily_budget: 10,
    cost_per_click: 0.50,
    cost_per_impression: 0.01,
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adCampaignService.createCampaign({
        ...formData,
        creator_id: userId,
        status: 'draft'
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Erreur lors de la création de la campagne');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Créer une campagne publicitaire</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Nom de la campagne</label>
            <input
              type="text"
              value={formData.campaign_name}
              onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ma super campagne"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Vidéo à promouvoir</label>
            <select
              value={formData.target_video_id}
              onChange={(e) => setFormData({ ...formData, target_video_id: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une vidéo</option>
              {videos.map((video) => (
                <option key={video.id} value={video.id}>{video.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Budget total ($)</label>
              <input
                type="number"
                min="10"
                step="10"
                value={formData.budget_total}
                onChange={(e) => setFormData({ ...formData, budget_total: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Budget journalier ($)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.daily_budget}
                onChange={(e) => setFormData({ ...formData, daily_budget: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Date de début</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Date de fin (optionnel)</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer la campagne'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}