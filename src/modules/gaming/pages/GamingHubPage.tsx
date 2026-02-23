import { useState, useEffect } from 'react';
import { Flame, Users, Coins, Trophy, Play, TrendingUp, Shield, Star } from 'lucide-react';
import { GamingLayout } from '../layouts/GamingLayout';
import { gamingService } from '../services/gamingService';
import type { Game, GamingSeason, GamingLiveSession, GamingTournament } from '../types';

interface GamingHubPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function GamingHubPage({ onNavigate }: GamingHubPageProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [currentSeason, setCurrentSeason] = useState<GamingSeason | null>(null);
  const [activeSessions, setActiveSessions] = useState<GamingLiveSession[]>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<GamingTournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [gamesData, seasonData, sessionsData, tournamentsData] = await Promise.all([
      gamingService.getGames({ is_competitive: true, limit: 12 }),
      gamingService.getCurrentSeason(),
      gamingService.getActiveSessions(),
      gamingService.getTournaments({ status: 'registration', limit: 6 })
    ]);

    setGames(gamesData);
    setCurrentSeason(seasonData);
    setActiveSessions(sessionsData);
    setUpcomingTournaments(tournamentsData);
    setLoading(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getActiveStreamsForGame = (gameId: string) => {
    return activeSessions.filter(s => s.game_id === gameId).length;
  };

  const getTotalViewersForGame = (gameId: string) => {
    return activeSessions
      .filter(s => s.game_id === gameId)
      .reduce((sum, s) => sum + s.viewers_count, 0);
  };

  return (
    <GamingLayout activeTab="gaming-hub" onNavigate={onNavigate}>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Season Banner */}
          {currentSeason && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzI3QjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZ2LTZoNnYtNmg2djZoNnY2aC02djZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
              <div className="relative p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{currentSeason.name}</h2>
                    <p className="text-purple-300 text-sm">Active Competitive Season</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-purple-400 text-sm mb-1">Prize Pool</div>
                    <div className="text-2xl font-bold text-white">
                      {formatNumber(currentSeason.reward_pool)}
                      <span className="text-sm text-purple-300 ml-1">TC</span>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-purple-400 text-sm mb-1">Active Tournaments</div>
                    <div className="text-2xl font-bold text-white">{upcomingTournaments.length}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-purple-400 text-sm mb-1">Live Streams</div>
                    <div className="text-2xl font-bold text-white">{activeSessions.length}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-purple-400 text-sm mb-1">Total Viewers</div>
                    <div className="text-2xl font-bold text-white">
                      {formatNumber(activeSessions.reduce((sum, s) => sum + s.viewers_count, 0))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Competitive Games */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-400" />
                  Competitive Games
                </h2>
                <p className="text-gray-400 text-sm mt-1">Join tournaments and climb the leaderboards</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {games.map((game) => {
                const activeStreams = getActiveStreamsForGame(game.id);
                const totalViewers = getTotalViewersForGame(game.id);

                return (
                  <div
                    key={game.id}
                    onClick={() => onNavigate('game-detail', { gameId: game.id })}
                    className="group bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={game.cover_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400'}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {game.anti_cheat_enabled && (
                        <div className="absolute top-2 right-2 bg-green-600 p-1.5 rounded-full" title="Anti-Cheat Enabled">
                          <Shield className="w-3 h-3" />
                        </div>
                      )}
                      {game.is_premium && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 p-1.5 rounded-full">
                          <Star className="w-3 h-3" />
                        </div>
                      )}
                      {activeStreams > 0 && (
                        <div className="absolute bottom-2 left-2 bg-red-600 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          {activeStreams} LIVE
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-white text-sm mb-1 truncate">{game.name}</h3>
                      <p className="text-xs text-gray-400 mb-2">{game.category}</p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="w-3 h-3" />
                          {formatNumber(totalViewers)}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Coins className="w-3 h-3" />
                          {formatNumber(game.total_trucoins_generated)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Tournaments */}
          {upcomingTournaments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Registration Open
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Join these tournaments now</p>
                </div>
                <button
                  onClick={() => onNavigate('gaming-tournaments')}
                  className="text-purple-400 hover:text-purple-300 text-sm font-semibold"
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingTournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    onClick={() => onNavigate('gaming-tournament-detail', { tournamentId: tournament.id })}
                    className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{tournament.name}</h3>
                        <p className="text-sm text-gray-400">{tournament.game?.name}</p>
                      </div>
                      <div className="bg-purple-600 px-3 py-1 rounded-full text-xs font-bold">
                        {tournament.format.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Prize Pool</span>
                        <span className="text-yellow-400 font-bold flex items-center gap-1">
                          <Coins className="w-4 h-4" />
                          {formatNumber(tournament.prize_pool)} TC
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Entry Fee</span>
                        <span className="text-white font-semibold">{formatNumber(tournament.entry_fee)} TC</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Participants</span>
                        <span className="text-white font-semibold">
                          {tournament.current_participants}/{tournament.max_participants}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(tournament.current_participants / tournament.max_participants) * 100}%`
                        }}
                      ></div>
                    </div>

                    <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-sm">
                      Register Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Gaming Streams */}
          {activeSessions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Flame className="w-6 h-6 text-red-500" />
                    Live Gaming Streams
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Watch competitive gameplay live</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSessions.slice(0, 6).map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onNavigate('watch', { videoId: session.stream_id })}
                    className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all cursor-pointer"
                  >
                    <div className="relative aspect-video bg-gray-800">
                      <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formatNumber(session.viewers_count)}
                      </div>
                      {session.mode === 'tournament' && (
                        <div className="absolute bottom-3 left-3 bg-purple-600 px-3 py-1 rounded-full text-xs font-bold">
                          TOURNAMENT
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-1 truncate">{session.game?.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{session.streamer?.username}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {formatNumber(session.peak_viewers)} peak
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Coins className="w-3 h-3" />
                          {formatNumber(session.trucoins_generated)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </GamingLayout>
  );
}
