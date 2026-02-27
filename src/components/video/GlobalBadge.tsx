import { Globe } from 'lucide-react';

interface GlobalBadgeProps {
  languageCount: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function GlobalBadge({ languageCount, size = 'md', className = '' }: GlobalBadgeProps) {
  const sizes = {
    sm: { badge: 'px-1.5 py-0.5 text-[10px]', icon: 'w-2.5 h-2.5' },
    md: { badge: 'px-2 py-1 text-xs', icon: 'w-3 h-3' },
    lg: { badge: 'px-2.5 py-1.5 text-sm', icon: 'w-3.5 h-3.5' }
  };

  const s = sizes[size];

  return (
    <div
      className={`inline-flex items-center gap-1 ${s.badge} bg-gradient-to-r from-red-600 to-orange-600 rounded font-bold uppercase tracking-wider leading-none ${className}`}
      title={`Available in ${languageCount} languages`}
    >
      <Globe className={s.icon} />
      <span>{languageCount} LANG</span>
    </div>
  );
}
