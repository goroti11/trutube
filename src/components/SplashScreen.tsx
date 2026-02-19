import { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';

interface SplashScreenProps {
  onComplete: () => void;
  minDisplayTime?: number;
}

export default function SplashScreen({ onComplete, minDisplayTime = 2500 }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [onComplete, minDisplayTime]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/6 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative">
        <AnimatedLogo size="xxl" />
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
