import { useState, useEffect } from 'react';
import {
  Search, Filter, Star, Clock, Award, CheckCircle, Briefcase, Music,
  Video, Palette, TrendingUp, Scale, ChevronRight, Users, Zap,
  SlidersHorizontal, ArrowRight, Shield, MessageCircle, Package, X
} from 'lucide-react';
import { marketplaceService, MarketplaceCategory, MarketplaceService, ProviderProfile, CATEGORY_LABELS, CATEGORY_SUBCATEGORIES } from '../services/marketplaceService';
import { useAuth } from '../contexts/AuthContext';

interface MusicMarketplacePageProps {
  onNavigate?: (page: string, params?: Record<string, string>) => void;
}

const CATEGORY_ICONS: Record<MarketplaceCategory, typeof Music> = {
  music_production: Music,
  video: Video,
  branding: Palette,
  marketing: TrendingUp,
  legal: Scale,
};

const CATEGORY_COLORS: Record<MarketplaceCategory, string> = {
  music_production: 'text-rose-400 bg-rose-950/40 border-rose-800/50',
  video: 'text-blue-400 bg-blue-950/40 border-blue-800/50',
  branding: 'text-amber-400 bg-amber-950/40 border-amber-800/50',
  marketing: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
  legal: 'text-gray-300 bg-gray-800/60 border-gray-700',
};

const MOCK_SERVICES: MarketplaceService[] = [
  {
    id: '1', provider_id: 'p1', user_id: 'u1',
    title: 'Mix & Master professionnel pour votre single',
    description: 'Service complet de mixage et mastering pour artistes indépendants. Rendu en 48h, 2 révisions incluses.',
    category: 'music_production', subcategory: 'Mix & Master',
    tags: ['mix', 'master', 'single', 'album'],
    price_basic: 149, price_standard: 249, price_premium: 399, currency: 'EUR',
    delivery_days_basic: 5, delivery_days_standard: 3, delivery_days_premium: 1,
    revisions_basic: 2, revisions_standard: 4, revisions_premium: 8,
    includes_basic: 'Mix stéréo + Master', includes_standard: 'Mix stem + Master HD', includes_premium: 'Mix + Master + Session Skype',
    cover_image_url: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?w=400',
    gallery_images: [], sample_work_url: '',
    requirements: 'Stems séparés en 24bit/48kHz',
    total_orders: 124, total_revenue: 18500, average_rating: 4.9, total_reviews: 87,
    is_featured: true, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    provider: {
      id: 'p1', user_id: 'u1', display_name: 'Studio Noir', tagline: 'Mix & Master Paris',
      bio: '', avatar_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100',
      portfolio_images: [], portfolio_urls: [],
      primary_category: 'music_production', secondary_categories: [], specializations: ['hip-hop', 'r&b', 'pop'],
      languages: ['fr', 'en'], experience_years: 8, expertise_level: 'expert',
      is_verified: true, verified_at: null, is_pro: true, pro_subscription_ends_at: null,
      identity_verified: true, identity_verified_at: null,
      total_orders: 124, completed_orders: 119, cancelled_orders: 2, average_rating: 4.9, total_reviews: 87,
      total_revenue: 18500, response_rate: 98, on_time_delivery_rate: 97,
      is_available: true, away_until: null, max_active_orders: 5, is_active: true,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
  },
  {
    id: '2', provider_id: 'p2', user_id: 'u2',
    title: 'Montage clip musical – direction artistique complète',
    description: 'Montage professionnel de vos clips avec motion design, color grading et sous-titres. Portfolio disponible.',
    category: 'video', subcategory: 'Montage Vidéo',
    tags: ['clip', 'montage', 'color-grading', 'motion'],
    price_basic: 299, price_standard: 499, price_premium: 899, currency: 'EUR',
    delivery_days_basic: 7, delivery_days_standard: 5, delivery_days_premium: 3,
    revisions_basic: 2, revisions_standard: 3, revisions_premium: 6,
    includes_basic: 'Montage + export HD', includes_standard: '+ Color grading + sous-titres', includes_premium: '+ Motion design + version courte réseaux',
    cover_image_url: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?w=400',
    gallery_images: [], sample_work_url: '',
    requirements: 'Fichiers bruts + brief artistique',
    total_orders: 56, total_revenue: 22400, average_rating: 4.8, total_reviews: 41,
    is_featured: true, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    provider: {
      id: 'p2', user_id: 'u2', display_name: 'Visuals by Noa', tagline: 'Réalisatrice & Monteuse',
      bio: '', avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
      portfolio_images: [], portfolio_urls: [],
      primary_category: 'video', secondary_categories: [], specializations: ['clip', 'live', 'docu'],
      languages: ['fr'], experience_years: 5, expertise_level: 'expert',
      is_verified: true, verified_at: null, is_pro: true, pro_subscription_ends_at: null,
      identity_verified: true, identity_verified_at: null,
      total_orders: 56, completed_orders: 54, cancelled_orders: 0, average_rating: 4.8, total_reviews: 41,
      total_revenue: 22400, response_rate: 99, on_time_delivery_rate: 96,
      is_available: true, away_until: null, max_active_orders: 3, is_active: true,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
  },
  {
    id: '3', provider_id: 'p3', user_id: 'u3',
    title: 'Identité visuelle artiste – Logo, cover, merch',
    description: 'Création complète de votre identité visuelle : logo, cover album, templates réseaux sociaux et designs pour merch.',
    category: 'branding', subcategory: 'Identité Visuelle',
    tags: ['logo', 'cover-art', 'identité', 'merch'],
    price_basic: 199, price_standard: 349, price_premium: 599, currency: 'EUR',
    delivery_days_basic: 7, delivery_days_standard: 5, delivery_days_premium: 3,
    revisions_basic: 3, revisions_standard: 5, revisions_premium: 10,
    includes_basic: 'Logo + 3 variations', includes_standard: '+ Cover album + templates IG', includes_premium: '+ Kit merch complet + charte graphique',
    cover_image_url: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?w=400',
    gallery_images: [], sample_work_url: '',
    requirements: 'Moodboard + références',
    total_orders: 89, total_revenue: 28900, average_rating: 5.0, total_reviews: 67,
    is_featured: false, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    provider: {
      id: 'p3', user_id: 'u3', display_name: 'Aya Design', tagline: 'Graphic Design Artiste',
      bio: '', avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
      portfolio_images: [], portfolio_urls: [],
      primary_category: 'branding', secondary_categories: [], specializations: ['hip-hop', 'electronic', 'pop'],
      languages: ['fr', 'en'], experience_years: 6, expertise_level: 'pro',
      is_verified: true, verified_at: null, is_pro: true, pro_subscription_ends_at: null,
      identity_verified: true, identity_verified_at: null,
      total_orders: 89, completed_orders: 88, cancelled_orders: 0, average_rating: 5.0, total_reviews: 67,
      total_revenue: 28900, response_rate: 100, on_time_delivery_rate: 99,
      is_available: true, away_until: null, max_active_orders: 4, is_active: true,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
  },
  {
    id: '4', provider_id: 'p4', user_id: 'u4',
    title: 'Stratégie de lancement album – plan complet',
    description: 'Stratégie digitale complète pour le lancement de votre album ou single : planning, contenu réseaux, campagnes ads, presse.',
    category: 'marketing', subcategory: 'Stratégie Lancement',
    tags: ['lancement', 'stratégie', 'réseaux', 'campagne'],
    price_basic: 399, price_standard: 699, price_premium: 1299, currency: 'EUR',
    delivery_days_basic: 10, delivery_days_standard: 7, delivery_days_premium: 5,
    revisions_basic: 2, revisions_standard: 3, revisions_premium: 5,
    includes_basic: 'Planning + 15 posts', includes_standard: '+ Ads setup + press kit', includes_premium: '+ Gestion campagne 30j + reporting',
    cover_image_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=400',
    gallery_images: [], sample_work_url: '',
    requirements: 'Brief artistique + date de sortie',
    total_orders: 34, total_revenue: 19600, average_rating: 4.7, total_reviews: 28,
    is_featured: false, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    provider: {
      id: 'p4', user_id: 'u4', display_name: 'LaunchPad Agency', tagline: 'Marketing Musical',
      bio: '', avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=100',
      portfolio_images: [], portfolio_urls: [],
      primary_category: 'marketing', secondary_categories: [], specializations: ['digital', 'presse', 'ads'],
      languages: ['fr', 'en'], experience_years: 7, expertise_level: 'pro',
      is_verified: true, verified_at: null, is_pro: false, pro_subscription_ends_at: null,
      identity_verified: true, identity_verified_at: null,
      total_orders: 34, completed_orders: 32, cancelled_orders: 1, average_rating: 4.7, total_reviews: 28,
      total_revenue: 19600, response_rate: 95, on_time_delivery_rate: 94,
      is_available: true, away_until: null, max_active_orders: 3, is_active: true,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
  },
  {
    id: '5', provider_id: 'p5', user_id: 'u5',
    title: 'Contrat artiste-label + dépôt SACEM',
    description: 'Rédaction de contrats adaptés aux artistes indépendants, dépôt SACEM, conseil sur royalties et protection de droits.',
    category: 'legal', subcategory: 'Contrats Artistes',
    tags: ['contrat', 'sacem', 'droits', 'royalties'],
    price_basic: 249, price_standard: 449, price_premium: 799, currency: 'EUR',
    delivery_days_basic: 5, delivery_days_standard: 3, delivery_days_premium: 2,
    revisions_basic: 1, revisions_standard: 2, revisions_premium: 3,
    includes_basic: 'Contrat type personnalisé', includes_standard: '+ Dépôt SACEM + conseil 1h', includes_premium: '+ Suivi 3 mois + négociation',
    cover_image_url: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?w=400',
    gallery_images: [], sample_work_url: '',
    requirements: 'Situation artistique + objectifs',
    total_orders: 45, total_revenue: 17550, average_rating: 4.8, total_reviews: 39,
    is_featured: false, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    provider: {
      id: 'p5', user_id: 'u5', display_name: 'Maître Delon', tagline: 'Avocat Droit Musical',
      bio: '', avatar_url: 'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?w=100',
      portfolio_images: [], portfolio_urls: [],
      primary_category: 'legal', secondary_categories: [], specializations: ['droits', 'contrats', 'sacem'],
      languages: ['fr'], experience_years: 12, expertise_level: 'pro',
      is_verified: true, verified_at: null, is_pro: true, pro_subscription_ends_at: null,
      identity_verified: true, identity_verified_at: null,
      total_orders: 45, completed_orders: 44, cancelled_orders: 0, average_rating: 4.8, total_reviews: 39,
      total_revenue: 17550, response_rate: 97, on_time_delivery_rate: 98,
      is_available: true, away_until: null, max_active_orders: 5, is_active: true,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
  },
];

export default function MusicMarketplacePage({ onNavigate }: MusicMarketplacePageProps) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<MarketplaceService | null>(null);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [services, setServices] = useState<MarketplaceService[]>(MOCK_SERVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'orders'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [filterSubcategory, setFilterSubcategory] = useState('');
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categories = (Object.keys(CATEGORY_LABELS) as MarketplaceCategory[]);

  const filtered = services.filter(s => {
    if (selectedCategory && s.category !== selectedCategory) return false;
    if (filterSubcategory && s.subcategory !== filterSubcategory) return false;
    if (filterMinRating > 0 && s.average_rating < filterMinRating) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.includes(q));
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.average_rating - a.average_rating;
    if (sortBy === 'price') return a.price_basic - b.price_basic;
    return b.total_orders - a.total_orders;
  });

  function getTierPrice(svc: MarketplaceService, tier: 'basic' | 'standard' | 'premium') {
    if (tier === 'basic') return svc.price_basic;
    if (tier === 'standard') return svc.price_standard ?? svc.price_basic;
    return svc.price_premium ?? svc.price_standard ?? svc.price_basic;
  }

  function getTierDays(svc: MarketplaceService, tier: 'basic' | 'standard' | 'premium') {
    if (tier === 'basic') return svc.delivery_days_basic;
    if (tier === 'standard') return svc.delivery_days_standard ?? svc.delivery_days_basic;
    return svc.delivery_days_premium ?? svc.delivery_days_standard ?? svc.delivery_days_basic;
  }

  function getTierRevisions(svc: MarketplaceService, tier: 'basic' | 'standard' | 'premium') {
    if (tier === 'basic') return svc.revisions_basic;
    if (tier === 'standard') return svc.revisions_standard ?? svc.revisions_basic;
    return svc.revisions_premium ?? svc.revisions_standard ?? svc.revisions_basic;
  }

  function getTierIncludes(svc: MarketplaceService, tier: 'basic' | 'standard' | 'premium') {
    if (tier === 'basic') return svc.includes_basic;
    if (tier === 'standard') return svc.includes_standard || svc.includes_basic;
    return svc.includes_premium || svc.includes_standard || svc.includes_basic;
  }

  async function handleOrder() {
    if (!user || !selectedService) return;
    await new Promise(r => setTimeout(r, 1000));
    setOrderPlaced(true);
  }

  if (selectedService) {
    const p = selectedService.provider;
    const tierPrice = getTierPrice(selectedService, selectedTier);
    const tierDays = getTierDays(selectedService, selectedTier);
    const tierRevisions = getTierRevisions(selectedService, selectedTier);
    const tierIncludes = getTierIncludes(selectedService, selectedTier);

    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button
            onClick={() => { setSelectedService(null); setOrderPlaced(false); }}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <X className="w-4 h-4" />
            Retour au Marketplace
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative rounded-2xl overflow-hidden h-64">
                <img src={selectedService.cover_image_url} alt={selectedService.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[selectedService.category]}`}>
                    {CATEGORY_LABELS[selectedService.category]}
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold mb-2">{selectedService.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    {selectedService.average_rating.toFixed(1)}
                  </span>
                  <span>({selectedService.total_reviews} avis)</span>
                  <span>{selectedService.total_orders} commandes</span>
                </div>
              </div>

              {p && (
                <div className="bg-gray-900 rounded-2xl p-5 flex items-center gap-4">
                  <img src={p.avatar_url} alt={p.display_name} className="w-14 h-14 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{p.display_name}</p>
                      {p.is_verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                      {p.is_pro && <Award className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-sm text-gray-400">{p.tagline}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{p.experience_years} ans d'exp.</span>
                      <span>·</span>
                      <span>{p.on_time_delivery_rate}% dans les délais</span>
                      <span>·</span>
                      <span>{p.response_rate}% réponse</span>
                    </div>
                  </div>
                  <button className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                    Contacter
                  </button>
                </div>
              )}

              <div className="bg-gray-900 rounded-2xl p-6">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{selectedService.description}</p>
                {selectedService.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedService.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <h3 className="font-semibold mb-1">Ce dont vous avez besoin fournir</h3>
                <p className="text-gray-400 text-sm">{selectedService.requirements || 'Le prestataire vous contactera pour préciser les besoins.'}</p>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm font-medium mb-4">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Protection acheteur GOROTI
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />Paiement bloqué en escrow jusqu'à votre validation</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />Arbitrage GOROTI en cas de litige</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />Historique des échanges conservé</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />Contrat numérique intégré</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {orderPlaced ? (
                <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-7 h-7 text-emerald-400" />
                  </div>
                  <p className="font-bold text-emerald-300 text-lg mb-2">Commande confirmée !</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Votre paiement est sécurisé en escrow. Le prestataire a été notifié.
                  </p>
                  <div className="bg-gray-800 rounded-xl p-3 text-left text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prestataire</span>
                      <span>{selectedService.provider?.display_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Offre</span>
                      <span className="capitalize">{selectedTier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Délai</span>
                      <span>{tierDays} jours</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-400">Total</span>
                      <span>{tierPrice}€</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedService(null); setOrderPlaced(false); }}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors text-sm"
                  >
                    Voir mes commandes
                  </button>
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="flex border-b border-gray-800">
                    {(['basic', 'standard', 'premium'] as const).filter(t =>
                      t === 'basic' || (t === 'standard' && selectedService.price_standard) || (t === 'premium' && selectedService.price_premium)
                    ).map(tier => (
                      <button
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                          selectedTier === tier ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tier === 'basic' ? 'Essentiel' : tier === 'standard' ? 'Standard' : 'Premium'}
                      </button>
                    ))}
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-bold">{getTierPrice(selectedService, selectedTier)}€</span>
                      <span className="text-sm text-gray-400">{selectedService.currency}</span>
                    </div>

                    <p className="text-sm text-gray-300">{getTierIncludes(selectedService, selectedTier)}</p>

                    <div className="flex gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {getTierDays(selectedService, selectedTier)}j de livraison
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        {getTierRevisions(selectedService, selectedTier)} révisions
                      </span>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-3 text-xs text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Service</span>
                        <span>{getTierPrice(selectedService, selectedTier)}€</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Commission plateforme (10%)</span>
                        <span>{(getTierPrice(selectedService, selectedTier) * 0.10).toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between font-semibold text-white border-t border-gray-700 pt-1 mt-1">
                        <span>Total</span>
                        <span>{getTierPrice(selectedService, selectedTier)}€</span>
                      </div>
                    </div>

                    <button
                      onClick={handleOrder}
                      disabled={!user}
                      className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      {user ? 'Commander maintenant' : 'Connectez-vous'}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-xs text-center text-gray-500">
                      Paiement sécurisé · Remboursable en cas de litige
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-950/40 border border-red-800/50 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            GOROTI Marketplace
          </div>
          <h1 className="text-4xl font-bold mb-3">Les professionnels de la création</h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Trouvez les meilleurs experts en musique, vidéo, branding, marketing et droit.
            Spécialisés pour les artistes et créateurs.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Ex : mix & master, montage clip, cover art..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat];
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isActive ? null : cat)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  isActive
                    ? CATEGORY_COLORS[cat] + ' border-opacity-100'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? '' : 'text-gray-500'}`} />
                <span className="text-xs font-medium text-center leading-tight">{CATEGORY_LABELS[cat]}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">
            <span className="font-semibold text-white">{filtered.length}</span> prestataires disponibles
            {selectedCategory && ` en ${CATEGORY_LABELS[selectedCategory]}`}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-red-950/30 border-red-700 text-red-400' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-gray-900 border border-gray-800 text-sm text-gray-300 rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="rating">Mieux notés</option>
              <option value="price">Prix croissant</option>
              <option value="orders">Plus commandés</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Sous-catégorie</label>
              <select
                value={filterSubcategory}
                onChange={e => setFilterSubcategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                <option value="">Toutes</option>
                {(selectedCategory ? CATEGORY_SUBCATEGORIES[selectedCategory] : Object.values(CATEGORY_SUBCATEGORIES).flat()).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Note minimum</label>
              <select
                value={filterMinRating}
                onChange={e => setFilterMinRating(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                <option value={0}>Toutes les notes</option>
                <option value={4}>4+ étoiles</option>
                <option value={4.5}>4.5+ étoiles</option>
                <option value={5}>5 étoiles uniquement</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Type de prestataire</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option>Tous</option>
                <option>Certifié Pro</option>
                <option>Vérifié GOROTI</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(svc => {
            const Icon = CATEGORY_ICONS[svc.category];
            const p = svc.provider;
            return (
              <div
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all cursor-pointer group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={svc.cover_image_url} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${CATEGORY_COLORS[svc.category]}`}>
                      <Icon className="w-3 h-3" />
                      {svc.subcategory || CATEGORY_LABELS[svc.category]}
                    </span>
                    {svc.is_featured && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-700/50 text-amber-400">
                        En vedette
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  {p && (
                    <div className="flex items-center gap-2 mb-3">
                      <img src={p.avatar_url} alt={p.display_name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-sm font-medium text-gray-300">{p.display_name}</span>
                      {p.is_verified && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                      {p.is_pro && <Award className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                  )}
                  <h3 className="font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-red-300 transition-colors">{svc.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{svc.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-medium text-white">{svc.average_rating.toFixed(1)}</span>
                        <span>({svc.total_reviews})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-500" />
                        {svc.total_orders}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">À partir de</p>
                      <p className="font-bold text-white">{svc.price_basic}€</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucun prestataire trouvé</p>
            <p className="text-sm mt-1">Essayez d'autres termes de recherche</p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-red-950/40 border border-red-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Vous êtes prestataire ?</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            Rejoignez le Marketplace GOROTI et accédez à des milliers de créateurs.
            Profil vérifié, contrats sécurisés, paiement garanti.
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            {['Profil vérifié', 'Paiement escrow', '10% commission', 'Badge Pro'].map(item => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
          <button className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-colors">
            Devenir prestataire
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
