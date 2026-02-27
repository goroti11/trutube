import React, { useEffect, useState } from 'react';
import { TrendingUp, Trophy, Medal, Award } from 'lucide-react';
import { gamingService, type LeaderboardEntry, type Game, type GamingSeason } from '../../services/gamingService';

export default function LeaderboardsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [currentSeason, setCurrentSeason] = useState<GamingSeason | null>(null);
  const [selectedGame, setSelectedGame] = useState('');
  const [category, setCategory] = useState<'solo' | 'team' | 'trucoin_earnings' | 'performance_score'>('solo');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentSeason && selectedGame) {
      loadLeaderboard();
    }
  }, [currentSeason, selectedGame, category]);

  const loadInitialData = async () => {
    try {
      const [gamesData, seasonData] = await Promise.all([
        gamingService.getActiveGames(),
        gamingService.getCurrentSeason()
      ]);

      setGames(gamesData.filter(g => g.supports_leaderboards));
      setCurrentSeason(seasonData);
      if (gamesData.length > 0) {
        setSelectedGame(gamesData[0].id);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    if (!currentSeason || !selectedGame) return;

    setLoading(true);
    try {
      const data = await gamingService.getLeaderboard(
        currentSeason.id,
        selectedGame,
        category,
        50
      );
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent flex items-center">
            <TrendingUp className="w-10 h-10 text-orange-400 mr-3" />
            Leaderboards
          </h1>
          <p className="text-gray-300">Top players and teams of the season</p>
        </div>

        {currentSeason && (
          <div className="mb-6 bg-gradient-to-r from-purple-600/20 to-orange-600/20 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-sm text-gray-400">Current Season</p>
            <h2 className="text-xl font-bold">{currentSeason.name}</h2>
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Game</label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {games.map((game) => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            {(['solo', 'team', 'trucoin_earnings', 'performance_score'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg capitalize text-sm transition-all ${
                  category === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Player/Team</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Score</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">W/L</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">TruCoins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {leaderboard.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-12">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={entry.profiles?.avatar_url || entry.gaming_teams?.logo_url || '/default-avatar.png'}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold">
                              {entry.profiles?.username || entry.gaming_teams?.name || 'Unknown'}
                            </p>
                            {entry.gaming_teams && (
                              <p className="text-xs text-gray-500">{entry.gaming_teams.tag}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-purple-400">
                        {entry.score.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-green-400">{entry.wins}</span>
                        <span className="text-gray-500"> / </span>
                        <span className="text-red-400">{entry.losses}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-yellow-400">
                        {entry.trucoins_earned.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leaderboard.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No leaderboard data available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
