interface GorotiLiveBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeSizes = {
  sm: { text: 'text-[10px]', px: 'px-2 py-0.5', dot: 'w-1.5 h-1.5' },
  md: { text: 'text-xs', px: 'px-2.5 py-1', dot: 'w-2 h-2' },
  lg: { text: 'text-sm', px: 'px-3 py-1.5', dot: 'w-2.5 h-2.5' }
};

export default function GorotiLiveBadge({ size = 'md', className = '' }: GorotiLiveBadgeProps) {
  const s = badgeSizes[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`${s.px} bg-red-600 rounded font-black ${s.text} text-white tracking-wider uppercase leading-none flex items-center gap-1.5 shadow-lg shadow-red-600/30`}>
        <span className={`${s.dot} bg-white rounded-full goroti-live-dot`} />
        LIVE
      </span>
    </div>
  );
}
