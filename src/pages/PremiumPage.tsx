import { useState } from 'react';
import { Check, X, Sparkles, Zap, Crown, Shield, Star, TrendingUp, Users, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

type BillingPeriod = 'monthly' | 'annual';

interface PremiumTier {
  id: string;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
}

export default function PremiumPage() {
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('annual');

  const tiers: PremiumTier[] = [
    {
      id: 'premium',
      name: 'Premium',
      icon: Star,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: [
        'Vidéos sans publicité',
        'Accès contenus exclusifs',
        'Téléchargement HD',
        'Badge Premium visible',
        'Support prioritaire',
        'Accès anticipé fonctionnalités'
      ]
    },
    {
      id: 'platine',
      name: 'Platine',
      icon: Zap,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      popular: true,
      features: [
        'Tous les avantages Premium',
        'Téléchargement 4K',
        'Accès illimité tous univers',
        'Badge Platine animé',
        'Playlists personnalisées IA',
        'Statistiques avancées',
        'Événements live exclusifs',
        'Stockage cloud favoris'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      icon: Crown,
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500',
      monthlyPrice: 29.99,
      annualPrice: 299.99,
      features: [
        'Tous les avantages Platine',
        'Badge Gold prestigieux',
        'Accès VIP créateurs',
        'Téléchargements illimités',
        'Mode hors ligne avancé',
        'Support dédié 24/7',
        'Participation aux décisions',
        'Rencontres créateurs exclusives'
      ]
    }
  ];

  const getPrice = (tier: PremiumTier) => {
    return billingPeriod === 'monthly' ? tier.monthlyPrice : tier.annualPrice / 12;
  };

  const getSavings = (tier: PremiumTier) => {
    return tier.monthlyPrice * 12 - tier.annualPrice;
  };

  const whyPremiumReasons = [
    {
      icon: Play,
      title: 'Expérience sans interruption',
      description: 'Profitez de vos vidéos préférées sans aucune publicité. Focus total sur le contenu.'
    },
    {
      icon: Shield,
      title: 'Soutenez les créateurs directement',
      description: '70% de votre abonnement va directement aux créateurs que vous regardez.'
    },
    {
      icon: Sparkles,
      title: 'Contenus exclusifs premium',
      description: 'Accédez à des vidéos, lives et événements réservés uniquement aux membres premium.'
    },
    {
      icon: TrendingUp,
      title: 'Fonctionnalités avancées',
      description: 'Stats détaillées, téléchargements HD/4K, playlists IA et plus encore.'
    },
    {
      icon: Users,
      title: 'Communauté VIP',
      description: 'Rejoignez des communautés premium exclusives et rencontrez vos créateurs favoris.'
    },
    {
      icon: Crown,
      title: 'Badge de reconnaissance',
      description: 'Affichez votre statut premium avec un badge unique visible par tous.'
    }
  ];

  const comparisonFeatures = [
    { feature: 'Publicités', free: 'Oui', premium: 'Aucune', platine: 'Aucune', gold: 'Aucune' },
    { feature: 'Qualité vidéo max', free: '1080p', premium: '1080p HD', platine: '4K', gold: '4K' },
    { feature: 'Téléchargements', free: 'Non', premium: '10/mois', platine: '50/mois', gold: 'Illimités' },
    { feature: 'Badge visible', free: 'Non', premium: 'Premium', platine: 'Platine animé', gold: 'Gold prestigieux' },
    { feature: 'Support', free: 'Standard', premium: 'Prioritaire', platine: 'Prioritaire', gold: 'Dédié 24/7' },
    { feature: 'Contenus exclusifs', free: 'Non', premium: 'Oui', platine: 'Oui + Live', gold: 'Oui + VIP' },
    { feature: 'Playlists IA', free: 'Non', premium: 'Non', platine: 'Oui', gold: 'Oui' },
    { feature: 'Statistiques', free: 'Non', premium: 'Non', platine: 'Avancées', gold: 'Avancées' },
    { feature: 'Accès créateurs', free: 'Non', premium: 'Non', platine: 'Non', gold: 'VIP exclusif' },
    { feature: 'Participation décisions', free: 'Non', premium: 'Non', platine: 'Non', gold: 'Oui' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12 mt-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Passez à Goroti Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une expérience vidéo sans compromis. Soutenez vos créateurs préférés et débloquez des fonctionnalités exclusives.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Pourquoi passer Premium?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyPremiumReasons.map((reason, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <reason.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 rounded-full p-1 inline-flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                -16%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const price = getPrice(tier);
            const savings = getSavings(tier);

            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  tier.popular ? 'ring-4 ring-purple-500' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-bold">
                    LE PLUS POPULAIRE
                  </div>
                )}
                <div className={`p-8 ${tier.popular ? 'pt-16' : ''}`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${tier.gradient} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {price.toFixed(2)}€
                    </span>
                    <span className="text-gray-600">/mois</span>
                    {billingPeriod === 'annual' && (
                      <div className="text-sm text-green-600 font-semibold mt-2">
                        Économisez {savings.toFixed(2)}€/an
                      </div>
                    )}
                    {billingPeriod === 'annual' && (
                      <div className="text-xs text-gray-500 mt-1">
                        Facturé {tier.annualPrice}€ annuellement
                      </div>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      if (!user) {
                        window.location.hash = 'auth';
                      }
                    }}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                      tier.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        : `bg-gradient-to-r ${tier.gradient} text-white hover:opacity-90`
                    }`}
                  >
                    {user ? 'S\'abonner' : 'Se connecter pour s\'abonner'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Comparaison détaillée
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Fonctionnalité</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Gratuit</th>
                  <th className="text-center py-4 px-4 font-bold text-blue-600">Premium</th>
                  <th className="text-center py-4 px-4 font-bold text-purple-600">Platine</th>
                  <th className="text-center py-4 px-4 font-bold text-yellow-600">Gold</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{row.free}</td>
                    <td className="py-4 px-4 text-center">
                      {row.premium === 'Non' || row.premium === 'Aucune' ? (
                        <X className="w-5 h-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-blue-600 font-semibold">{row.premium}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-purple-600 font-semibold">{row.platine}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-yellow-600 font-semibold">{row.gold}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Transparence totale</h2>
          <p className="text-xl mb-6 opacity-90">
            70% de votre abonnement va directement aux créateurs que vous regardez
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">70%</div>
              <div className="text-sm opacity-90">Aux créateurs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-sm opacity-90">Infrastructure & support</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">5%</div>
              <div className="text-sm opacity-90">Développement plateforme</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
