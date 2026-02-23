import { useState, useEffect } from 'react';
import { Gamepad2, Trophy, TrendingUp, Flame, Users, Coins, Play, Star, Filter, Search } from 'lucide-react';
import { gamingService, Game, GameCategory, LiveGameSession } from '../services/gamingService';

interface GamingHubPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function GamingHubPage({ onNavigate }: GamingHubPageProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'games' | 'tournaments' | 'leaderboard'>('live');
  const [games, setGames] = useState<Game[]>([]);
  const [topGames, setTopGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [activeSessions, setActiveSessions] = useState<LiveGameSession[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    const [gamesData, categoriesData, sessionsData, topGamesData] = await Promise.all([
      gamingService.getGames({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined
      }),
      gamingService.getGameCategories(),
      gamingService.getActiveGameSessions(),
      gamingService.getTopGamesByViewers(10)
    ]);

    setGames(gamesData);
    setCategories(categoriesData);
    setActiveSessions(sessionsData);
    setTopGames(topGamesData);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                GOROTI Gaming
              </h1>
              <p className="text-gray-400">Jouez, gagnez des TruCoins, dominez</p>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Flame className="w-5 h-5" />
                <span className="text-sm font-semibold">Lives Actifs</span>
              </div>
              <div className="text-2xl font-bold">{formatNumber(activeSessions.length)}</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Users className="w-5 h-5" />
                <span className="text-sm font-semibold">Spectateurs</span>
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(activeSessions.reduce((sum, s) => sum + s.viewers_count, 0))}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Coins className="w-5 h-5" />
                <span className="text-sm font-semibold">TruCoins Générés</span>
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(topGames.reduce((sum, g) => sum + g.total_trucoins_generated, 0))}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-semibold">Jeux Disponibles</span>
              </div>
              <div className="text-2xl font-bold">{games.length}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'live'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Flame className="w-4 h-4 inline mr-2" />
              Lives en Direct
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'games'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Gamepad2 className="w-4 h-4 inline mr-2" />
              Tous les Jeux
            </button>
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'tournaments'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Trophy className="w-4 h-4 inline mr-2" />
              Tournois
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'leaderboard'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Classements
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        {(activeTab === 'games' || activeTab === 'live') && (
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un jeu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                }`}
              >
                Tous
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Top Games Section */}
            {activeTab === 'live' && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-red-500" />
                  Top Jeux en Direct
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topGames.slice(0, 6).map((game, index) => {
                    const activeStreams = getActiveStreamsForGame(game.id);
                    const totalViewers = getTotalViewersForGame(game.id);

                    if (activeStreams === 0) return null;

                    return (
                      <div
                        key={game.id}
                        onClick={() => onNavigate('game-detail', { gameId: game.id })}
                        className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all cursor-pointer group"
                      >
                        <div className="relative h-48">
                          <img
                            src={game.cover_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400'}
                            alt={game.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            LIVE
                          </div>
                          <div className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded-full text-sm font-bold">
                            #{index + 1}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2">{game.name}</h3>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Play className="w-4 h-4" />
                              {activeStreams} lives
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {formatNumber(totalViewers)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-yellow-400" />
                              {formatNumber(game.total_trucoins_generated)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Games Grid */}
            {activeTab === 'games' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {games.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => onNavigate('game-detail', { gameId: game.id })}
                    className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all cursor-pointer group"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={game.cover_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400'}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {game.is_premium && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 p-1 rounded-full">
                          <Star className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1 truncate">{game.name}</h3>
                      <p className="text-xs text-gray-400">{game.category}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-red-400">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          {getActiveStreamsForGame(game.id)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="w-3 h-3" />
                          {formatNumber(game.total_viewers)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tournaments */}
            {activeTab === 'tournaments' && (
              <div className="text-center py-20">
                <Trophy className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Tournois à venir</h3>
                <p className="text-gray-400 mb-6">Les tournois arrivent bientôt sur GOROTI Gaming!</p>
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
                  Être notifié
                </button>
              </div>
            )}

            {/* Leaderboard */}
            {activeTab === 'leaderboard' && (
              <div className="text-center py-20">
                <TrendingUp className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Classements</h3>
                <p className="text-gray-400 mb-6">Les classements globaux arrivent bientôt!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
