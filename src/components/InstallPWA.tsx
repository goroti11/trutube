import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Only show prompt if not dismissed before
      const dismissed = sessionStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-install-dismissed', 'true');
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-2xl border border-red-500/20 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <img src="/GOROTI.png" alt="GOROTI" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Installer GOROTI</h3>
                <p className="text-red-100 text-sm">Accès rapide depuis votre écran d'accueil</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-red-200 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-red-50 text-sm">
              <div className="w-1.5 h-1.5 bg-red-300 rounded-full" />
              <span>Accès instantané hors ligne</span>
            </div>
            <div className="flex items-center gap-2 text-red-50 text-sm">
              <div className="w-1.5 h-1.5 bg-red-300 rounded-full" />
              <span>Notifications en temps réel</span>
            </div>
            <div className="flex items-center gap-2 text-red-50 text-sm">
              <div className="w-1.5 h-1.5 bg-red-300 rounded-full" />
              <span>Expérience native optimisée</span>
            </div>
          </div>

          <button
            onClick={handleInstall}
            className="w-full py-3.5 bg-white text-red-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            Installer l'application
          </button>
        </div>
      </div>
    </div>
  );
}
