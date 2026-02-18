import { useState, useEffect } from 'react';
import { Trophy, Heart, Crown, Medal, TrendingUp } from 'lucide-react';
import { creatorSupportService, SupportLeaderboard, CreatorSupport } from '../services/creatorSupportService';

interface SupportLeaderboardSectionProps {
  creatorId: string;
}

export default function SupportLeaderboardSection({ creatorId }: SupportLeaderboardSectionProps) {
  const [leaderboard, setLeaderboard] = useState<SupportLeaderboard[]>([]);
  const [recentSupports, setRecentSupports] = useState<CreatorSupport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'recent'>('leaderboard');

  useEffect(() => {
    loadData();
  }, [creatorId]);

  const loadData = async () => {
    setLoading(true);
    const [leaderboardData, supportsData] = await Promise.all([
      creatorSupportService.getSupportLeaderboard(creatorId, 10),
      creatorSupportService.getCreatorSupports(creatorId, 20)
    ]);

    setLeaderboard(leaderboardData);
    setRecentSupports(supportsData);
    setLoading(false);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-gray-400 font-bold">{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 1:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-400/30';
      case 2:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30';
      default:
        return 'bg-gray-800 border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="border-b border-gray-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'border-primary-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Top Supporters
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'recent'
                ? 'border-primary-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Récents
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'leaderboard' ? (
          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun supporter pour le moment</p>
                <p className="text-sm mt-1">Soyez le premier à soutenir ce créateur</p>
              </div>
            ) : (
              leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${getRankColor(index)} transition-all hover:scale-[1.02]`}
                >
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {getRankIcon(index)}
                  </div>

                  <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                    {entry.supporter?.avatar_url ? (
                      <img
                        src={entry.supporter.avatar_url}
                        alt={entry.supporter.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {entry.supporter?.display_name?.[0] || '?'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {entry.supporter?.display_name || 'Supporter'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {entry.support_count} {entry.support_count === 1 ? 'soutien' : 'soutiens'}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-primary-400">
                      {creatorSupportService.formatAmount(entry.total_amount)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {recentSupports.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun soutien récent</p>
              </div>
            ) : (
              recentSupports.map((support) => (
                <div
                  key={support.id}
                  className="flex items-start gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                    {support.supporter?.avatar_url ? (
                      <img
                        src={support.supporter.avatar_url}
                        alt={support.supporter.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {support.supporter?.display_name?.[0] || '?'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">
                        {support.supporter?.display_name || 'Supporter anonyme'}
                      </p>
                      <span className="text-sm font-bold text-primary-400">
                        {creatorSupportService.formatAmount(support.amount)}
                      </span>
                    </div>

                    {support.message && (
                      <p className="text-sm text-gray-300 mb-2">
                        "{support.message}"
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="capitalize">{support.support_type}</span>
                      <span>•</span>
                      <span>
                        {new Date(support.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
