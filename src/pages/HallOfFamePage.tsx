import { useEffect, useState } from 'react';
import { legendService } from '../services/legendService';
import { LegendBadge } from '../components/legend/LegendBadge';
import type { LegendRegistry } from '../types/legend';
import { LEGEND_LEVEL_INFO } from '../types/legend';

export function HallOfFamePage() {
  const [legends, setLegends] = useState<LegendRegistry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHallOfFame();
  }, []);

  const loadHallOfFame = async () => {
    try {
      const data = await legendService.getHallOfFame(100);
      setLegends(data);
    } catch (error) {
      console.error('Failed to load hall of fame:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-7xl font-bold text-white mb-4">
            🏛️ Hall of Legends
          </h1>
          <p className="text-2xl text-purple-200 mb-4">
            Les 100 plus grandes légendes de GOROTI
          </p>
          <p className="text-lg text-purple-300">
            Classées par niveau d'excellence et ancienneté
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Top 100 Historique</h2>
            <div className="text-gray-400">
              {legends.length} légendes immortelles
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[4, 3, 2, 1].map((level) => {
              const count = legends.filter((l) => l.level === level).length;
              const info = LEGEND_LEVEL_INFO[level as 1 | 2 | 3 | 4];
              return (
                <div
                  key={level}
                  className={`bg-gradient-to-br ${info.color} rounded-xl p-6 text-center shadow-xl`}
                >
                  <div className="text-5xl mb-2">{info.badge}</div>
                  <div className="text-2xl font-bold text-white mb-1">{count}</div>
                  <div className="text-white/90 text-sm">{info.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {legends.map((legend, index) => (
            <div
              key={legend.id}
              className={`bg-gray-800 rounded-xl p-6 border-2 transition-all hover:scale-102 ${
                legend.level === 4
                  ? 'border-red-500/50 hover:border-red-500'
                  : legend.level === 3
                  ? 'border-yellow-500/50 hover:border-yellow-500'
                  : legend.level === 2
                  ? 'border-purple-500/50 hover:border-purple-500'
                  : 'border-blue-500/50 hover:border-blue-500'
              }`}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div
                    className={`text-5xl font-bold ${
                      index === 0
                        ? 'text-yellow-400'
                        : index === 1
                        ? 'text-gray-300'
                        : index === 2
                        ? 'text-orange-400'
                        : 'text-gray-500'
                    }`}
                  >
                    #{index + 1}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {legend.entity_type === 'video' && '🎥 Vidéo'}
                        {legend.entity_type === 'music' && '🎵 Musique'}
                        {legend.entity_type === 'gaming_achievement' && '🎮 Gaming'}
                        {legend.entity_type === 'live_replay' && '🔴 Live Replay'}
                      </h3>
                      <p className="text-gray-400">
                        {legend.reason.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <LegendBadge level={legend.level as 1 | 2 | 3 | 4} size="lg" showLabel />
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Catégorie:</span>
                      <span className="text-white">
                        {legend.category?.icon} {legend.category?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Depuis:</span>
                      <span className="text-white">{formatDate(legend.granted_at)}</span>
                    </div>
                    {legend.verified_metrics &&
                      (legend.verified_metrics as any).verified_views && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Vues:</span>
                          <span className="text-yellow-400 font-bold">
                            {(
                              (legend.verified_metrics as any).verified_views / 1000000
                            ).toFixed(1)}
                            M
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {legends.length === 0 && (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg">
              Le Hall of Fame est en cours de construction
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
