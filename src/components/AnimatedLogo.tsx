import { useState, useEffect } from 'react';

interface AnimatedLogoProps {
  onAnimationComplete?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const sizes = {
  sm: { img: 'h-12', text: 'text-2xl' },
  md: { img: 'h-16', text: 'text-3xl' },
  lg: { img: 'h-24', text: 'text-5xl' },
  xl: { img: 'h-32', text: 'text-6xl' },
  xxl: { img: 'h-24', text: 'text-8xl' }
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
      <div
        className="transition-all duration-700"
        style={{
          transform: stage >= 1 ? 'scale(1)' : 'scale(0.5)',
          opacity: stage >= 1 ? 1 : 0
        }}
      >
        {stage >= 4 && (
          <div className="absolute -inset-8 bg-red-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        )}
        <img
          src="/GOROTI.png"
          alt="GOROTI"
          className={`${sizeClasses.img} w-auto object-contain relative`}
          style={{
            filter: stage >= 4 ? 'drop-shadow(0 0 24px rgba(220,38,38,0.5))' : 'none',
            transition: 'filter 0.7s ease'
          }}
        />
      </div>

      <div
        className="flex items-center gap-2 text-gray-400 transition-all duration-500"
        style={{
          opacity: stage >= 5 ? 1 : 0,
          transform: stage >= 5 ? 'translateY(0)' : 'translateY(12px)'
        }}
      >
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-600" />
        <span className="text-sm font-medium tracking-widest uppercase text-gray-400">LA VÉRITÉ AVANT TOUT</span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-600" />
      </div>
    </div>
  );
}
