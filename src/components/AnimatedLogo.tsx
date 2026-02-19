import { useState, useEffect } from 'react';

interface AnimatedLogoProps {
  onAnimationComplete?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const sizes = {
  sm: 'text-3xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-7xl',
  xxl: 'text-9xl'
};

export default function AnimatedLogo({ onAnimationComplete, size = 'xl' }: AnimatedLogoProps) {
  const [stage, setStage] = useState(0);
  const textSize = sizes[size];
  const letters = ['G', 'O', 'R', 'O', 'T', 'I'];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 300),
      setTimeout(() => setStage(3), 500),
      setTimeout(() => setStage(4), 700),
      setTimeout(() => setStage(5), 900),
      setTimeout(() => setStage(6), 1100),
      setTimeout(() => setStage(7), 1400),
      setTimeout(() => {
        setStage(8);
        onAnimationComplete?.();
      }, 2000)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onAnimationComplete]);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative flex items-center justify-center">
        {stage >= 7 && (
          <div className="absolute inset-0 -m-12 bg-red-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        )}

        <div className="relative flex items-center gap-1">
          {letters.map((letter, index) => (
            <div
              key={index}
              className="relative"
              style={{
                transform: stage >= index + 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
                opacity: stage >= index + 1 ? 1 : 0,
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: `${index * 50}ms`
              }}
            >
              <span
                className={`${textSize} font-black tracking-tighter relative block`}
                style={{
                  background: index % 2 === 0
                    ? 'linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)'
                    : 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #dc2626 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: stage >= 7
                    ? 'drop-shadow(0 0 20px rgba(220,38,38,0.5))'
                    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  transition: 'filter 0.7s ease'
                }}
              >
                {letter}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center gap-2 text-gray-400 transition-all duration-500"
        style={{
          opacity: stage >= 8 ? 1 : 0,
          transform: stage >= 8 ? 'translateY(0)' : 'translateY(12px)'
        }}
      >
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-600" />
        <span className="text-sm font-medium tracking-widest uppercase text-gray-400">LA VÉRITÉ AVANT TOUT</span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-600" />
      </div>
    </div>
  );
}
