import { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';

interface SplashScreenProps {
  onComplete: () => void;
  minDisplayTime?: number;
}

export default function SplashScreen({ onComplete, minDisplayTime = 3500 }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 1800);

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 700);
    }, minDisplayTime);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(timer);
    };
  }, [onComplete, minDisplayTime]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '500ms' }} />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <AnimatedLogo size="xxl" />

        <div
          className={`transition-all duration-700 ${
            showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-center space-y-2">
            <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-red-400">
              Votre plateforme vidéo authentique
            </p>
            <p className="text-sm md:text-base text-gray-400 font-medium">
              Créez, partagez, monétisez en toute transparence
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-xs text-gray-500 font-medium tracking-wider">CHARGEMENT...</p>
      </div>
    </div>
  );
}
