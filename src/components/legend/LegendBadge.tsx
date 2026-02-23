import { LEGEND_LEVEL_INFO } from '../../types/legend';

interface LegendBadgeProps {
  level: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function LegendBadge({ level, size = 'md', showLabel = false, animated = false }: LegendBadgeProps) {
  const info = LEGEND_LEVEL_INFO[level];

  const sizes = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-lg px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${info.color} text-white font-bold ${sizes[size]} ${
        animated ? 'animate-pulse' : ''
      } shadow-lg`}
    >
      <span className={animated ? 'animate-bounce' : ''}>{info.badge}</span>
      {showLabel && <span>{info.name}</span>}
    </div>
  );
}
