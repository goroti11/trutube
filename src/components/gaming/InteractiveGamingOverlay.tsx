import { useState, useEffect } from 'react';
import { Zap, Target, DollarSign, Crown, Sparkles } from 'lucide-react';
import { liveGamingService, type GameEffect } from '../../services/liveGamingService';

interface InteractiveGamingOverlayProps {
  sessionId: string;
  gameId: string;
  streamerId: string;
  userId?: string;
}

export default function InteractiveGamingOverlay({ sessionId, gameId, userId }: InteractiveGamingOverlayProps) {
  const [effects, setEffects] = useState<GameEffect[]>([]);
  const [activeEffect, setActiveEffect] = useState<GameEffect | null>(null);
  const [showEffectUI, setShowEffectUI] = useState(false);
  const [userTruCoins, setUserTruCoins] = useState(1000);

  useEffect(() => {
    loadEffects();
    const unsubscribe = subscribeToEffects();
    return () => unsubscribe();
  }, [sessionId]);

  const loadEffects = async () => {
    try {
      const data = await liveGamingService.getGamingEffects(gameId);
      setEffects(data);
    } catch (error) {
      console.error('Failed to load effects:', error);
    }
  };

  const subscribeToEffects = () => {
    return liveGamingService.subscribeToGameSession(sessionId, (event) => {
      if (event.new?.interaction_type && event.new?.effect_data) {
        triggerVisualEffect(event.new.effect_data);
      }
    });
  };

  const triggerVisualEffect = (effectData: any) => {
    setActiveEffect(effectData);
    setTimeout(() => setActiveEffect(null), effectData.duration_seconds * 1000);
  };

  const handleTriggerEffect = async (effect: GameEffect) => {
    if (!userId || userTruCoins < (effect.trigger_trucoin_amount || 0)) return;

    try {
      await liveGamingService.triggerGamingEffect(
        sessionId,
        effect.id,
        userId,
        effect.trigger_trucoin_amount || 0
      );

      setUserTruCoins(prev => prev - (effect.trigger_trucoin_amount || 0));
      triggerVisualEffect(effect);
    } catch (error) {
      console.error('Failed to trigger effect:', error);
    }
  };

  const getEffectIcon = (type: string) => {
    switch (type) {
      case 'slow_motion': return <Zap className="w-5 h-5" />;
      case 'boss_mode': return <Crown className="w-5 h-5" />;
      case 'speed_boost': return <Target className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Active Effect Overlay */}
      {activeEffect && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {activeEffect.effect_type === 'slow_motion' && (
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm animate-pulse">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-6xl font-bold text-cyan-400 animate-bounce" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.8)' }}>
                  SLOW MOTION
                </div>
              </div>
            </div>
          )}

          {activeEffect.effect_type === 'boss_mode' && (
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 to-black/50">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
                <Crown className="w-32 h-32 text-yellow-400 animate-pulse" style={{ filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))' }} />
                <div className="text-4xl font-bold text-red-400 text-center mt-4" style={{ textShadow: '0 0 20px rgba(248, 113, 113, 0.8)' }}>
                  BOSS MODE ACTIVATED
                </div>
              </div>
            </div>
          )}

          {activeEffect.effect_type === 'speed_boost' && (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Zap className="w-24 h-24 text-yellow-400 animate-bounce" style={{ filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.8))' }} />
              </div>
            </div>
          )}

          {activeEffect.effect_type === 'screen_flash' && (
            <div className="absolute inset-0 bg-white animate-ping"></div>
          )}

          {activeEffect.effect_type === 'cinema_mode' && (
            <>
              <div className="absolute top-0 left-0 right-0 h-24 bg-black/90 backdrop-blur-sm"></div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-black/90 backdrop-blur-sm"></div>
            </>
          )}
        </div>
      )}

      {/* Interactive Effects Button */}
      {userId && (
        <button
          onClick={() => setShowEffectUI(!showEffectUI)}
          className="absolute bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
          style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }}
        >
          <Sparkles className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Effects UI Panel */}
      {showEffectUI && userId && (
        <div className="absolute bottom-44 right-6 w-80 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/50 shadow-2xl z-40 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-white" />
                <h3 className="font-bold text-white">Interactive Effects</h3>
              </div>
              <div className="flex items-center space-x-1 bg-black/30 px-3 py-1 rounded-full">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-white">{userTruCoins}</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {effects.map((effect) => {
              const canAfford = userTruCoins >= (effect.trigger_trucoin_amount || 0);
              const tierColor = {
                bronze: 'from-orange-700 to-orange-900',
                silver: 'from-gray-400 to-gray-600',
                gold: 'from-yellow-400 to-yellow-600',
                platinum: 'from-cyan-400 to-cyan-600',
                diamond: 'from-blue-400 to-purple-600',
                legendary: 'from-pink-500 to-purple-600'
              }[effect.trigger_gift_tier || 'bronze'];

              return (
                <button
                  key={effect.id}
                  onClick={() => handleTriggerEffect(effect)}
                  disabled={!canAfford}
                  className={`w-full p-3 rounded-xl border transition-all ${
                    canAfford
                      ? `bg-gradient-to-r ${tierColor} hover:scale-105 cursor-pointer`
                      : 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getEffectIcon(effect.effect_type)}
                      <span className="font-semibold text-white">{effect.effect_name}</span>
                    </div>
                    <span className="text-xs bg-black/30 px-2 py-1 rounded-full text-white">
                      {effect.duration_seconds}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80 capitalize">{effect.effect_type.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-yellow-400" />
                      <span className="font-bold text-white">{effect.trigger_trucoin_amount}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-800 bg-black/30">
            <p className="text-xs text-gray-400 text-center">
              Trigger effects to enhance the gaming experience and support the streamer
            </p>
          </div>
        </div>
      )}
    </>
  );
}
