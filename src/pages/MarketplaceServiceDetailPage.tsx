import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, Clock, MessageCircle, ArrowLeft, CheckCircle, Award, Shield,
  TrendingUp, Package, Users
} from 'lucide-react';
import { marketplaceService, MarketplaceService } from '../services/marketplaceService';
import { useAuth } from '../contexts/AuthContext';

export default function MarketplaceServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState<MarketplaceService | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [requirements, setRequirements] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  async function loadService() {
    try {
      setLoading(true);
      const data = await marketplaceService.getService(serviceId!);
      setService(data);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleOrder() {
    if (!user || !service) return;

    try {
      setOrdering(true);
      const price = getTierPrice(selectedTier);

      const result = await marketplaceService.createOrderWithRpc(
        service.id,
        user.id,
        selectedTier,
        price,
        'card',
        price,
        0,
        requirements
      );

      if (result?.success) {
        navigate(`/marketplace/orders/${result.order_id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setOrdering(false);
    }
  }

  function getTierPrice(tier: 'basic' | 'standard' | 'premium'): number {
    if (!service) return 0;
    if (tier === 'basic') return service.price_basic;
    if (tier === 'standard') return service.price_standard ?? service.price_basic;
    return service.price_premium ?? service.price_standard ?? service.price_basic;
  }

  function getTierDays(tier: 'basic' | 'standard' | 'premium'): number {
    if (!service) return 0;
    if (tier === 'basic') return service.delivery_days_basic;
    if (tier === 'standard') return service.delivery_days_standard ?? service.delivery_days_basic;
    return service.delivery_days_premium ?? service.delivery_days_standard ?? service.delivery_days_basic;
  }

  function getTierRevisions(tier: 'basic' | 'standard' | 'premium'): number {
    if (!service) return 0;
    if (tier === 'basic') return service.revisions_basic;
    if (tier === 'standard') return service.revisions_standard ?? service.revisions_basic;
    return service.revisions_premium ?? service.revisions_standard ?? service.revisions_basic;
  }

  function getTierIncludes(tier: 'basic' | 'standard' | 'premium'): string {
    if (!service) return '';
    if (tier === 'basic') return service.includes_basic;
    if (tier === 'standard') return service.includes_standard || service.includes_basic;
    return service.includes_premium || service.includes_standard || service.includes_basic;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Service non trouvé</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Retour au Marketplace
          </button>
        </div>
      </div>
    );
  }

  const provider = service.provider;
  const price = getTierPrice(selectedTier);
  const days = getTierDays(selectedTier);
  const revisions = getTierRevisions(selectedTier);
  const includes = getTierIncludes(selectedTier);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-2xl overflow-hidden h-80">
              <img
                src={service.cover_image_url || 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?w=800'}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 to-transparent" />
            </div>

            <div>
              <h1 className="text-3xl font-black mb-4">{service.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-white font-medium">{service.average_rating.toFixed(1)}</span>
                  ({service.total_reviews} avis)
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  {service.total_orders} commandes
                </span>
              </div>

              {provider && (
                <div className="bg-gray-900 rounded-2xl p-6 flex items-center gap-4 mb-6">
                  <img
                    src={provider.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100'}
                    alt={provider.display_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{provider.display_name}</h3>
                      {provider.is_verified && <CheckCircle className="w-5 h-5 text-blue-400" />}
                      {provider.is_pro && <Award className="w-5 h-5 text-amber-400" />}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{provider.tagline}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{provider.experience_years} ans d'expérience</span>
                      <span>{provider.on_time_delivery_rate}% livraison à temps</span>
                      <span>{provider.response_rate}% de réponse</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/marketplace/providers/${provider.user_id}`)}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Voir le profil
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>

            {service.requirements && (
              <div className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Informations requises</h2>
                <p className="text-gray-400">{service.requirements}</p>
              </div>
            )}

            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <Shield className="w-5 h-5" />
                <h2 className="text-xl font-bold">Protection Acheteur</h2>
              </div>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  Paiement sécurisé en escrow jusqu'à validation
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  Révisions incluses selon la formule choisie
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  Médiation Goroti en cas de litige
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  Remboursement garanti selon conditions
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden sticky top-8">
              <div className="flex border-b border-gray-800">
                {(['basic', 'standard', 'premium'] as const).filter((tier) =>
                  tier === 'basic' || (tier === 'standard' && service.price_standard) || (tier === 'premium' && service.price_premium)
                ).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                      selectedTier === tier
                        ? 'bg-red-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tier === 'basic' ? 'Essentiel' : tier === 'standard' ? 'Standard' : 'Premium'}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="text-4xl font-black mb-1">{price}€</div>
                  <p className="text-sm text-gray-500">{service.currency}</p>
                </div>

                <p className="text-gray-300">{includes}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Livraison en {days} jours
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    {revisions} révision{revisions > 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    Commission plateforme : 10%
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Vos besoins (optionnel)
                  </label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Décrivez votre projet, vos attentes..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleOrder}
                  disabled={!user || ordering}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors"
                >
                  {!user ? 'Connectez-vous pour commander' : ordering ? 'Commande en cours...' : 'Commander maintenant'}
                </button>

                <p className="text-xs text-center text-gray-500">
                  Paiement sécurisé • Remboursable selon conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
