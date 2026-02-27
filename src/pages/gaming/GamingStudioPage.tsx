import React, { useState, useEffect } from 'react';
import { Gamepad2, Shield, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { gamingService, type Game } from '../../services/gamingService';
import { useLanguage } from '../../contexts/LanguageContext';

export default function GamingStudioPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<'casual' | 'competitive' | 'tournament'>('casual');
  const [isRanked, setIsRanked] = useState(false);
  const [antiCheatEnabled, setAntiCheatEnabled] = useState(true);
  const [trucoinBonusEnabled, setTrucoinBonusEnabled] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [gamesData, rulesStatus] = await Promise.all([
        gamingService.getActiveGames(),
        gamingService.checkRulesAcceptance(user.id)
      ]);

      setGames(gamesData.filter(g => g.supports_competitive || g.supports_tournaments));
      setRulesAccepted(rulesStatus.allAccepted);
    } catch (error) {
      console.error('Failed to load gaming studio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    if (!selectedGame || !title || !user) {
      setError('Please fill in all required fields');
      return;
    }

    if (!rulesAccepted) {
      setError('You must accept all gaming rules before streaming');
      return;
    }

    setStarting(true);
    setError('');

    try {
      const session = await gamingService.startLiveGamingSession(
        user.id,
        selectedGame,
        title,
        mode,
        {
          isRanked,
          antiCheatEnabled,
          trucoinBonusEnabled
        }
      );

      window.location.hash = `live/${session.id}`;
    } catch (error: any) {
      setError(error.message || 'Failed to start gaming session');
    } finally {
      setStarting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please sign in to access Gaming Studio</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 mb-4 shadow-lg shadow-cyan-500/50">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Gaming Studio
          </h1>
          <p className="text-gray-300">Start your competitive gaming session</p>
        </div>

        {!rulesAccepted && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-semibold mb-1">Gaming Rules Required</p>
              <p className="text-sm text-gray-300 mb-2">
                You must accept all gaming rules before you can start streaming.
              </p>
              <a
                href="#gaming-rules"
                className="text-sm text-cyan-400 hover:text-cyan-300 underline"
              >
                Accept Gaming Rules
              </a>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Game <span className="text-red-400">*</span>
            </label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Choose a game...</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Stream Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter stream title..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gaming Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {(['casual', 'competitive', 'tournament'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                    mode === m
                      ? 'bg-purple-600 border-purple-500'
                      : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isRanked}
                onChange={(e) => setIsRanked(e.target.checked)}
                className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  <span className="font-medium">Ranked Match</span>
                </div>
                <p className="text-sm text-gray-400">
                  Affects leaderboard rankings and season statistics
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={antiCheatEnabled}
                onChange={(e) => setAntiCheatEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="font-medium">Anti-Cheat Protection</span>
                </div>
                <p className="text-sm text-gray-400">
                  Enable anti-cheat monitoring for fair play
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={trucoinBonusEnabled}
                onChange={(e) => setTrucoinBonusEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-gray-700 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium">TruCoin Bonus</span>
                </div>
                <p className="text-sm text-gray-400">
                  Enable bonus TruCoins for exceptional gameplay
                </p>
              </div>
            </label>
          </div>

          <button
            onClick={handleStartSession}
            disabled={!rulesAccepted || starting || !selectedGame || !title}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-lg"
          >
            {starting ? 'Starting Session...' : 'Start Gaming Session'}
          </button>
        </div>

        <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-cyan-400 mb-2">Gaming Studio Features</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Real-time leaderboard tracking</li>
            <li>• Tournament integration</li>
            <li>• TruCoin earnings from viewer gifts</li>
            <li>• Anti-cheat protection</li>
            <li>• Performance analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
