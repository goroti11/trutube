import { useEffect, useState } from 'react';
import { TrendingUp, Trophy, BarChart3, Calendar, Crown } from 'lucide-react';
import { legendService, type CreatorTruScore, type LegendRankingHistory } from '../../services/legendService';
import { useAuth } from '../../contexts/AuthContext';

export default function PerformanceDashboard() {
  const { user } = useAuth();
  const [scores, setScores] = useState<CreatorTruScore[]>([]);
  const [history, setHistory] = useState<LegendRankingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [scoresData, historyData] = await Promise.all([
        legendService.getCreatorAllScores(user.id),
        legendService.getCreatorRankingHistory(user.id, 12)
      ]);

      setScores(scoresData);
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const globalScore = scores.find(s => !s.universe_id);

  if (!user) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
        <p className="text-gray-400">Please sign in to view your performance dashboard</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Trophy className="w-7 h-7 mr-2 text-yellow-400" />
          Your Performance Dashboard
        </h2>

        {globalScore ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Tru Score Weekly</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-4xl font-bold text-purple-400">
                      {globalScore.tru_score_weekly.toFixed(1)}
                    </p>
                    <span className={`text-2xl ${legendService.getTrendColor(globalScore.trend)}`}>
                      {legendService.getTrendIcon(globalScore.trend)}
                    </span>
                  </div>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-400 opacity-50" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Global Rank</span>
                  <span className="font-semibold">
                    {globalScore.rank_weekly_global ? `#${globalScore.rank_weekly_global}` : 'Unranked'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Performance</span>
                  <span className="capitalize">{globalScore.performance_factors?.engagement || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Tru Score Global</p>
                  <p className="text-4xl font-bold text-cyan-400">
                    {globalScore.tru_score_global.toFixed(1)}
                  </p>
                </div>
                <BarChart3 className="w-12 h-12 text-cyan-400 opacity-50" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Growth</span>
                  <span className="capitalize">{globalScore.performance_factors?.growth || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Authenticity</span>
                  <span className="capitalize">{globalScore.performance_factors?.authenticity || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No performance data available yet</p>
            <p className="text-sm mt-2">Create and publish content to start building your Tru Score</p>
          </div>
        )}

        {globalScore && globalScore.tru_score_weekly >= 50 && (
          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="font-bold text-yellow-400">
                  {legendService.getBadgeLevelName(
                    globalScore.tru_score_weekly >= 90 ? 5 :
                    globalScore.tru_score_weekly >= 80 ? 4 :
                    globalScore.tru_score_weekly >= 70 ? 3 :
                    globalScore.tru_score_weekly >= 60 ? 2 : 1
                  )}
                </p>
                <p className="text-sm text-gray-400">Current Legend Level</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {scores.length > 1 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Universe Rankings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scores.filter(s => s.universe_id).map((score) => (
              <div key={score.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Universe Score</span>
                  <span className={`text-lg font-bold ${legendService.getTrendColor(score.trend)}`}>
                    {legendService.getTrendIcon(score.trend)}
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-400 mb-2">
                  {score.tru_score_weekly.toFixed(1)}
                </p>
                <div className="text-xs text-gray-400">
                  <span>Rank: #{score.rank_weekly_universe || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Hall of Performance
        </h3>
        {history.length > 0 ? (
          <div className="space-y-2">
            {history.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-400">#{record.rank_position}</p>
                    <p className="text-xs text-gray-500">Rank</p>
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{record.ranking_type.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(record.period_start).toLocaleDateString()} - {new Date(record.period_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-cyan-400">{record.tru_score.toFixed(1)}</p>
                  {record.badge_level && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      legendService.getBadgeLevelColor(record.badge_level)
                    }`}>
                      {legendService.getBadgeLevelName(record.badge_level)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No historical rankings yet</p>
        )}
      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3">Performance Factors</h3>
        <div className="space-y-2 text-sm text-gray-300">
          {globalScore?.performance_factors && (
            <>
              <div className="flex items-center justify-between">
                <span>Engagement</span>
                <span className="font-semibold capitalize">{globalScore.performance_factors.engagement}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Growth</span>
                <span className="font-semibold capitalize">{globalScore.performance_factors.growth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Authenticity</span>
                <span className="font-semibold capitalize">{globalScore.performance_factors.authenticity}</span>
              </div>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Tru Scores are updated daily based on your content performance, engagement quality, and audience authenticity.
        </p>
      </div>
    </div>
  );
}
