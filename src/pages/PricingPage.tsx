import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  CheckCircle, Users, Tv, Store, Coins, CreditCard,
  DollarSign, Calculator, BarChart3, TrendingUp, Info
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

function PriceRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <div>
        <span className="text-gray-300 text-sm">{label}</span>
        {note && <span className="text-gray-600 text-xs ml-2">({note})</span>}
      </div>
      <span className="font-medium text-white text-sm">{value}</span>
    </div>
  );
}

function PlanCard({
  title, price, period, features, highlight, badge
}: {
  title: string; price: string; period: string; features: string[];
  highlight?: boolean; badge?: string;
}) {
  return (
    <div className={`relative p-6 rounded-xl border ${highlight
      ? 'bg-cyan-900/20 border-cyan-500/40'
      : 'bg-gray-900/50 border-gray-800'
    }`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-cyan-600 text-white text-xs font-medium rounded-full">{badge}</span>
        </div>
      )}
      <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold text-white">{price}</span>
        <span className="text-gray-500 text-sm">{period}</span>
      </div>
      <ul className="space-y-2">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingPage({ onNavigate }: Props) {
  const [viewerSales, setViewerSales] = useState(50);
  const [viewerPrice, setViewerPrice] = useState(9.99);
  const [viewerMembers, setViewerMembers] = useState(200);
  const [memberPrice, setMemberPrice] = useState(4.99);

  const salesRevenue = viewerSales * viewerPrice * 0.85;
  const subscriptionRevenue = viewerMembers * memberPrice * 0.85;
  const totalNet = salesRevenue + subscriptionRevenue;

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6">
            <DollarSign className="w-4 h-4" />
            Tarification transparente
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Qui paie quoi sur TruTube
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Aucun frais caché. Commissions fixes et publiques. Ce que vous voyez est exactement ce que vous payez.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">

        {/* Pour les spectateurs */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Tv className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pour les spectateurs</h2>
              <p className="text-gray-500 text-sm">Ce que coûte regarder du contenu sur TruTube</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <PriceRow label="Créer un compte" value="Gratuit" />
              <PriceRow label="Regarder les vidéos gratuites" value="Gratuit" />
              <PriceRow label="Accès aux communautés publiques" value="Gratuit" />
              <PriceRow label="Acheter du contenu premium" value="Prix fixé par le créateur" />
              <PriceRow label="S'abonner à une chaîne" value="Prix fixé par le créateur" />
              <PriceRow label="Frais de paiement" value="Inclus" note="0 frais cachés" />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Abonnements Premium spectateur</h3>
              <div className="space-y-3">
                <PlanCard
                  title="Gratuit"
                  price="0€"
                  period="/ mois"
                  features={['Accès aux contenus gratuits', 'Publicités contextuelles', 'Qualité jusqu\'à 1080p', 'Communautés publiques']}
                />
                <PlanCard
                  title="TruTube Premium"
                  price="6,99€"
                  period="/ mois"
                  highlight
                  badge="Populaire"
                  features={['Aucune publicité', 'Qualité jusqu\'à 4K', 'Téléchargement hors-ligne', 'Accès prioritaire aux lives', 'Badge Premium']}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pour les créateurs */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pour les créateurs</h2>
              <p className="text-gray-500 text-sm">Commissions prélevées sur chaque type de revenu</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-4 h-4 text-yellow-400" />
                <h3 className="font-semibold text-white">Commissions par service</h3>
              </div>
              <PriceRow label="Vente de contenu (vidéos, albums, cours)" value="15%" />
              <PriceRow label="Abonnements chaîne" value="15%" />
              <PriceRow label="Marketplace créateur" value="10%" />
              <PriceRow label="Distribution externe" value="5%" />
              <PriceRow label="Retrait des gains" value="Gratuit" note="seuil 10€" />
              <PriceRow label="Conversion TruCoin → €" value="Frais fixe réduit" />
              <PriceRow label="Tips & super chats" value="10%" />
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-white">Ce que vous gardez réellement</h3>
              </div>
              <div className="space-y-4">
                {[
                  { action: 'Vente à 10€', creator: '8,50€', platform: '1,50€' },
                  { action: 'Abonnement 5€/mois', creator: '4,25€', platform: '0,75€' },
                  { action: 'Tip 2€', creator: '1,80€', platform: '0,20€' },
                  { action: 'Marketplace 50€', creator: '45,00€', platform: '5,00€' },
                ].map(({ action, creator, platform }) => (
                  <div key={action} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{action}</span>
                    <div className="flex gap-4">
                      <span className="text-green-400 font-medium">{creator} pour vous</span>
                      <span className="text-gray-600">{platform} TruTube</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 bg-cyan-900/20 border border-cyan-800/30 rounded-lg">
                <p className="text-cyan-300 text-xs">
                  Toutes les commissions incluent les frais de traitement bancaire.
                  Aucun frais supplémentaire n'est ajouté à ces taux.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pour les marques */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Store className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pour les marques & annonceurs</h2>
              <p className="text-gray-500 text-sm">Modèles disponibles pour les partenariats</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <CreditCard className="w-6 h-6 text-blue-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">Sponsoring natif</h3>
              <p className="text-gray-500 text-xs mb-3">Forfait</p>
              <p className="text-gray-400 text-sm">
                Placement dans les vidéos des créateurs. Budget négocié directement entre marque et créateur.
                TruTube facilite la mise en relation et la facturation.
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <BarChart3 className="w-6 h-6 text-green-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">Placement publicitaire</h3>
              <p className="text-gray-500 text-xs mb-3">CPC / CPA</p>
              <p className="text-gray-400 text-sm">
                Bannières et annonces contextuelles affichées uniquement aux spectateurs non-Premium.
                Ciblage par univers thématique.
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <TrendingUp className="w-6 h-6 text-yellow-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">Vitrine marque</h3>
              <p className="text-gray-500 text-xs mb-3">Abonnement mensuel</p>
              <p className="text-gray-400 text-sm">
                Page marque dédiée avec catalogue produits, association à des créateurs partenaires
                et accès aux analytics campagnes.
              </p>
            </div>
          </div>
        </section>

        {/* Simulateur */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Calculator className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Simulateur de revenus créateur</h2>
              <p className="text-gray-500 text-sm">Estimez vos gains nets mensuels sur TruTube</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ventes de contenu par mois: <span className="text-white font-medium">{viewerSales}</span>
                </label>
                <input
                  type="range" min={0} max={500} value={viewerSales}
                  onChange={e => setViewerSales(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Prix unitaire: <span className="text-white font-medium">{viewerPrice.toFixed(2)}€</span>
                </label>
                <input
                  type="range" min={1} max={50} step={0.5} value={viewerPrice}
                  onChange={e => setViewerPrice(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Membres abonnés: <span className="text-white font-medium">{viewerMembers}</span>
                </label>
                <input
                  type="range" min={0} max={2000} step={10} value={viewerMembers}
                  onChange={e => setViewerMembers(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Prix abonnement: <span className="text-white font-medium">{memberPrice.toFixed(2)}€ / mois</span>
                </label>
                <input
                  type="range" min={1} max={20} step={0.5} value={memberPrice}
                  onChange={e => setMemberPrice(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-400 text-sm uppercase tracking-wider">Revenus estimés / mois</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Ventes de contenu ({viewerSales} × {viewerPrice.toFixed(2)}€)</span>
                    <span className="text-white">{(viewerSales * viewerPrice).toFixed(2)}€ brut</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Abonnements ({viewerMembers} × {memberPrice.toFixed(2)}€)</span>
                    <span className="text-white">{(viewerMembers * memberPrice).toFixed(2)}€ brut</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                      <span>Commission TruTube (15%)</span>
                      <span>−{((viewerSales * viewerPrice + viewerMembers * memberPrice) * 0.15).toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Total brut</span>
                      <span className="text-gray-300">{(viewerSales * viewerPrice + viewerMembers * memberPrice).toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-5 bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-800/30 rounded-xl text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-1">{totalNet.toFixed(2)}€</div>
                <div className="text-gray-400 text-sm">revenus nets / mois</div>
                <div className="text-gray-600 text-xs mt-1">
                  soit {(totalNet * 12).toFixed(0)}€ / an
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Questions fréquentes sur la tarification</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Quand puis-je retirer mes gains ?',
                a: 'Le seuil de retrait est de 10€. Les paiements sont traités chaque mois. Pour les créateurs vérifiés (KYC complété), le virement arrive sous 3-5 jours ouvrés via SEPA.'
              },
              {
                q: 'Les commissions peuvent-elles changer ?',
                a: 'Les taux sont fixes et tout changement est annoncé 30 jours à l\'avance avec notification directe aux créateurs concernés. Aucun changement silencieux.'
              },
              {
                q: 'Comment fonctionne le TruCoin ?',
                a: 'Le TruCoin est la monnaie virtuelle de la plateforme. 1 TruCoin = 0,01€. Les spectateurs achètent des TruCoins pour envoyer des tips. La conversion en euros pour les créateurs applique un frais fixe minimal.'
              },
              {
                q: 'Les frais incluent-ils la TVA ?',
                a: 'Les prix affichés aux spectateurs sont TTC. Les créateurs basés dans l\'UE devront déclarer la TVA selon leur statut. TruTube fournit un récapitulatif fiscal annuel téléchargeable.'
              },
            ].map(({ q, a }) => {
              const [open, setOpen] = useState(false);
              return (
                <div key={q} className="border border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpen(!open)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-900/50 transition-colors"
                  >
                    <span className="font-medium text-white text-sm">{q}</span>
                    {open ? <span className="text-gray-500 text-xl">−</span> : <span className="text-gray-500 text-xl">+</span>}
                  </button>
                  {open && (
                    <div className="px-6 pb-4 text-gray-400 text-sm border-t border-gray-800 pt-4 leading-relaxed">
                      {a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
