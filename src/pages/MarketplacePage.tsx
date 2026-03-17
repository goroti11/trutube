import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Star, Briefcase, Music, Video, Palette, TrendingUp, Scale,
  Award, CheckCircle, Users, ArrowRight, Filter, ShoppingBag
} from 'lucide-react';
import { marketplaceService, MarketplaceService, ProviderProfile, CATEGORY_LABELS, MarketplaceCategory } from '../services/marketplaceService';

const CATEGORY_ICONS: Record<MarketplaceCategory, typeof Music> = {
  music_production: Music,
  video: Video,
  branding: Palette,
  marketing: TrendingUp,
  legal: Scale,
};

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [featuredServices, setFeaturedServices] = useState<MarketplaceService[]>([]);
  const [topProviders, setTopProviders] = useState<ProviderProfile[]>([]);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory | null>(null);

  useEffect(() => {
    loadMarketplaceHome();
  }, []);

  async function loadMarketplaceHome() {
    try {
      setLoading(true);
      const data = await marketplaceService.getMarketplaceHome(12);
      setFeaturedServices(data.featured_services || []);
      setTopProviders(data.top_providers || []);
      setCategories(data.categories || {});
    } catch (error) {
      console.error('Error loading marketplace:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/marketplace/search?${params.toString()}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement du Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-950/40 border border-red-800/50 text-red-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <ShoppingBag className="w-4 h-4" />
            Marketplace Professionnel
          </div>
          <h1 className="text-5xl font-black mb-4">
            Les meilleurs experts pour créateurs
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Services professionnels en production musicale, vidéo, branding, marketing et juridique.
            Paiement sécurisé et livraison garantie.
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher un service : mix & master, montage clip, logo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-colors"
              >
                Rechercher
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-black mb-8">Catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(Object.keys(CATEGORY_LABELS) as MarketplaceCategory[]).map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const count = categories[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    navigate(`/marketplace/search?category=${cat}`);
                  }}
                  className="bg-gray-900 border border-gray-800 hover:border-red-600 rounded-2xl p-6 transition-all group"
                >
                  <Icon className="w-10 h-10 text-red-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold mb-1">{CATEGORY_LABELS[cat]}</h3>
                  <p className="text-sm text-gray-500">{count} services</p>
                </button>
              );
            })}
          </div>
        </section>

        {featuredServices.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black">Services en vedette</h2>
              <button
                onClick={() => navigate('/marketplace/search?featured=true')}
                className="text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors"
              >
                Voir tout
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.slice(0, 6).map((service) => (
                <ServiceCard key={service.id} service={service} onClick={() => navigate(`/marketplace/services/${service.id}`)} />
              ))}
            </div>
          </section>
        )}

        {topProviders.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black">Prestataires certifiés</h2>
              <button
                onClick={() => navigate('/marketplace/providers')}
                className="text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors"
              >
                Voir tout
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {topProviders.slice(0, 12).map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => navigate(`/marketplace/providers/${provider.user_id}`)}
                  className="bg-gray-900 border border-gray-800 hover:border-red-600 rounded-2xl p-4 transition-all text-center group"
                >
                  <img
                    src={provider.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100'}
                    alt={provider.display_name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <h3 className="font-bold text-sm truncate">{provider.display_name}</h3>
                    {provider.is_verified && <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                    {provider.is_pro && <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 mb-2 truncate">{provider.tagline}</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-white">{provider.average_rating.toFixed(1)}</span>
                    <span>({provider.total_reviews})</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-red-950/40 to-gray-900 border border-red-800/50 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-3xl font-black mb-4">Devenez prestataire</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Rejoignez le Marketplace Goroti et proposez vos services à des milliers de créateurs.
            Profil vérifié, paiement sécurisé en escrow, commission transparente de 10%.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Profil vérifié
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Paiement escrow
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              10% commission
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Protection juridique
            </div>
          </div>
          <button
            onClick={() => navigate('/marketplace/become-provider')}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center gap-2 transition-colors"
          >
            Commencer maintenant
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      </div>
    </div>
  );
}

function ServiceCard({ service, onClick }: { service: MarketplaceService; onClick: () => void }) {
  const Icon = CATEGORY_ICONS[service.category];
  const provider = service.provider;

  return (
    <button
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 hover:border-red-600 rounded-2xl overflow-hidden transition-all text-left group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.cover_image_url || 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?w=400'}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-900/80 border border-gray-700 flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-red-400" />
            {service.subcategory || CATEGORY_LABELS[service.category]}
          </span>
        </div>
      </div>

      <div className="p-5">
        {provider && (
          <div className="flex items-center gap-2 mb-3">
            <img
              src={provider.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=100'}
              alt={provider.display_name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-300">{provider.display_name}</span>
            {provider.is_verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
            {provider.is_pro && <Award className="w-4 h-4 text-amber-400" />}
          </div>
        )}

        <h3 className="font-bold leading-snug mb-2 line-clamp-2 group-hover:text-red-300 transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{service.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-medium text-white">{service.average_rating.toFixed(1)}</span>
              <span>({service.total_reviews})</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-500" />
              {service.total_orders}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">À partir de</p>
            <p className="font-bold text-white">{service.price_basic}€</p>
          </div>
        </div>
      </div>
    </button>
  );
}
