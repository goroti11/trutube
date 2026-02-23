import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gamingService } from '../../../services/gamingService';
import type { GamingTournament } from '../../../types/database';

export function Tournaments() {
  const [tournaments, setTournaments] = useState<GamingTournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const data = await gamingService.getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTournaments = tournaments.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Tournaments</h1>
        <div className="flex gap-2">
          {['all', 'registration_open', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.map((tournament) => (
          <Link
            key={tournament.id}
            to={`/gaming/tournaments/${tournament.id}`}
            className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all border border-gray-700 hover:border-blue-500 hover:shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded-full font-semibold ${
                  tournament.status === 'registration_open'
                    ? 'bg-green-500 text-white'
                    : tournament.status === 'in_progress'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-200'
                }`}
              >
                {tournament.status.replace('_', ' ')}
              </span>
            </div>

            {tournament.description && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {tournament.description}
              </p>
            )}

            <div className="space-y-2 text-sm border-t border-gray-700 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Entry Fee:</span>
                <span className="text-blue-400 font-semibold">
                  {tournament.entry_fee_trucoins} TC
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Prize Pool:</span>
                <span className="text-yellow-400 font-semibold">
                  {tournament.prize_pool_trucoins.toLocaleString()} TC
                </span>
              </div>
              {tournament.max_participants && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Participants:</span>
                  <span className="text-gray-300 font-semibold">
                    {tournament.max_participants}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Start Date:</span>
                <span className="text-gray-300">
                  {new Date(tournament.start_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg">No tournaments found</p>
        </div>
      )}
    </div>
  );
}
