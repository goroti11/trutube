import { LegendBadge } from './LegendBadge';
import type { LegendRegistry } from '../../types/legend';

interface LegendCardProps {
  legend: LegendRegistry;
  onClick?: () => void;
}

export function LegendCard({ legend, onClick }: LegendCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-xl overflow-hidden border-2 border-yellow-500/30 hover:border-yellow-500 transition-all cursor-pointer group hover:scale-105 shadow-xl"
    >
      <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-20">
            {legend.category?.icon || '⭐'}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <LegendBadge level={legend.level as 1 | 2 | 3 | 4} size="lg" animated />
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="inline-block px-3 py-1 bg-black/60 rounded-full text-sm text-white">
            {legend.category?.name || 'Unknown'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
          {legend.entity_type} #{legend.entity_id.slice(0, 8)}
        </h3>

        <p className="text-gray-400 text-sm mb-4">
          {legend.reason.replace(/_/g, ' ')}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Granted {formatDate(legend.granted_at)}</span>
          {legend.verified_metrics && Object.keys(legend.verified_metrics).length > 0 && (
            <span className="text-yellow-400">
              {(legend.verified_metrics as any).verified_views
                ? `${((legend.verified_metrics as any).verified_views / 1000000).toFixed(1)}M views`
                : 'Verified'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
