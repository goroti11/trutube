import { useEffect, useState } from 'react';
import { gamingService } from '../../../services/gamingService';
import type { Game, GamingLeaderboard } from '../../../types/database';

export function Leaderboards() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<GamingLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    if (selectedGame) {
      loadLeaderboard(selectedGame);
    }
  }, [selectedGame]);

  const loadGames = async () => {
    try {
      const data = await gamingService.getGames();
      setGames(data);
      if (data.length > 0) {
        setSelectedGame(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (gameId: string) => {
    try {
      const data = await gamingService.getLeaderboard(gameId);
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const getRankColor = (rank?: number) => {
    if (!rank) return 'text-gray-400';
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-gray-400';
  };

  const getRankMedal = (rank?: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Leaderboards</h1>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedGame === game.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {game.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <h2 className="text-2xl font-bold text-white">Top Players</h2>
        </div>

        <div className="divide-y divide-gray-700">
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400">No leaderboard data available</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className="p-4 hover:bg-gray-750 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-bold ${getRankColor(entry.rank || index + 1)}`}>
                    {getRankMedal(entry.rank || index + 1)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      Player {entry.user_id || entry.team_id}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{entry.score.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
