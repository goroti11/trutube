interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  isLive?: boolean;
  animated?: boolean;
}

const sizes = {
  sm: { icon: 32, text: 'text-lg', gap: 'gap-2' },
  md: { icon: 40, text: 'text-xl', gap: 'gap-2' },
  lg: { icon: 56, text: 'text-3xl', gap: 'gap-3' },
  xl: { icon: 72, text: 'text-4xl', gap: 'gap-3' }
};

export default function Logo({ size = 'md', showText = true, className = '', isLive = false, animated = false }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      <div className="relative flex-shrink-0">
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`iconBg-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </radialGradient>
            <radialGradient id={`ringGlow-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#dc2626" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`outerRing-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id={`innerRing-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          <rect x="5" y="5" width="90" height="90" rx="20" fill={`url(#iconBg-${size})`} />

          {isLive && (
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#dc2626"
              strokeWidth="1"
              opacity="0.3"
              className="goroti-live-halo"
            />
          )}

          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke={`url(#outerRing-${size})`}
            strokeWidth="3"
          />

          <circle
            cx="50"
            cy="50"
            r="26"
            fill="none"
            stroke={`url(#innerRing-${size})`}
            strokeWidth="2.5"
            opacity="0.7"
          />

          <circle
            cx="50"
            cy="50"
            r="4"
            fill="#dc2626"
            className={animated ? 'goroti-core-pulse' : ''}
          />
          <circle
            cx="50"
            cy="50"
            r="6"
            fill="none"
            stroke="#dc2626"
            strokeWidth="0.5"
            opacity="0.4"
          />

          <path
            d="M 44 38 L 44 62 L 62 50 Z"
            fill="white"
            opacity="0.9"
          />

          {isLive && (
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#dc2626"
              strokeWidth="1.5"
              opacity="0.15"
              className="goroti-live-pulse"
            />
          )}
        </svg>

        {isLive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-black rounded tracking-wider uppercase leading-none flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full goroti-live-dot" />
              LIVE
            </span>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex items-center">
          <span className={`font-black ${s.text} tracking-tight leading-none`}>
            <span className="text-white">G</span>
            <span className="text-red-600 goroti-o-glow">O</span>
            <span className="text-white">R</span>
            <span className="text-red-600">O</span>
            <span className="text-red-600">T</span>
            <span className="text-white">I</span>
          </span>
        </div>
      )}
    </div>
  );
}
