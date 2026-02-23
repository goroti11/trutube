import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gamingService } from '../../../services/gamingService';
import type { GamingSeason, GamingTournament, ArenaFund } from '../../../types/database';

export function GamingHub() {
  const [season, setSeason] = useState<GamingSeason | null>(null);
  const [tournaments, setTournaments] = useState<GamingTournament[]>([]);
  const [arenaFund, setArenaFund] = useState<ArenaFund | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [seasonData, tournamentsData, fundData] = await Promise.all([
        gamingService.getCurrentSeason(),
        gamingService.getTournaments(),
        gamingService.getArenaFund(),
      ]);
      setSeason(seasonData);
      setTournaments(tournamentsData.slice(0, 3));
      setArenaFund(fundData);
    } catch (error) {
      console.error('Failed to load gaming hub data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to GOROTI Gaming
        </h1>
        <p className="text-xl text-gray-300">
          Compete, Win, and Dominate
        </p>
      </div>

      {season && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{season.name}</h2>
              <p className="text-blue-100">
                {new Date(season.start_date).toLocaleDateString()} -{' '}
                {new Date(season.end_date).toLocaleDateString()}
              </p>
              <p className="text-2xl font-bold text-yellow-300 mt-4">
                {season.reward_pool_trucoins.toLocaleString()} TruCoins Prize Pool
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-2 bg-green-500 text-white rounded-full font-bold uppercase tracking-wider">
                {season.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {arenaFund && (
        <div className="bg-yellow-500 bg-opacity-10 border-2 border-yellow-500 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-yellow-300 mb-2">Arena Fund</h3>
            <p className="text-4xl font-bold text-white">
              {arenaFund.balance.toLocaleString()} TruCoins
            </p>
            <p className="text-gray-400 mt-2">Community prize pool</p>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Featured Tournaments</h2>
          <Link
            to="/gaming/tournaments"
            className="text-blue-400 hover:underline"
          >
            View all →
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">No tournaments available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                to={`/gaming/tournaments/${tournament.id}`}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-blue-500"
              >
                <h3 className="text-xl font-bold text-white mb-2">{tournament.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Entry Fee:</span>
                    <span className="text-blue-400 font-semibold">
                      {tournament.entry_fee_trucoins} TC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Prize Pool:</span>
                    <span className="text-yellow-400 font-semibold">
                      {tournament.prize_pool_trucoins} TC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400 font-semibold capitalize">
                      {tournament.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-600 to-pink-600 rounded-xl p-8 text-center hover:scale-105 transition-transform cursor-pointer">
          <div className="text-4xl mb-2">🎮</div>
          <h3 className="text-2xl font-bold text-white mb-2">Gaming Live</h3>
          <p className="text-red-100">Watch live gaming streams</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-8 text-center hover:scale-105 transition-transform cursor-pointer">
          <div className="text-4xl mb-2">👥</div>
          <h3 className="text-2xl font-bold text-white mb-2">Teams</h3>
          <p className="text-green-100">Join or create a team</p>
        </div>

        <Link
          to="/gaming/leaderboards"
          className="bg-gradient-to-br from-orange-600 to-yellow-600 rounded-xl p-8 text-center hover:scale-105 transition-transform"
        >
          <div className="text-4xl mb-2">🏆</div>
          <h3 className="text-2xl font-bold text-white mb-2">Leaderboards</h3>
          <p className="text-orange-100">See top players</p>
        </Link>
      </div>
    </div>
  );
}
