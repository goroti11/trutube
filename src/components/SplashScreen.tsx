import { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';

interface SplashScreenProps {
  onComplete: () => void;
  minDisplayTime?: number;
}

export default function SplashScreen({ onComplete, minDisplayTime = 3000 }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 600);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [onComplete, minDisplayTime]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950 transition-opacity duration-600 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] goroti-core-pulse"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative">
        <AnimatedLogo size="xxl" />
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-red-600"
              style={{
                animation: 'goroti-loading 1.2s ease-in-out infinite',
                animationDelay: `${i * 200}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
