import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Trophy, Users, Zap, TrendingUp, Calendar, DollarSign, Play, Crown, Filter, Target } from 'lucide-react';
import { gamingService, type Game, type GamingSeason, type GamingTournament } from '../../services/gamingService';
import { liveGamingService, type GamingCategory } from '../../services/liveGamingService';
import { useLanguage } from '../../contexts/LanguageContext';

export default function GamingHubPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<GamingCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentSeason, setCurrentSeason] = useState<GamingSeason | null>(null);
  const [tournaments, setTournaments] = useState<GamingTournament[]>([]);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const [gamesData, categoriesData, seasonData, tournamentsData, liveData] = await Promise.all([
        selectedCategory === 'all'
          ? gamingService.getActiveGames()
          : liveGamingService.getGamesByCategory(selectedCategory, 20),
        liveGamingService.getGamingCategories(),
        gamingService.getCurrentSeason(),
        gamingService.getTournaments('registration'),
        liveGamingService.getActiveGamingSessions()
      ]);

      setGames(gamesData);
      setCategories(categoriesData);
      setCurrentSeason(seasonData);
      setTournaments(tournamentsData.slice(0, 6));
      setLiveSessions(liveData.slice(0, 12));
    } catch (error) {
      console.error('Failed to load gaming hub data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 mb-4 shadow-lg shadow-cyan-500/50">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Goroti Gaming
          </h1>
          <p className="text-xl text-gray-300">
            Compete. Stream. Win.
          </p>
        </div>

        {currentSeason && (
          <div className="mb-8 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-cyan-400 uppercase tracking-wide">Current Season</span>
                </div>
                <h2 className="text-2xl font-bold">{currentSeason.name}</h2>
                <p className="text-gray-300">Season {currentSeason.season_number}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2 mb-1">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">
                    {currentSeason.prize_pool.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Total Prize Pool</p>
              </div>
            </div>
          </div>
        )}

        {/* Gaming Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center space-x-2 mb-2">
              <Play className="w-5 h-5 text-red-500" />
              <span className="text-gray-400 text-sm">Live Now</span>
            </div>
            <p className="text-2xl font-bold text-white">{liveSessions.length}</p>
          </div>
          <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-gray-400 text-sm">Viewers</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatNumber(liveSessions.reduce((acc, s) => acc + (s.viewer_count || 0), 0))}
            </p>
          </div>
          <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-400 text-sm">Tournaments</span>
            </div>
            <p className="text-2xl font-bold text-white">{tournaments.length}</p>
          </div>
          <div className="bg-black/40 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center space-x-2 mb-2">
              <Gamepad2 className="w-5 h-5 text-cyan-500" />
              <span className="text-gray-400 text-sm">Games</span>
            </div>
            <p className="text-2xl font-bold text-white">{games.length}</p>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold">Game Categories</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              All Games
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <a
            href="#gaming-tournaments"
            className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border border-purple-500/50 rounded-xl p-6 hover:scale-105 transition-transform backdrop-blur-sm"
          >
            <Trophy className="w-10 h-10 text-yellow-400 mb-3" />
            <h3 className="text-xl font-bold mb-1">Tournaments</h3>
            <p className="text-sm text-gray-300">Compete for prizes</p>
          </a>

          <a
            href="#gaming-studio"
            className="bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 border border-cyan-500/50 rounded-xl p-6 hover:scale-105 transition-transform backdrop-blur-sm"
          >
            <Zap className="w-10 h-10 text-cyan-400 mb-3" />
            <h3 className="text-xl font-bold mb-1">Live Gaming</h3>
            <p className="text-sm text-gray-300">Watch pro streams</p>
          </a>

          <a
            href="#gaming-teams"
            className="bg-gradient-to-br from-pink-600/30 to-pink-800/30 border border-pink-500/50 rounded-xl p-6 hover:scale-105 transition-transform backdrop-blur-sm"
          >
            <Users className="w-10 h-10 text-pink-400 mb-3" />
            <h3 className="text-xl font-bold mb-1">Teams</h3>
            <p className="text-sm text-gray-300">Join or create teams</p>
          </a>

          <a
            href="#gaming-leaderboards"
            className="bg-gradient-to-br from-orange-600/30 to-orange-800/30 border border-orange-500/50 rounded-xl p-6 hover:scale-105 transition-transform backdrop-blur-sm"
          >
            <TrendingUp className="w-10 h-10 text-orange-400 mb-3" />
            <h3 className="text-xl font-bold mb-1">Leaderboards</h3>
            <p className="text-sm text-gray-300">View rankings</p>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
              Open Tournaments
            </h2>
            <div className="space-y-4">
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="block bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors backdrop-blur-sm cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{tournament.name}</h3>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                      Registration Open
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Entry: {tournament.entry_fee} TruCoins</span>
                    <span>Prize: {tournament.prize_pool.toLocaleString()} TruCoins</span>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {tournaments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tournaments currently open
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-cyan-400" />
              Live Gaming Sessions
            </h2>
            <div className="space-y-4">
              {liveSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => navigate(`/gaming/live/${session.id}`)}
                  className="block bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-cyan-500 transition-colors backdrop-blur-sm cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start space-x-3">
                      {session.streamer?.avatar_url ? (
                        <img
                          src={session.streamer.avatar_url}
                          alt={session.streamer.username}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-1">
                          <h3 className="font-bold">{session.streamer?.username}</h3>
                          {session.streamer?.is_verified && <Crown className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <p className="text-sm text-gray-400">{session.game?.name}</p>
                      </div>
                    </div>
                    <span className="flex items-center space-x-1 text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span>LIVE</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="capitalize">{session.mode}</span>
                    {session.is_ranked && (
                      <span className="flex items-center space-x-1 text-yellow-400">
                        <Trophy className="w-4 h-4" />
                        <span>Ranked</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {liveSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No live gaming sessions
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Gamepad2 className="w-6 h-6 mr-2 text-purple-400" />
            Featured Games
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="group bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-all hover:scale-105 backdrop-blur-sm cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center">
                  {game.thumbnail_url ? (
                    <img
                      src={game.thumbnail_url}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Gamepad2 className="w-12 h-12 text-purple-400" />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold mb-1 group-hover:text-purple-400 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs text-gray-500">{game.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
