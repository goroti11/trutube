import { useState, useEffect } from 'react';
import { Check, Sparkles, Crown, Zap, Shield, TrendingUp, BarChart3, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PremiumTier {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: Record<string, any>;
  display_order: number;
}

interface PremiumOffersPageProps {
  onNavigate: (page: string) => void;
}

export default function PremiumOffersPage({ onNavigate }: PremiumOffersPageProps) {
  const { user } = useAuth();
  const [tiers, setTiers] = useState<PremiumTier[]>([]);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_tiers')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setTiers(data || []);
    } catch (error) {
      console.error('Erreur chargement tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (tier: PremiumTier) => {
    const price = billingPeriod === 'monthly' ? tier.price_monthly : tier.price_yearly;
    const period = billingPeriod === 'monthly' ? '/mois' : '/an';

    if (price === 0) return 'Gratuit';
    return `${price.toFixed(2)}€${period}`;
  };

  const getSavings = (tier: PremiumTier) => {
    if (billingPeriod === 'monthly' || tier.price_monthly === 0) return null;
    const monthlyCost = tier.price_monthly * 12;
    const yearlyCost = tier.price_yearly;
    const savings = monthlyCost - yearlyCost;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  const getTierIcon = (slug: string) => {
    switch (slug) {
      case 'free': return Sparkles;
      case 'gold': return Crown;
      case 'platinum': return Zap;
      default: return Sparkles;
    }
  };

  const getTierColor = (slug: string) => {
    switch (slug) {
      case 'free': return 'from-gray-600 to-gray-800';
      case 'gold': return 'from-yellow-600 to-yellow-800';
      case 'platinum': return 'from-purple-600 to-purple-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="min-h-screen bg-gray-950 text-white pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              Devenez Premium
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Débloquez tout le potentiel de TruTube avec nos offres Premium
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-2 bg-gray-900 rounded-full">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  billingPeriod === 'yearly'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Annuel
                <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  -17%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 mt-4">Chargement des offres...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {tiers.map((tier) => {
                const Icon = getTierIcon(tier.slug);
                const savings = getSavings(tier);
                const isPopular = tier.slug === 'gold';
                const isPremium = tier.slug === 'platinum';

                return (
                  <div
                    key={tier.id}
                    className={`relative rounded-2xl overflow-hidden ${
                      isPopular || isPremium ? 'ring-2 ring-red-600' : ''
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 inset-x-0 py-2 bg-red-600 text-center text-sm font-bold">
                        PLUS POPULAIRE
                      </div>
                    )}
                    {isPremium && (
                      <div className="absolute top-0 inset-x-0 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-center text-sm font-bold">
                        MEILLEURE VALEUR
                      </div>
                    )}

                    <div className={`bg-gradient-to-br ${getTierColor(tier.slug)} p-8 ${isPopular || isPremium ? 'pt-14' : ''}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{tier.name}</h3>
                          <p className="text-sm opacity-80">{tier.description}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-4xl font-bold mb-1">
                          {getPrice(tier)}
                        </div>
                        {savings && (
                          <p className="text-sm text-green-300">
                            Économisez {savings.amount.toFixed(2)}€ ({savings.percentage}%)
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (tier.slug === 'free') {
                            onNavigate('auth');
                          } else {
                            alert('Intégration paiement Stripe à venir');
                          }
                        }}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${
                          tier.slug === 'free'
                            ? 'bg-white/10 hover:bg-white/20'
                            : 'bg-white text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {tier.slug === 'free' ? 'Commencer gratuitement' : 'Passer à ' + tier.name}
                      </button>
                    </div>

                    <div className="bg-gray-900 p-8">
                      <h4 className="font-bold mb-4">Inclus:</h4>
                      <ul className="space-y-3">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {tier.limits && (
                        <div className="mt-6 pt-6 border-t border-gray-800">
                          <h4 className="font-bold mb-3 text-sm text-gray-400">Limites:</h4>
                          <div className="space-y-2 text-sm text-gray-400">
                            {tier.limits.upload_size_mb && (
                              <p>Upload: {tier.limits.upload_size_mb}MB max</p>
                            )}
                            {tier.limits.storage_gb && (
                              <p>Stockage: {tier.limits.storage_gb}GB</p>
                            )}
                            {tier.limits.videos_per_month && tier.limits.videos_per_month > 0 && (
                              <p>Vidéos: {tier.limits.videos_per_month}/mois</p>
                            )}
                            {tier.limits.videos_per_month === -1 && (
                              <p className="text-green-500 font-semibold">Vidéos illimitées</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Features Comparison */}
          <div className="bg-gray-900 rounded-2xl p-8 mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Comparaison détaillée</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Shield}
                title="Sécurité maximale"
                description="Protection anti-fake views et analytics 100% authentiques"
                color="text-blue-500"
              />
              <FeatureCard
                icon={TrendingUp}
                title="Analytics avancés"
                description="Statistiques détaillées et insights en temps réel"
                color="text-green-500"
              />
              <FeatureCard
                icon={BarChart3}
                title="Monétisation"
                description="Débloquez tous les canaux de revenus"
                color="text-yellow-500"
              />
              <FeatureCard
                icon={Zap}
                title="Recherche IA"
                description="Powered by ChatGPT-4.2 (Platinum uniquement)"
                color="text-purple-500"
              />
              <FeatureCard
                icon={MessageSquare}
                title="Support prioritaire"
                description="Assistance rapide et dédiée"
                color="text-pink-500"
              />
              <FeatureCard
                icon={Crown}
                title="Badges exclusifs"
                description="Badge Gold ou Platinum sur votre profil"
                color="text-yellow-500"
              />
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Questions fréquentes</h2>
            <div className="space-y-4">
              <FAQItem
                question="Puis-je changer d'offre à tout moment ?"
                answer="Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment. Les changements prennent effet immédiatement."
              />
              <FAQItem
                question="Y a-t-il un engagement ?"
                answer="Non, tous nos abonnements sont sans engagement. Vous pouvez annuler à tout moment."
              />
              <FAQItem
                question="Que se passe-t-il si j'annule ?"
                answer="Vous conservez l'accès Premium jusqu'à la fin de votre période de facturation, puis votre compte repasse en Free."
              />
              <FAQItem
                question="Les paiements sont-ils sécurisés ?"
                answer="Oui, tous les paiements sont traités via Stripe, leader mondial du paiement en ligne sécurisé."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  return (
    <div className="p-6 bg-gray-950 rounded-xl hover:ring-2 ring-red-600 transition-all">
      <Icon className={`w-8 h-8 ${color} mb-4`} />
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
      >
        <span className="font-semibold">{question}</span>
        <span className="text-2xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-gray-400">
          {answer}
        </div>
      )}
    </div>
  );
}
