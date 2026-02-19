import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Zap, TrendingUp, Shield } from 'lucide-react';

interface FreeTrialBannerProps {
  onClose?: () => void;
  onStartTrial?: () => void;
}

export default function FreeTrialBanner({ onClose, onStartTrial }: FreeTrialBannerProps) {
  const [showDetails, setShowDetails] = useState(false);

  const freeFeatures = [
    'Regarder des vidéos en HD',
    'Interagir avec le contenu',
    'Créer des playlists',
    'Commenter et liker',
    'Recherche de base'
  ];

  const premiumFeatures = [
    'Upload illimité de vidéos',
    'Qualité 4K',
    'Statistiques avancées',
    'Monétisation du contenu',
    'Sans publicités',
    'Badge vérifié',
    'Support prioritaire',
    'Outils de création avancés',
    'Multi-univers',
    'Analyses détaillées'
  ];

  if (!showDetails) {
    return (
      <div className="bg-gradient-to-r from-[#D8A0B6] to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="animate-pulse" size={24} />
              <div>
                <p className="font-bold">
                  Essai gratuit de 15 jours ! Profitez de toutes les fonctionnalités premium.
                </p>
                <p className="text-sm opacity-90">
                  Aucune carte bancaire requise. Annulez quand vous voulez.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetails(true)}
                className="px-6 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Voir les offres
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0B0B0D] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0B0B0D] border-b border-gray-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Sparkles className="text-[#D8A0B6]" size={32} />
              Choisissez votre expérience Goroti
            </h2>
            <p className="text-gray-400 mt-2">Commencez avec 15 jours d'essai gratuit premium</p>
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A] rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gray-800 rounded-lg">
                <Shield size={32} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Gratuit</h3>
                <p className="text-gray-400">Pour toujours</p>
              </div>
            </div>

            <div className="my-6">
              <div className="text-4xl font-bold text-white mb-2">0€</div>
              <p className="text-gray-400">Accès de base à la plateforme</p>
            </div>

            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setShowDetails(false);
                onStartTrial?.();
              }}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
            >
              Commencer gratuitement
            </button>
          </div>

          <div className="bg-gradient-to-br from-[#D8A0B6]/20 to-purple-600/20 rounded-xl p-8 border-2 border-[#D8A0B6] relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-[#D8A0B6] to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Crown size={16} />
                POPULAIRE
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-[#D8A0B6] to-purple-600 rounded-lg">
                <Crown size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Premium</h3>
                <p className="text-gray-400">Tout ce dont vous avez besoin</p>
              </div>
            </div>

            <div className="my-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">9,99€</span>
                <span className="text-gray-400">/mois</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[#D8A0B6] font-medium">
                <Sparkles size={16} />
                <span>15 jours d'essai gratuit</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check size={20} className="text-[#D8A0B6] flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setShowDetails(false);
                onStartTrial?.();
              }}
              className="w-full py-3 bg-gradient-to-r from-[#D8A0B6] to-purple-600 hover:from-[#C890A6] hover:to-purple-700 rounded-lg text-white font-bold transition-all transform hover:scale-105"
            >
              Commencer l'essai gratuit
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Sans engagement. Annulez à tout moment.
            </p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border-t border-gray-800 p-6">
          <div className="max-w-4xl mx-auto">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="text-[#D8A0B6]" />
              Pourquoi passer Premium ?
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#D8A0B6]/20 rounded-lg">
                  <TrendingUp size={20} className="text-[#D8A0B6]" />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Monétisez votre passion</div>
                  <div className="text-sm text-gray-400">
                    Gagnez de l'argent avec vos vidéos et votre communauté
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#D8A0B6]/20 rounded-lg">
                  <Crown size={20} className="text-[#D8A0B6]" />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Fonctionnalités exclusives</div>
                  <div className="text-sm text-gray-400">
                    Accédez à tous les outils professionnels
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#D8A0B6]/20 rounded-lg">
                  <Shield size={20} className="text-[#D8A0B6]" />
                </div>
                <div>
                  <div className="font-medium text-white mb-1">Support prioritaire</div>
                  <div className="text-sm text-gray-400">
                    Une équipe dédiée pour vous accompagner
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
