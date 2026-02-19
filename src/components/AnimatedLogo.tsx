import { useState, useEffect } from 'react';

interface AnimatedLogoProps {
  onAnimationComplete?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const sizes = {
  sm: { icon: 'w-12 h-12', text: 'text-2xl' },
  md: { icon: 'w-16 h-16', text: 'text-3xl' },
  lg: { icon: 'w-24 h-24', text: 'text-5xl' },
  xl: { icon: 'w-32 h-32', text: 'text-6xl' },
  xxl: { icon: 'w-48 h-48', text: 'text-8xl' }
};

export default function AnimatedLogo({ onAnimationComplete, size = 'xl' }: AnimatedLogoProps) {
  const [stage, setStage] = useState(0);
  const sizeClasses = sizes[size];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 500),
      setTimeout(() => setStage(3), 900),
      setTimeout(() => setStage(4), 1300),
      setTimeout(() => {
        setStage(5);
        onAnimationComplete?.();
      }, 2000)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onAnimationComplete]);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative">
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClasses.icon} transition-all duration-700`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: stage >= 1 ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-180deg)',
            opacity: stage >= 1 ? 1 : 0
          }}
        >
          <defs>
            <linearGradient id="playGradientAnim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="circleGradientAnim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#circleGradientAnim)"
            strokeWidth="3"
            fill="none"
            className="transition-all duration-1000"
            style={{
              strokeDasharray: stage >= 2 ? '283' : '0 283',
              opacity: stage >= 2 ? 0.3 : 0
            }}
          />

          <circle
            cx="50"
            cy="50"
            r="40"
            fill="url(#playGradientAnim)"
            className="drop-shadow-2xl transition-all duration-700"
            style={{
              transform: stage >= 2 ? 'scale(1)' : 'scale(0)',
              transformOrigin: 'center',
              opacity: stage >= 2 ? 1 : 0,
              filter: stage >= 4 ? 'url(#glow)' : 'none'
            }}
          />

          <path
            d="M 40 30 L 40 70 L 70 50 Z"
            fill="white"
            className="drop-shadow-lg transition-all duration-500"
            style={{
              transform: stage >= 3 ? 'translateX(0)' : 'translateX(-20px)',
              opacity: stage >= 3 ? 1 : 0
            }}
          />

          <path
            d="M 48 25 L 48 35"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{
              opacity: stage >= 3 ? 0.8 : 0
            }}
          />
        </svg>

        {stage >= 4 && (
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" />
          </div>
        )}
      </div>

      <div
        className="flex flex-col items-center gap-2 transition-all duration-700"
        style={{
          transform: stage >= 4 ? 'translateY(0)' : 'translateY(20px)',
          opacity: stage >= 4 ? 1 : 0
        }}
      >
        <div className="flex items-baseline gap-1">
          <span
            className={`font-bold ${sizeClasses.text} bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent transition-all duration-500`}
            style={{
              transform: stage >= 4 ? 'translateX(0)' : 'translateX(-30px)',
              opacity: stage >= 4 ? 1 : 0
            }}
          >
            Tru
          </span>
          <span
            className={`font-bold ${sizeClasses.text} bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent transition-all duration-500 delay-100`}
            style={{
              transform: stage >= 4 ? 'translateX(0)' : 'translateX(30px)',
              opacity: stage >= 4 ? 1 : 0
            }}
          >
            Tube
          </span>
        </div>

        <div
          className="flex items-center gap-2 text-gray-400 transition-all duration-500 delay-200"
          style={{
            opacity: stage >= 5 ? 1 : 0
          }}
        >
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-600" />
          <span className="text-sm font-medium tracking-wider">LA VÉRITÉ AVANT TOUT</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-600" />
        </div>
      </div>
    </div>
  );
}
