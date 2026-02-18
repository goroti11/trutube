import { useState, useEffect } from 'react';
import {
  Lock, Play, ShoppingCart, Clock, Star, Shield, Award, ChevronRight,
  Music, Users, Globe, Tag, Check, AlertCircle, Zap, Heart, Download,
  CreditCard, Coins, ChevronDown, ChevronUp, Share2, Gift
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { musicSalesService, MusicSaleRelease, MusicSalePurchase } from '../services/musicSalesService';

interface AlbumSalePageProps {
  releaseId?: string;
  onNavigate?: (page: string) => void;
}

const PHASE_LABELS = {
  draft: { label: 'Brouillon', color: 'text-gray-400', bg: 'bg-gray-800' },
  preorder: { label: 'Précommande', color: 'text-amber-400', bg: 'bg-amber-900/30' },
  exclusive: { label: 'Exclusivité', color: 'text-rose-400', bg: 'bg-rose-900/30' },
  public: { label: 'Public', color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
  archived: { label: 'Archivé', color: 'text-gray-500', bg: 'bg-gray-900' },
};

const SALE_TYPE_LABELS = {
  lifetime: 'Accès à vie',
  limited_access: 'Accès limité',
  rental_48h: 'Location 48h',
  rental_72h: 'Location 72h',
};

export default function AlbumSalePage({ releaseId, onNavigate }: AlbumSalePageProps) {
  const { user } = useAuth();
  const [release, setRelease] = useState<MusicSaleRelease | null>(null);
  const [userPurchase, setUserPurchase] = useState<MusicSalePurchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'trucoin' | 'mixed'>('card');
  const [trucoinAmount, setTrucoinAmount] = useState(0);
  const [trucoinBalance] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [error, setError] = useState('');

  const MOCK_RELEASE: MusicSaleRelease = {
    id: 'demo-release-1',
    creator_id: 'creator-1',
    title: 'Lumières de Minuit',
    artist_name: 'Kaïros',
    label_name: 'IndieBeat Records',
    isrc: 'FR-ABC-24-00001',
    release_type: 'album',
    genre: 'R&B / Soul',
    cover_art_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Un voyage sonore entre l\'âme et la nuit. 12 titres inédits enregistrés entre Paris et Los Angeles, produits par les meilleurs producteurs de la scène indépendante.',
    rights_owned: true,
    rights_declaration_signed_at: new Date().toISOString(),
    territories_allowed: ['worldwide'],
    credits: [
      { name: 'Kaïros', role: 'Artiste principal' },
      { name: 'NightBeat', role: 'Producteur' },
      { name: 'Lisa M.', role: 'Auteur' },
    ],
    price_standard: 12.99,
    price_promo: 9.99,
    promo_starts_at: new Date().toISOString(),
    promo_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    currency: 'EUR',
    sale_type: 'lifetime',
    access_duration_days: null,
    is_bundle: false,
    bundle_items: [],
    phase: 'exclusive',
    exclusive_starts_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    exclusive_ends_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    public_release_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    preorder_enabled: false,
    preorder_price: null,
    preorder_starts_at: null,
    preorder_ends_at: null,
    is_limited_edition: true,
    limited_edition_total: 1000,
    limited_edition_sold: 347,
    total_sales: 347,
    total_revenue: 3468.53,
    platform_commission_rate: 0.15,
    video_id: null,
    preview_url: '',
    distribution_level: 'independent',
    label_mandate_verified: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  useEffect(() => {
    loadRelease();
  }, [releaseId]);

  async function loadRelease() {
    setLoading(true);
    if (releaseId) {
      const r = await musicSalesService.getRelease(releaseId);
      setRelease(r || MOCK_RELEASE);
      if (r && user) {
        const purchase = await musicSalesService.getUserPurchase(releaseId, user.id);
        setUserPurchase(purchase);
      }
    } else {
      setRelease(MOCK_RELEASE);
    }
    setLoading(false);
  }

  async function handlePurchase() {
    if (!user || !release) return;
    setPurchasing(true);
    setError('');

    const price = musicSalesService.getCurrentPrice(release);
    const cardAmt = paymentMethod === 'trucoin' ? 0 : paymentMethod === 'mixed' ? Math.max(0, price - trucoinAmount) : price;
    const tcAmt = paymentMethod === 'trucoin' ? price : paymentMethod === 'mixed' ? Math.min(trucoinAmount, price) : 0;

    if (releaseId) {
      const purchase = await musicSalesService.purchaseRelease(releaseId, user.id, {
        payment_method: paymentMethod,
        card_amount: cardAmt,
        trucoin_amount: tcAmt,
      });
      if (purchase) {
        setUserPurchase(purchase);
        setPurchaseSuccess(true);
        setShowPaymentForm(false);
      } else {
        setError('Erreur lors du paiement. Veuillez réessayer.');
      }
    } else {
      await new Promise(r => setTimeout(r, 1200));
      setPurchaseSuccess(true);
      setShowPaymentForm(false);
    }
    setPurchasing(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!release) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <p>Release introuvable</p>
      </div>
    );
  }

  const currentPrice = musicSalesService.getCurrentPrice(release);
  const discount = musicSalesService.getDiscountPercentage(release);
  const phaseInfo = PHASE_LABELS[release.phase];
  const daysUntilPublic = release.public_release_at
    ? Math.max(0, Math.ceil((new Date(release.public_release_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;
  const remainingEditions = musicSalesService.getRemainingEditions(release);
  const isAvailable = musicSalesService.isAvailableForPurchase(release);
  const hasPurchased = !!userPurchase;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="relative h-96 overflow-hidden">
        <img
          src={release.cover_art_url || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=800'}
          alt={release.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto flex items-end gap-6">
            <img
              src={release.cover_art_url || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=400'}
              alt={release.title}
              className="w-40 h-40 rounded-2xl object-cover shadow-2xl border border-white/10 hidden md:block flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${phaseInfo.bg} ${phaseInfo.color}`}>
                  {phaseInfo.label}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-widest">{release.release_type}</span>
                {release.genre && (
                  <span className="text-xs text-gray-400">{release.genre}</span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-1">{release.title}</h1>
              <div className="flex items-center gap-2 text-gray-300">
                <Music className="w-4 h-4 text-red-400" />
                <span className="font-medium">{release.artist_name}</span>
                {release.label_name && (
                  <>
                    <span className="text-gray-600">·</span>
                    <span className="text-sm text-gray-400">{release.label_name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {release.phase === 'exclusive' && daysUntilPublic !== null && (
            <div className="bg-gradient-to-r from-rose-950/50 to-gray-900 border border-rose-500/30 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-rose-500/20 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <p className="font-semibold text-rose-300">Phase Exclusive</p>
                  <p className="text-sm text-gray-400">Accès réservé aux premiers supporters</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{daysUntilPublic}</p>
                  <p className="text-gray-400">jours avant sortie publique</p>
                </div>
                <div className="w-px h-10 bg-gray-700" />
                <div>
                  <p className="text-gray-300">Passage en public le</p>
                  <p className="font-medium text-white">
                    {release.public_release_at
                      ? new Date(release.public_release_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'À définir'}
                  </p>
                </div>
              </div>
              <div className="mt-3 bg-gray-800/60 rounded-xl p-3 text-sm text-gray-400">
                Les acheteurs en phase exclusive conservent leurs avantages après le passage en public.
              </div>
            </div>
          )}

          {release.is_limited_edition && (
            <div className="bg-gradient-to-r from-amber-950/40 to-gray-900 border border-amber-500/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-300">Édition Numérotée Limitée</p>
                    <p className="text-sm text-gray-400">Certificat numérique inclus</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{remainingEditions}</p>
                  <p className="text-xs text-gray-400">/ {release.limited_edition_total} disponibles</p>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl overflow-hidden h-2">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-700"
                  style={{ width: `${((release.limited_edition_sold / (release.limited_edition_total || 1)) * 100).toFixed(1)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {release.limited_edition_sold} exemplaires vendus
              </p>
            </div>
          )}

          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-3">À propos</h2>
            <p className="text-gray-300 leading-relaxed">{release.description}</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 space-y-3">
            <h2 className="font-semibold text-lg mb-2">Inclus avec l'achat</h2>
            {[
              { icon: <Play className="w-4 h-4 text-emerald-400" />, label: 'Streaming HD illimité' },
              { icon: <Shield className="w-4 h-4 text-blue-400" />, label: 'Accès sécurisé, non téléchargeable' },
              ...(hasPurchased || release.phase === 'exclusive' ? [
                { icon: <Award className="w-4 h-4 text-amber-400" />, label: 'Badge Supporter Fondateur' },
                { icon: <Gift className="w-4 h-4 text-rose-400" />, label: 'Contenu bonus exclusif' },
              ] : []),
              ...(release.is_limited_edition ? [
                { icon: <Star className="w-4 h-4 text-amber-400" />, label: `Numéro d'édition personnalisé` },
              ] : []),
              { icon: <Users className="w-4 h-4 text-purple-400" />, label: 'Nom affiché dans la section supporters' },
              { icon: <Globe className="w-4 h-4 text-gray-400" />, label: `Disponible dans ${release.territories_allowed.includes('worldwide') ? 'tous les pays' : release.territories_allowed.join(', ')}` },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                {item.label}
              </div>
            ))}
          </div>

          <div className="bg-gray-900 rounded-2xl p-6">
            <button
              onClick={() => setShowCredits(!showCredits)}
              className="w-full flex items-center justify-between text-sm font-medium"
            >
              <span>Crédits & ISRC</span>
              {showCredits ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showCredits && (
              <div className="mt-4 space-y-2 border-t border-gray-800 pt-4">
                {release.isrc && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ISRC</span>
                    <span className="text-gray-300 font-mono">{release.isrc}</span>
                  </div>
                )}
                {release.credits?.map((c, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-500">{c.role}</span>
                    <span className="text-gray-300">{c.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {purchaseSuccess || hasPurchased ? (
            <div className="bg-gradient-to-b from-emerald-950/50 to-gray-900 border border-emerald-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-300">Vous avez accès</p>
                  <p className="text-xs text-gray-400">Acheté le {userPurchase ? new Date(userPurchase.created_at).toLocaleDateString('fr-FR') : 'aujourd\'hui'}</p>
                </div>
              </div>
              {(userPurchase?.is_founder || purchaseSuccess) && (
                <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                    <Award className="w-4 h-4" />
                    Supporter Fondateur
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Vous conservez vos avantages exclusifs à vie</p>
                </div>
              )}
              {release.is_limited_edition && userPurchase?.limited_edition_number && (
                <div className="bg-gray-800 rounded-xl p-3 mb-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">Votre exemplaire</p>
                  <p className="text-2xl font-bold">#{userPurchase.limited_edition_number}</p>
                  <p className="text-xs text-gray-500">/ {release.limited_edition_total}</p>
                </div>
              )}
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Play className="w-4 h-4" />
                Écouter maintenant
              </button>
              <button className="w-full mt-2 text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 py-2 transition-colors">
                <Share2 className="w-4 h-4" />
                Partager
              </button>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">{currentPrice.toFixed(2)}€</span>
                      <span className="text-sm text-gray-500 line-through">{release.price_standard.toFixed(2)}€</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold">{currentPrice.toFixed(2)}€</span>
                  )}
                  {discount > 0 && (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full">
                      -{discount}% promo
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                    {SALE_TYPE_LABELS[release.sale_type]}
                  </span>
                </div>
              </div>

              {release.promo_ends_at && discount > 0 && (
                <div className="flex items-center gap-2 text-xs text-amber-400 mb-4 bg-amber-950/30 p-2 rounded-lg">
                  <Clock className="w-3 h-3" />
                  Promo se termine le {new Date(release.promo_ends_at).toLocaleDateString('fr-FR')}
                </div>
              )}

              {isAvailable && !showPaymentForm && (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  disabled={!user}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {user ? 'Acheter maintenant' : 'Connectez-vous pour acheter'}
                </button>
              )}

              {showPaymentForm && (
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-xl p-4">
                    <p className="text-sm font-medium mb-3 text-gray-300">Mode de paiement</p>
                    <div className="space-y-2">
                      {[
                        { id: 'card', label: 'Carte bancaire', icon: <CreditCard className="w-4 h-4" /> },
                        { id: 'trucoin', label: 'TruCoins', icon: <Coins className="w-4 h-4" />, sub: `${trucoinBalance} TC disponibles` },
                        { id: 'mixed', label: 'Carte + TruCoins', icon: <Zap className="w-4 h-4" /> },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setPaymentMethod(opt.id as typeof paymentMethod)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                            paymentMethod === opt.id
                              ? 'border-red-500 bg-red-950/20'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentMethod === opt.id ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'}`}>
                            {opt.icon}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium">{opt.label}</p>
                            {opt.sub && <p className="text-xs text-gray-500">{opt.sub}</p>}
                          </div>
                          {paymentMethod === opt.id && <Check className="w-4 h-4 text-red-400 ml-auto" />}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'mixed' && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <label className="text-xs text-gray-400 block mb-1">TruCoins à utiliser (max {Math.min(trucoinBalance, currentPrice)} TC)</label>
                        <input
                          type="number"
                          min={0}
                          max={Math.min(trucoinBalance, currentPrice)}
                          value={trucoinAmount}
                          onChange={e => setTrucoinAmount(Math.min(Number(e.target.value), Math.min(trucoinBalance, currentPrice)))}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                        />
                        <div className="flex justify-between text-xs mt-2 text-gray-400">
                          <span>Carte : {Math.max(0, currentPrice - trucoinAmount).toFixed(2)}€</span>
                          <span>TruCoins : {trucoinAmount} TC</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-950/30 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-sm"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      {purchasing ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Confirmer {currentPrice.toFixed(2)}€
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {!isAvailable && (
                <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-950/30 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  Non disponible pour le moment
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                {[
                  { icon: <Shield className="w-3.5 h-3.5 text-emerald-400" />, text: 'Paiement sécurisé SSL' },
                  { icon: <Lock className="w-3.5 h-3.5 text-blue-400" />, text: 'Anti-piratage intégré' },
                  { icon: <Tag className="w-3.5 h-3.5 text-amber-400" />, text: '85% reversé à l\'artiste' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    {item.icon}
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-900 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="text-gray-300">{release.total_sales} supporters</span>
            </div>
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(8, release.total_sales) }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-bold"
                >
                  {String.fromCharCode(65 + (i * 7) % 26)}
                </div>
              ))}
              {release.total_sales > 8 && (
                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs text-gray-400">
                  +{release.total_sales - 8}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate?.('album-sale-new')}
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-gray-300"
          >
            Publier votre propre release
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
