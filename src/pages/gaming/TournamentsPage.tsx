import { useEffect, useState } from 'react';
import { Trophy, Calendar, Users, DollarSign } from 'lucide-react';
import { gamingService } from '../../services/gamingService';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'registration' | 'ongoing' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, [filter]);

  const loadTournaments = async () => {
    try {
      const data = await gamingService.getTournaments(filter === 'all' ? undefined : filter);
      setTournaments(data);
    } catch (error) {
      console.error('Failed to load tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registration': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ongoing': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center">
            <Trophy className="w-10 h-10 text-yellow-400 mr-3" />
            Tournaments
          </h1>
          <p className="text-gray-300">Compete in tournaments and win TruCoins</p>
        </div>

        <div className="mb-6 flex space-x-2">
          {(['all', 'registration', 'ongoing', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize transition-all ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all hover:scale-105 backdrop-blur-sm cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-yellow-600/20 flex items-center justify-center">
                  {tournament.games?.thumbnail_url ? (
                    <img
                      src={tournament.games.thumbnail_url}
                      alt={tournament.games.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Trophy className="w-16 h-16 text-yellow-400" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{tournament.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border capitalize ${getStatusColor(tournament.status)}`}>
                      {tournament.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{tournament.games?.name}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Entry Fee
                      </span>
                      <span className="text-white font-semibold">{tournament.entry_fee} TC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center">
                        <Trophy className="w-4 h-4 mr-1" />
                        Prize Pool
                      </span>
                      <span className="text-yellow-400 font-semibold">{tournament.prize_pool.toLocaleString()} TC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Max Players
                      </span>
                      <span className="text-white">{tournament.max_participants}</span>
                    </div>
                    <div className="flex items-center text-gray-500 pt-2 border-t border-gray-700">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(tournament.start_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tournaments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tournaments found
          </div>
        )}
      </div>
    </div>
  );
}
