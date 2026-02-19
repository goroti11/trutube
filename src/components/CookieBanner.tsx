import { useState, useEffect } from 'react';
import { Cookie, Settings, X, CheckCircle, Shield, BarChart2, Zap } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

const STORAGE_KEY = 'trutube_cookie_consent';

export function getCookieConsent(): (CookiePreferences & { decided: boolean }) | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCookieConsent(prefs: CookiePreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, essential: true, decided: true }));
}

const COOKIE_CATEGORIES = [
  {
    key: 'essential' as const,
    label: 'Cookies essentiels',
    desc: 'Nécessaires au fonctionnement du site. Authentification, sécurité, session utilisateur.',
    icon: <Shield className="w-4 h-4" />,
    required: true,
    examples: 'Session, CSRF, auth tokens',
  },
  {
    key: 'functional' as const,
    label: 'Cookies fonctionnels',
    desc: 'Mémorisent vos préférences : thème, langue, lecture automatique, qualité vidéo.',
    icon: <Settings className="w-4 h-4" />,
    required: false,
    examples: 'Préférences UI, langue, volume',
  },
  {
    key: 'analytics' as const,
    label: 'Cookies analytiques',
    desc: "Nous aident à comprendre comment vous utilisez Goroti pour améliorer l'expérience.",
    icon: <BarChart2 className="w-4 h-4" />,
    required: false,
    examples: 'Pages visitées, watchtime, erreurs',
  },
  {
    key: 'marketing' as const,
    label: 'Cookies marketing',
    desc: 'Permettent de vous proposer des contenus et publicités personnalisés selon vos intérêts.',
    icon: <Zap className="w-4 h-4" />,
    required: false,
    examples: 'Recommandations, ciblage publicitaire',
  },
];

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing || !existing.decided) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const all: CookiePreferences = { essential: true, functional: true, analytics: true, marketing: true };
    saveCookieConsent(all);
    setVisible(false);
  };

  const rejectAll = () => {
    const min: CookiePreferences = { essential: true, functional: false, analytics: false, marketing: false };
    saveCookieConsent(min);
    setVisible(false);
  };

  const saveCustom = () => {
    saveCookieConsent({ ...prefs, essential: true });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {!showDetails ? (
          <>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-base mb-1">Vos préférences de cookies</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Goroti utilise des cookies pour assurer le bon fonctionnement du site et améliorer votre expérience. Certains cookies sont essentiels, d'autres optionnels.
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                {COOKIE_CATEGORIES.map(cat => (
                  <div key={cat.key} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{cat.icon}</span>
                      <span className="text-sm text-gray-300">{cat.label}</span>
                      {cat.required && <span className="text-xs text-gray-600">(requis)</span>}
                    </div>
                    {cat.required ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div
                        onClick={() => setPrefs(p => ({ ...p, [cat.key]: !p[cat.key] }))}
                        className={`w-9 h-5 rounded-full cursor-pointer relative transition-colors ${(prefs as Record<string, boolean>)[cat.key] ? 'bg-red-600' : 'bg-gray-700'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${(prefs as Record<string, boolean>)[cat.key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowDetails(true)}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline mb-4 block"
              >
                En savoir plus sur chaque catégorie
              </button>
            </div>

            <div className="flex gap-2 px-6 pb-6">
              <button
                onClick={rejectAll}
                className="flex-1 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                Refuser tout
              </button>
              <button
                onClick={saveCustom}
                className="flex-1 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
              >
                Enregistrer le choix
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors"
              >
                Tout accepter
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 p-5 border-b border-gray-800">
              <button onClick={() => setShowDetails(false)} className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
              <h2 className="font-bold text-white text-base">Détail des cookies</h2>
            </div>

            <div className="p-5 space-y-4 max-h-80 overflow-y-auto">
              {COOKIE_CATEGORIES.map(cat => (
                <div key={cat.key} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cat.required ? 'text-green-400' : 'text-gray-400'}>{cat.icon}</span>
                      <p className="text-sm font-semibold text-white">{cat.label}</p>
                      {cat.required && <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Obligatoire</span>}
                    </div>
                    {!cat.required && (
                      <div
                        onClick={() => setPrefs(p => ({ ...p, [cat.key]: !p[cat.key] }))}
                        className={`w-9 h-5 rounded-full cursor-pointer relative transition-colors flex-shrink-0 ${(prefs as Record<string, boolean>)[cat.key] ? 'bg-red-600' : 'bg-gray-600'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${(prefs as Record<string, boolean>)[cat.key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{cat.desc}</p>
                  <p className="text-xs text-gray-600">Exemples : {cat.examples}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 p-5 border-t border-gray-800">
              <button onClick={rejectAll} className="flex-1 py-2.5 text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">Refuser tout</button>
              <button onClick={saveCustom} className="flex-1 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors">Enregistrer</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
