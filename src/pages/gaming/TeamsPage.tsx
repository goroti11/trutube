import React, { useEffect, useState } from 'react';
import { Users, Shield, Plus } from 'lucide-react';
import { gamingService, type GamingTeam } from '../../services/gamingService';
import { useAuth } from '../../contexts/AuthContext';

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<GamingTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const data = await gamingService.getTeams();
      setTeams(data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent flex items-center">
              <Users className="w-10 h-10 text-pink-400 mr-3" />
              Gaming Teams
            </h1>
            <p className="text-gray-300">Join or create competitive teams</p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Team</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all hover:scale-105 backdrop-blur-sm cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      {team.logo_url ? (
                        <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{team.name}</h3>
                      <p className="text-sm text-purple-400">[{team.tag}]</p>
                    </div>
                  </div>
                  {team.verified && (
                    <Shield className="w-5 h-5 text-cyan-400" />
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Record</span>
                    <span>
                      <span className="text-green-400">{team.total_wins}W</span>
                      <span className="text-gray-500"> - </span>
                      <span className="text-red-400">{team.total_losses}L</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">TruCoins Earned</span>
                    <span className="text-yellow-400 font-semibold">
                      {team.trucoins_earned.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && teams.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No teams found
          </div>
        )}
      </div>
    </div>
  );
}
