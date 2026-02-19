import { ArrowLeft, Crown, Gem, Star, Check, Zap, Shield, Video, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { User } from '../types';
import { paymentService, PremiumSubscription } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';

interface SubscriptionPageProps {
  user: User;
  onBack: () => void;
}

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  popular?: boolean;
  benefits: string[];
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    icon: <Star className="w-10 h-10" />,
    gradient: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500',
    benefits: [
      'Vidéos sans publicité',
      'Accès aux contenus exclusifs',
      'Téléchargement de vidéos en qualité HD',
      'Badge Premium sur votre profil',
      'Support prioritaire',
      'Accès anticipé aux nouvelles fonctionnalités'
    ]
  },
  {
    id: 'platine',
    name: 'Platine',
    price: 19.99,
    icon: <Gem className="w-10 h-10" />,
    gradient: 'from-gray-400 to-gray-600',
    borderColor: 'border-gray-400',
    popular: true,
    benefits: [
      'Tous les avantages Premium',
      'Téléchargement en qualité 4K',
      'Accès illimité à tous les univers',
      'Badge Platine unique et animé',
      'Création de playlists personnalisées',
      'Statistiques avancées de visionnage',
      'Accès aux événements en direct exclusifs',
      'Stockage cloud pour vos favoris'
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 29.99,
    icon: <Crown className="w-10 h-10" />,
    gradient: 'from-yellow-400 to-amber-600',
    borderColor: 'border-yellow-400',
    benefits: [
      'Tous les avantages Platine',
      'Badge Gold prestigieux et animé',
      'Accès VIP aux créateurs',
      'Téléchargements illimités',
      'Mode hors ligne avancé',
      'Suggestions personnalisées par IA',
      'Invitation aux événements exclusifs',
      'Accès aux coulisses des créateurs',
      'Support dédié 24/7',
      'Participation aux décisions de la plateforme'
    ]
  }
];

export default function SubscriptionPage({ user, onBack }: SubscriptionPageProps) {
  const { user: authUser } = useAuth();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<PremiumSubscription | null>(null);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentSubscription();
  }, [authUser]);

  const loadCurrentSubscription = async () => {
    if (!authUser) return;

    setLoading(true);
    const subscription = await paymentService.getPremiumSubscription(authUser.id);
    setCurrentSubscription(subscription);
    setLoading(false);
  };

  const handleSubscribe = async (tierId: string, price: number) => {
    if (!authUser) {
      alert('Vous devez être connecté pour vous abonner');
      return;
    }

    setSelectedTier(tierId);
    setIsProcessing(true);

    try {
      const tier = tierId as 'premium' | 'platine' | 'gold';

      if (currentSubscription && currentSubscription.status === 'active') {
        const confirmed = confirm(
          `Voulez-vous changer votre abonnement ${currentSubscription.tier.toUpperCase()} vers ${tier.toUpperCase()}?\nNouveau prix: ${price}€/mois`
        );

        if (!confirmed) {
          setIsProcessing(false);
          setSelectedTier(null);
          return;
        }

        const result = await paymentService.upgradePremiumTier(authUser.id, tier);

        if (result) {
          alert(`Abonnement changé vers ${tier.toUpperCase()} avec succès!`);
          await loadCurrentSubscription();
        } else {
          alert('Erreur lors du changement d\'abonnement. Veuillez réessayer.');
        }
      } else {
        const result = await paymentService.subscribeToPremium(authUser.id, tier);

        if (result) {
          alert(`Abonnement ${tier.toUpperCase()} activé avec succès!\n${price}€/mois`);
          await loadCurrentSubscription();
        } else {
          alert('Erreur lors de l\'activation de l\'abonnement. Veuillez réessayer.');
        }
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
      setSelectedTier(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!authUser || !currentSubscription) return;

    const confirmed = confirm(
      'Êtes-vous sûr de vouloir annuler votre abonnement?\nVous conserverez l\'accès jusqu\'à la fin de la période payée.'
    );

    if (!confirmed) return;

    setIsProcessing(true);
    const success = await paymentService.cancelPremiumSubscription(authUser.id);

    if (success) {
      alert('Abonnement annulé avec succès. Vous conservez l\'accès jusqu\'à la date d\'expiration.');
      await loadCurrentSubscription();
    } else {
      alert('Erreur lors de l\'annulation. Veuillez réessayer.');
    }

    setIsProcessing(false);
  };

  const getButtonText = (tierId: string) => {
    if (isProcessing && selectedTier === tierId) {
      return (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Traitement...</span>
        </div>
      );
    }

    if (currentSubscription?.status === 'active') {
      if (currentSubscription.tier === tierId) {
        return 'Abonnement actuel';
      }
      return 'Changer d\'abonnement';
    }

    return 'S\'abonner maintenant';
  };

  const isCurrentTier = (tierId: string) => {
    return currentSubscription?.status === 'active' && currentSubscription.tier === tierId;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 bg-gray-950 bg-opacity-95 backdrop-blur border-b border-gray-800 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Abonnements Premium Goroti</h1>
            <p className="text-sm text-gray-400">Choisissez l'abonnement qui vous convient</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {currentSubscription && currentSubscription.status === 'active' && (
          <div className="mb-8 bg-gradient-to-r from-green-500/10 to-primary-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-green-400 mb-1">Abonnement actif</h3>
                <p className="text-gray-300">
                  Vous êtes abonné au plan <span className="font-bold text-white">{currentSubscription.tier.toUpperCase()}</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Expire le {new Date(currentSubscription.expires_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={handleCancelSubscription}
                disabled={isProcessing}
                className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
              >
                Annuler l'abonnement
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            {currentSubscription?.status === 'active' ? 'Changez votre abonnement' : 'Débloquez une expérience exceptionnelle'}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Profitez de contenus exclusifs, téléchargements illimités et bien plus encore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {subscriptionTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-gray-900 rounded-2xl overflow-hidden border-2 ${
                isCurrentTier(tier.id)
                  ? 'border-green-500'
                  : tier.popular
                    ? tier.borderColor
                    : 'border-gray-800'
              } hover:border-primary-500 transition-all transform hover:scale-105`}
            >
              {isCurrentTier(tier.id) && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                  ABONNEMENT ACTUEL
                </div>
              )}
              {!isCurrentTier(tier.id) && tier.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                  POPULAIRE
                </div>
              )}

              <div className={`bg-gradient-to-br ${tier.gradient} p-8 text-center`}>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4 backdrop-blur">
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{tier.price.toFixed(2)}€</span>
                  <span className="text-lg opacity-80">/mois</span>
                </div>
              </div>

              <div className="p-6">
                <ul className="space-y-3 mb-8 min-h-[280px]">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier.id, tier.price)}
                  disabled={(isProcessing && selectedTier === tier.id) || isCurrentTier(tier.id)}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${
                    isCurrentTier(tier.id)
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                      : tier.popular
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-primary-500/30'
                        : 'bg-gray-800 hover:bg-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {getButtonText(tier.id)}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-6 text-center">Pourquoi s'abonner à Goroti Premium?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-primary-400" />
              </div>
              <h4 className="font-semibold mb-2">Sans publicité</h4>
              <p className="text-sm text-gray-400">Regardez vos vidéos sans interruption</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-accent-400" />
              </div>
              <h4 className="font-semibold mb-2">Téléchargements</h4>
              <p className="text-sm text-gray-400">Regardez hors ligne en haute qualité</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold mb-2">Contenus exclusifs</h4>
              <p className="text-sm text-gray-400">Accès aux vidéos réservées aux abonnés</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="font-semibold mb-2">Support prioritaire</h4>
              <p className="text-sm text-gray-400">Assistance rapide et dédiée</p>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm space-y-2">
          <p className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Tous les abonnements se renouvellent automatiquement chaque mois
          </p>
          <p>Annulez à tout moment depuis les paramètres de votre compte</p>
          <p className="text-xs">Paiement sécurisé par Stripe</p>
        </div>
      </div>
    </div>
  );
}
