import { useState, useEffect } from 'react';

interface AnimatedLogoProps {
  onAnimationComplete?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const iconSizes = {
  sm: 48,
  md: 64,
  lg: 96,
  xl: 120,
  xxl: 160
};

const textSizes = {
  sm: 'text-3xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-7xl',
  xxl: 'text-8xl'
};

export default function AnimatedLogo({ onAnimationComplete, size = 'xl' }: AnimatedLogoProps) {
  const [stage, setStage] = useState(0);
  const iconSize = iconSizes[size];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 500),
      setTimeout(() => setStage(3), 800),
      setTimeout(() => setStage(4), 1200),
      setTimeout(() => {
        setStage(5);
        onAnimationComplete?.();
      }, 1800)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onAnimationComplete]);

  const letters: Array<{ char: string; color: 'white' | 'red' }> = [
    { char: 'G', color: 'white' },
    { char: 'O', color: 'red' },
    { char: 'R', color: 'white' },
    { char: 'O', color: 'red' },
    { char: 'T', color: 'red' },
    { char: 'I', color: 'white' }
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div
        className="relative transition-all duration-700 ease-out"
        style={{
          opacity: stage >= 1 ? 1 : 0,
          transform: stage >= 1 ? 'scale(1)' : 'scale(0.5)',
        }}
      >
        {stage >= 3 && (
          <div
            className="absolute inset-0 -m-8 rounded-full blur-3xl transition-opacity duration-1000"
            style={{
              background: 'radial-gradient(circle, rgba(220,38,38,0.25) 0%, transparent 70%)',
              opacity: stage >= 4 ? 1 : 0
            }}
          />
        )}

        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <defs>
            <radialGradient id="splashIconBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </radialGradient>
            <linearGradient id="splashOuter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="splashInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#splashIconBg)" />

          <circle
            cx="50" cy="50" r="32"
            fill="none"
            stroke="url(#splashOuter)"
            strokeWidth="3"
            style={{
              strokeDasharray: 201,
              strokeDashoffset: stage >= 2 ? 0 : 201,
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />

          <circle
            cx="50" cy="50" r="26"
            fill="none"
            stroke="url(#splashInner)"
            strokeWidth="2.5"
            opacity="0.7"
            style={{
              strokeDasharray: 163,
              strokeDashoffset: stage >= 2 ? 0 : 163,
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s'
            }}
          />

          <circle
            cx="50" cy="50" r="4"
            fill="#dc2626"
            className={stage >= 3 ? 'goroti-core-pulse' : ''}
            style={{
              opacity: stage >= 2 ? 1 : 0,
              transition: 'opacity 0.4s ease'
            }}
          />
          <circle
            cx="50" cy="50" r="6"
            fill="none"
            stroke="#dc2626"
            strokeWidth="0.5"
            opacity={stage >= 2 ? 0.4 : 0}
            style={{ transition: 'opacity 0.4s ease 0.1s' }}
          />

          <path
            d="M 44 38 L 44 62 L 62 50 Z"
            fill="white"
            style={{
              opacity: stage >= 2 ? 0.9 : 0,
              transform: stage >= 2 ? 'scale(1)' : 'scale(0.7)',
              transformOrigin: '50px 50px',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s'
            }}
          />
        </svg>
      </div>

      <div className="relative flex items-center gap-0.5">
        {letters.map((letter, index) => (
          <span
            key={index}
            className={`${textSizes[size]} font-black tracking-tighter`}
            style={{
              color: letter.color === 'red' ? '#dc2626' : '#ffffff',
              textShadow: stage >= 4 && letter.color === 'red'
                ? '0 0 20px rgba(220,38,38,0.6), 0 0 40px rgba(220,38,38,0.3)'
                : stage >= 4
                  ? '0 0 10px rgba(220,38,38,0.2)'
                  : 'none',
              opacity: stage >= 3 ? 1 : 0,
              transform: stage >= 3 ? 'translateY(0)' : 'translateY(12px)',
              transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 60 + 100}ms`,
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>

      <div
        className="flex items-center gap-3 transition-all duration-700"
        style={{
          opacity: stage >= 5 ? 1 : 0,
          transform: stage >= 5 ? 'translateY(0)' : 'translateY(8px)'
        }}
      >
        <div className="h-px w-10 bg-gradient-to-r from-transparent to-red-800/60" />
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-500">
          PLATEFORME VIDEO
        </span>
        <div className="h-px w-10 bg-gradient-to-l from-transparent to-red-800/60" />
      </div>
    </div>
  );
}
