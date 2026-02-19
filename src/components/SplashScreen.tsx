import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  minDisplayTime?: number;
}

export default function SplashScreen({ onComplete, minDisplayTime = 3000 }: SplashScreenProps) {
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 600),
      setTimeout(() => setStage(3), 1200),
      setTimeout(() => setStage(4), 1800),
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(onComplete, 800);
      }, minDisplayTime)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete, minDisplayTime]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 transition-all duration-700 ${
        fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: stage >= 1 ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-45deg)',
            opacity: stage >= 1 ? 1 : 0
          }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-red-500/8 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: stage >= 2 ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(45deg)',
            opacity: stage >= 2 ? 1 : 0,
            transitionDelay: '200ms'
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-400/5 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: stage >= 3 ? 'scale(1)' : 'scale(0.3)',
            opacity: stage >= 3 ? 1 : 0,
            transitionDelay: '400ms'
          }}
        />
      </div>

      <div className="relative flex flex-col items-center justify-center px-4 w-full max-w-md">
        <div
          className="relative w-full flex items-center justify-center transition-all duration-1000 ease-out"
          style={{
            transform: stage >= 1 ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(40px)',
            opacity: stage >= 1 ? 1 : 0
          }}
        >
          <div
            className="absolute inset-0 -m-12 bg-gradient-to-r from-red-600/20 via-red-500/30 to-red-600/20 rounded-full blur-3xl transition-all duration-1000"
            style={{
              opacity: stage >= 4 ? 0.6 : 0,
              transform: stage >= 4 ? 'scale(1.2)' : 'scale(0.8)',
              animation: stage >= 4 ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
            }}
          />

          <img
            src="/GOROTI.png"
            alt="GOROTI"
            className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain z-10 transition-all duration-1000"
            style={{
              filter: stage >= 3 ? 'drop-shadow(0 0 40px rgba(220,38,38,0.6)) drop-shadow(0 0 80px rgba(220,38,38,0.3))' : 'drop-shadow(0 0 10px rgba(220,38,38,0.2))',
            }}
          />
        </div>

        <div
          className="mt-12 flex flex-col items-center gap-4 transition-all duration-700"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent via-red-500/50 to-red-600/50" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-gray-300">
              LA VÉRITÉ AVANT TOUT
            </span>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent via-red-500/50 to-red-600/50" />
          </div>

          <div
            className="flex gap-2 transition-opacity duration-500"
            style={{
              opacity: stage >= 4 ? 1 : 0
            }}
          >
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: stage >= 2 ? 0.03 : 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220,38,38,0.1) 0%, transparent 50%)',
          backgroundSize: '100px 100px'
        }}
      />
    </div>
  );
}
