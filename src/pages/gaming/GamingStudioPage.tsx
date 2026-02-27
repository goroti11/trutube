import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gamepad2, Shield, TrendingUp, DollarSign, AlertCircle, Video, Settings,
  Trophy, Target, Zap, Radio, MonitorPlay, Smartphone, Tv, Crown, Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { gamingService, type Game } from '../../services/gamingService';
import { liveGamingService } from '../../services/liveGamingService';
import { useLanguage } from '../../contexts/LanguageContext';

export default function GamingStudioPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<'casual' | 'competitive' | 'tournament'>('casual');
  const [isRanked, setIsRanked] = useState(false);
  const [antiCheatEnabled, setAntiCheatEnabled] = useState(true);
  const [trucoinBonusEnabled, setTrucoinBonusEnabled] = useState(true);
  const [captureSource, setCaptureSource] = useState<'mobile' | 'pc' | 'console'>('mobile');
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [leaderboardLive, setLeaderboardLive] = useState(true);
  const [interactiveEffects, setInteractiveEffects] = useState(true);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);
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
      setError('Please accept gaming rules first');
      return;
    }

    setStarting(true);
    setError('');

    try {
      const session = await liveGamingService.startGamingSession(
        user.id,
        selectedGame,
        title,
        {
          mode,
          isRanked,
          trucoinBonusEnabled
        }
      );

      setCurrentSession(session);
      setIsLive(true);
      navigate(`/gaming/live/${session.id}`);
    } catch (error: any) {
      setError(error.message || 'Failed to start gaming session');
      console.error('Failed to start session:', error);
    } finally {
      setStarting(false);
    }
  };

  const handleEndSession = async () => {
    if (!currentSession) return;

    try {
      await liveGamingService.endGamingSession(currentSession.id);
      setIsLive(false);
      setCurrentSession(null);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
                <span>Gaming Studio</span>
              </h1>
              <p className="text-gray-400">Professional gaming live streaming & competition tools</p>
            </div>
            {isLive && (
              <div className="flex items-center space-x-2 bg-red-600/20 border border-red-500 px-6 py-3 rounded-xl">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-bold">LIVE</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 rounded-xl p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Selection */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center space-x-2 mb-4">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Select Game</h2>
              </div>

              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                disabled={isLive}
              >
                <option value="">Choose a game...</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>{game.name}</option>
                ))}
              </select>
            </div>

            {/* Stream Configuration */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Stream Configuration</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Stream Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter stream title..."
                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                    disabled={isLive}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'casual', label: 'Casual', icon: Gamepad2, color: 'cyan' },
                      { value: 'competitive', label: 'Competitive', icon: Target, color: 'orange' },
                      { value: 'tournament', label: 'Tournament', icon: Trophy, color: 'yellow' }
                    ].map(modeOption => (
                      <button
                        key={modeOption.value}
                        onClick={() => setMode(modeOption.value as any)}
                        disabled={isLive}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          mode === modeOption.value
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-gray-800 bg-black hover:border-gray-700'
                        }`}
                      >
                        <modeOption.icon className={`w-6 h-6 mx-auto mb-2 ${
                          mode === modeOption.value ? 'text-cyan-400' : 'text-gray-600'
                        }`} />
                        <p className={`text-sm font-semibold ${
                          mode === modeOption.value ? 'text-white' : 'text-gray-500'
                        }`}>
                          {modeOption.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Capture Source</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'mobile', label: 'Mobile', icon: Smartphone },
                      { value: 'pc', label: 'PC', icon: MonitorPlay },
                      { value: 'console', label: 'Console', icon: Tv }
                    ].map(source => (
                      <button
                        key={source.value}
                        onClick={() => setCaptureSource(source.value as any)}
                        disabled={isLive}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          captureSource === source.value
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-gray-800 bg-black hover:border-gray-700'
                        }`}
                      >
                        <source.icon className={`w-6 h-6 mx-auto mb-2 ${
                          captureSource === source.value ? 'text-purple-400' : 'text-gray-600'
                        }`} />
                        <p className={`text-sm font-semibold ${
                          captureSource === source.value ? 'text-white' : 'text-gray-500'
                        }`}>
                          {source.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Advanced Features</h2>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'isRanked', value: isRanked, setter: setIsRanked, label: 'Ranked Mode', icon: Trophy, description: 'Affects leaderboard rankings', premium: true },
                  { key: 'trucoinBonusEnabled', value: trucoinBonusEnabled, setter: setTrucoinBonusEnabled, label: 'TruCoin Bonuses', icon: DollarSign, description: 'Enable TruCoin multipliers' },
                  { key: 'antiCheatEnabled', value: antiCheatEnabled, setter: setAntiCheatEnabled, label: 'Anti-Cheat Protection', icon: Shield, description: 'Enable monitoring', premium: true },
                  { key: 'overlayEnabled', value: overlayEnabled, setter: setOverlayEnabled, label: 'Gaming Overlay', icon: Video, description: 'Show score & stats' },
                  { key: 'leaderboardLive', value: leaderboardLive, setter: setLeaderboardLive, label: 'Live Leaderboard', icon: TrendingUp, description: 'Real-time rankings' },
                  { key: 'interactiveEffects', value: interactiveEffects, setter: setInteractiveEffects, label: 'Interactive Effects', icon: Sparkles, description: 'Cinema mode triggers' }
                ].map(feature => (
                  <label
                    key={feature.key}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      feature.value
                        ? 'border-cyan-500 bg-cyan-500/5'
                        : 'border-gray-800 bg-black hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <feature.icon className={`w-5 h-5 ${
                        feature.value ? 'text-cyan-400' : 'text-gray-600'
                      }`} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{feature.label}</span>
                          {feature.premium && (
                            <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 py-0.5 rounded-full font-bold">
                              PRO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={feature.value}
                      onChange={(e) => feature.setter(e.target.checked)}
                      disabled={isLive}
                      className="w-5 h-5 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Control Panel */}
            <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-4">Control Panel</h3>

              {!isLive ? (
                <button
                  onClick={handleStartSession}
                  disabled={!selectedGame || !title || starting}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-red-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Radio className="w-5 h-5" />
                  <span>{starting ? 'STARTING...' : 'GO LIVE'}</span>
                </button>
              ) : (
                <button
                  onClick={handleEndSession}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-800 transition-all"
                >
                  END STREAM
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Current Viewers</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">TruCoins Earned</span>
                  <span className="text-green-400 font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Peak Viewers</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Duration</span>
                  <span className="text-white font-bold">00:00:00</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/gaming')}
                  className="w-full text-left px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-gray-400 hover:text-white transition-all">
                  Gaming Hub
                </button>
                <button
                  onClick={() => navigate('/gaming/tournaments')}
                  className="w-full text-left px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-gray-400 hover:text-white transition-all">
                  My Tournaments
                </button>
                <button
                  onClick={() => navigate('/gaming/leaderboards')}
                  className="w-full text-left px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-gray-400 hover:text-white transition-all">
                  Leaderboards
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-gray-400 hover:text-white transition-all">
                  Gaming Rules
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
