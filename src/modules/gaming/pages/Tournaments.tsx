import { useEffect, useState } from 'react';
import { gamingService } from '../../../services/gamingService';
import type { GamingTournament } from '../../../types/database';

export function Tournaments() {
  const [tournaments, setTournaments] = useState<GamingTournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const data = await gamingService.getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration_open':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white">Tournaments</h1>

      {tournaments.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg">No tournaments available at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{tournament.name}</h2>
                  {tournament.description && (
                    <p className="text-gray-400 text-sm">{tournament.description}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(
                    tournament.status
                  )}`}
                >
                  {tournament.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Entry Fee</p>
                  <p className="text-blue-400 font-bold text-xl">
                    {tournament.entry_fee_trucoins} TC
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Prize Pool</p>
                  <p className="text-yellow-400 font-bold text-xl">
                    {tournament.prize_pool_trucoins} TC
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Starts: {new Date(tournament.start_date).toLocaleDateString()}
                </span>
                {tournament.max_participants && (
                  <span className="text-gray-400">
                    Max: {tournament.max_participants} players
                  </span>
                )}
              </div>

              {tournament.status === 'registration_open' && (
                <button className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Enter Tournament
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
