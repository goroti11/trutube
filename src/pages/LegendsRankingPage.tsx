import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Crown, Star, Zap } from 'lucide-react';
import { legendService } from '../services/legendService';
import { useLanguage } from '../contexts/LanguageContext';

export default function LegendsRankingPage() {
  useLanguage();
  const [globalRankings, setGlobalRankings] = useState<any[]>([]);
  const [legendHolders, setLegendHolders] = useState<any[]>([]);
  const [view, setView] = useState<'global' | 'legends'>('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rankings, holders] = await Promise.all([
        legendService.getGlobalLeaderboard(50),
        legendService.getCurrentLegendHolders()
      ]);

      setGlobalRankings(rankings);
      setLegendHolders(holders);
    } catch (error) {
      console.error('Failed to load legend rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Star className="w-6 h-6 text-orange-600" />;
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-purple-400';
    if (score >= 80) return 'text-cyan-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-purple-600 mb-4 shadow-lg shadow-purple-500/50">
            <Crown className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            TruTube Legends
          </h1>
          <p className="text-xl text-gray-300">
            Hall of Performance - The Greatest Creators
          </p>
        </div>

        <div className="mb-8 flex justify-center space-x-4">
          <button
            onClick={() => setView('global')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'global'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Global Rankings
          </button>
          <button
            onClick={() => setView('legends')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'legends'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Active Legends
          </button>
        </div>

        {view === 'global' && (
          <div>
            <div className="mb-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold">Weekly Global Rankings</h2>
              </div>
              <p className="text-sm text-gray-400">
                Based on Tru Score Weekly - Updated daily
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Creator</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Tru Score Weekly</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Tru Score Global</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Trend</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {globalRankings.map((creator) => (
                      <tr key={creator.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center w-12">
                            {getRankIcon(creator.rank_weekly_global)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={creator.profiles?.avatar_url || '/default-avatar.png'}
                              alt={creator.profiles?.username}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-semibold">{creator.profiles?.username || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">
                                {creator.performance_factors?.engagement || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-2xl font-bold ${getScoreColor(creator.tru_score_weekly)}`}>
                            {creator.tru_score_weekly?.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-lg font-semibold text-gray-400">
                            {creator.tru_score_global?.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-xl ${legendService.getTrendColor(creator.trend)}`}>
                            {legendService.getTrendIcon(creator.trend)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {creator.tru_score_weekly >= 50 && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              legendService.getBadgeLevelColor(
                                creator.tru_score_weekly >= 90 ? 5 :
                                creator.tru_score_weekly >= 80 ? 4 :
                                creator.tru_score_weekly >= 70 ? 3 :
                                creator.tru_score_weekly >= 60 ? 2 : 1
                              )
                            }`}>
                              {legendService.getBadgeLevelName(
                                creator.tru_score_weekly >= 90 ? 5 :
                                creator.tru_score_weekly >= 80 ? 4 :
                                creator.tru_score_weekly >= 70 ? 3 :
                                creator.tru_score_weekly >= 60 ? 2 : 1
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {globalRankings.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No rankings available yet
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'legends' && (
          <div>
            <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold">Current Legend Holders</h2>
              </div>
              <p className="text-sm text-gray-400">
                The elite creators holding Legend status this week
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {legendHolders.map((holder) => (
                <div
                  key={holder.id}
                  className="bg-gradient-to-br from-purple-900/30 to-yellow-900/30 border border-yellow-500/30 rounded-xl p-6 hover:scale-105 transition-transform"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={holder.profiles?.avatar_url || '/default-avatar.png'}
                        alt={holder.profiles?.username}
                        className="w-16 h-16 rounded-full border-2 border-yellow-400"
                      />
                      <div>
                        <h3 className="text-xl font-bold">{holder.profiles?.username}</h3>
                        <p className="text-sm text-gray-400">
                          {holder.holder_type === 'global_legend' ? 'Global Legend' :
                           holder.universes?.name || 'Universe Legend'}
                        </p>
                      </div>
                    </div>
                    <span className="text-4xl">{holder.level === 5 ? '👑' : '💎'}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Level</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        legendService.getBadgeLevelColor(holder.level)
                      }`}>
                        {legendService.getBadgeLevelName(holder.level)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Held For</span>
                      <span className="font-semibold">{holder.weeks_held} week{holder.weeks_held > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Achieved</span>
                      <span className="text-sm">{new Date(holder.achieved_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {legendHolders.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-gray-900/50 border border-gray-800 rounded-xl">
                No active Legend holders this week
              </div>
            )}
          </div>
        )}

        <div className="mt-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-cyan-400" />
            How Legend Status Works
          </h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p>
              <strong className="text-white">Tru Score Weekly:</strong> Performance over the last 7 days based on views, engagement, retention, and authenticity.
            </p>
            <p>
              <strong className="text-white">Tru Score Global:</strong> Long-term reputation based on 90-day performance and consistency.
            </p>
            <p>
              <strong className="text-white">Legend Levels:</strong> Rising (50+), Breakout (60+), Power (70+), Elite (80+), Legend Active (90+)
            </p>
            <p>
              <strong className="text-white">Ranking Updates:</strong> Real-time display, official rankings updated daily, Legend status awarded weekly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
