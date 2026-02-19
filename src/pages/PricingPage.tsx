import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  CheckCircle, Users, Tv, Store, Coins, CreditCard,
  DollarSign, Calculator, BarChart3, TrendingUp, Info,
  ChevronDown, ChevronUp, ArrowRight, Zap, Shield,
  Wallet, Clock, AlertTriangle
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

function PriceRow({ label, value, note, highlight }: { label: string; value: string; note?: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-gray-800 last:border-0 ${highlight ? 'bg-cyan-900/10 -mx-4 px-4 rounded' : ''}`}>
      <div>
        <span className="text-gray-300 text-sm">{label}</span>
        {note && <span className="text-gray-600 text-xs ml-2">({note})</span>}
      </div>
      <span className={`font-semibold text-sm ${highlight ? 'text-cyan-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-900/40 transition-colors"
      >
        <span className="font-medium text-white text-sm pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-400 text-sm border-t border-gray-800 pt-4 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function PricingPage({ onNavigate }: Props) {
  const [viewerSales, setViewerSales] = useState(50);
  const [viewerPrice, setViewerPrice] = useState(9.99);
  const [viewerMembers, setViewerMembers] = useState(200);
  const [memberPrice, setMemberPrice] = useState(9.99);
  const [tips, setTips] = useState(100);

  const salesNet = viewerSales * viewerPrice * 0.85;
  const subscriptionNet = viewerMembers * memberPrice * 0.85;
  const tipsNet = tips * 0.90;
  const totalNet = salesNet + subscriptionNet + tipsNet;
  const totalGross = viewerSales * viewerPrice + viewerMembers * memberPrice + tips;
  const totalCommission = totalGross - totalNet;

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
            Qui paie quoi sur Goroti
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Aucun frais caché. Commissions fixes et publiques. Tout changement annoncé 30 jours à l'avance.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { value: '85%', label: 'reversé aux créateurs' },
              { value: '0 frais caché', label: 'transparence totale' },
              { value: '10€', label: 'seuil de retrait' },
            ].map(({ value, label }) => (
              <div key={label} className="px-5 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-center">
                <div className="text-lg font-bold text-cyan-400">{value}</div>
                <div className="text-gray-500 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">

        {/* 1. Spectateurs */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Tv className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pour les spectateurs</h2>
              <p className="text-gray-500 text-sm">Ce que coûte regarder du contenu sur Goroti</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Accès gratuit</div>
                <PriceRow label="Créer un compte" value="Gratuit" />
                <PriceRow label="Regarder les vidéos gratuites" value="Gratuit" />
                <PriceRow label="Accès aux communautés publiques" value="Gratuit" />
                <PriceRow label="Acheter du contenu premium" value="Prix fixé par le créateur" />
                <PriceRow label="S'abonner à une chaîne" value="Prix fixé par le créateur" />
                <PriceRow label="Frais de paiement spectateur" value="0€" note="inclus dans le prix" />
              </div>
              <div className="p-4 bg-cyan-900/10 border border-cyan-800/30 rounded-xl text-sm text-gray-400">
                <Info className="w-4 h-4 text-cyan-400 inline mr-1.5 -mt-0.5" />
                Les spectateurs ne paient jamais plus que le prix affiché. Aucun frais de traitement n'est ajouté au prix annoncé.
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Abonnements Premium spectateur</div>
              <div className="space-y-3">
                <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
                  <h3 className="font-bold text-white mb-1">Gratuit</h3>
                  <div className="text-2xl font-bold text-white mb-3">0€ <span className="text-sm text-gray-500 font-normal">/ mois</span></div>
                  <ul className="space-y-1.5">
                    {['Accès aux contenus gratuits', 'Publicités contextuelles', 'Qualité jusqu\'à 1080p', 'Communautés publiques'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-3.5 h-3.5 text-gray-600" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative p-5 bg-cyan-900/20 border border-cyan-500/30 rounded-xl">
                  <div className="absolute -top-2.5 left-4">
                    <span className="px-3 py-0.5 bg-cyan-600 text-white text-xs font-medium rounded-full">Populaire</span>
                  </div>
                  <h3 className="font-bold text-white mb-1 mt-1">Goroti Premium</h3>
                  <div className="text-2xl font-bold text-white mb-3">9,99€ <span className="text-sm text-gray-400 font-normal">/ mois</span></div>
                  <ul className="space-y-1.5">
                    {['Aucune publicité', 'Qualité jusqu\'à 4K HDR', 'Téléchargement hors-ligne', 'Accès prioritaire aux lives', 'Badge Premium sur le profil', 'Accès anticipé aux nouvelles fonctionnalités'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />{f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 text-xs text-gray-500">Annuel : 99,99€/an (16% d'économie)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Créateurs */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pour les créateurs</h2>
              <p className="text-gray-500 text-sm">Commissions par type de revenu — vous gardez l'essentiel</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <h3 className="font-semibold text-white text-sm">Commissions par canal de revenu</h3>
                </div>
                <PriceRow label="Vente de contenu (vidéos, albums, cours)" value="15%" />
                <PriceRow label="Abonnements membres chaîne" value="15%" />
                <PriceRow label="Tips & super chats" value="10%" />
                <PriceRow label="Marketplace créateur" value="10%" />
                <PriceRow label="Distribution externe (DSP)" value="5%" />
                <PriceRow label="Retrait SEPA" value="Gratuit" note="seuil 10€" highlight />
                <PriceRow label="Conversion TruCoin → €" value="Frais fixe réduit" />
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-white text-sm">Délais de disponibilité</h3>
                </div>
                <PriceRow label="Tips & super chats" value="Immédiat" />
                <PriceRow label="Ventes de contenu" value="48h après transaction" />
                <PriceRow label="Abonnements membres" value="1er du mois suivant" />
                <PriceRow label="Marketplace" value="48h après validation" />
              </div>
            </div>
            <div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-white text-sm">Ce que vous gardez en pratique</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { action: 'Vente à 10€', creator: '8,50€', platform: '1,50€', pct: '85%' },
                    { action: 'Abonnement 5€/mois', creator: '4,25€', platform: '0,75€', pct: '85%' },
                    { action: 'Tip de 2€', creator: '1,80€', platform: '0,20€', pct: '90%' },
                    { action: 'Marketplace 50€', creator: '45,00€', platform: '5,00€', pct: '90%' },
                  ].map(({ action, creator, platform, pct }) => (
                    <div key={action} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-800 last:border-0">
                      <span className="text-gray-400">{action}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 font-medium">{creator}</span>
                        <span className="text-gray-600 text-xs">{pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-green-900/10 border border-green-800/30 rounded-xl">
                <Shield className="w-4 h-4 text-green-400 inline mr-1.5 -mt-0.5" />
                <span className="text-green-300 text-xs font-medium">Toutes les commissions incluent les frais de traitement bancaire.</span>
                <p className="text-gray-500 text-xs mt-1">
                  Aucun frais supplémentaire ne peut être ajouté. Les taux sont contractuels et protégés.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Marques */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Store className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pour les marques & annonceurs</h2>
              <p className="text-gray-500 text-sm">Formats disponibles pour les partenariats</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: CreditCard,
                color: 'text-blue-400',
                title: 'Sponsoring natif',
                billing: 'Forfait négocié',
                desc: 'Placement directement dans les vidéos des créateurs. Budget négocié directement entre marque et créateur. Goroti facilite la mise en relation, le contrat et la facturation.',
                items: ['Contact direct créateur-marque', 'Contrat standardisé disponible', 'Facturation simplifiée'],
              },
              {
                icon: BarChart3,
                color: 'text-green-400',
                title: 'Placement contextuel',
                billing: 'CPC / CPM / CPA',
                desc: 'Bannières et annonces contextuelles affichées uniquement aux spectateurs non-Premium. Ciblage par univers thématique, audience démographique et comportement.',
                items: ['Ciblage par univers', 'Zéro diffusion aux abonnés Premium', 'Analytics campagne en temps réel'],
              },
              {
                icon: TrendingUp,
                color: 'text-yellow-400',
                title: 'Vitrine marque',
                billing: 'Abonnement mensuel',
                desc: 'Page marque dédiée avec catalogue produits, association à des créateurs partenaires et accès aux analytics de campagne détaillés.',
                items: ['Page marque dédiée', 'Créateurs partenaires associés', 'Analytics campagne avancés'],
              },
            ].map(({ icon: Icon, color, title, billing, desc, items }) => (
              <div key={title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 flex flex-col">
                <Icon className={`w-5 h-5 ${color} mb-3`} />
                <h3 className="font-semibold text-white mb-0.5">{title}</h3>
                <div className="text-gray-600 text-xs mb-3">{billing}</div>
                <p className="text-gray-400 text-sm mb-3 flex-1 leading-relaxed">{desc}</p>
                <ul className="space-y-1">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-gray-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => onNavigate('native-sponsoring')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              En savoir plus sur le sponsoring natif
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 4. TruCoin */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Coins className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">TruCoin — Monnaie virtuelle</h2>
              <p className="text-gray-500 text-sm">Fonctionnement et taux de conversion</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4 text-sm">Taux et packs</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm py-2 border-b border-gray-800">
                  <span className="text-gray-400">Taux fixe</span>
                  <span className="text-white font-medium">1 TruCoin = 0,01€</span>
                </div>
                {[
                  { pack: 'Pack 500 TC', price: '5,00€', bonus: '' },
                  { pack: 'Pack 1 000 TC', price: '9,99€', bonus: '+50 TC offerts' },
                  { pack: 'Pack 2 500 TC', price: '23,99€', bonus: '+200 TC offerts' },
                  { pack: 'Pack 5 000 TC', price: '44,99€', bonus: '+500 TC offerts' },
                ].map(({ pack, price, bonus }) => (
                  <div key={pack} className="flex justify-between items-center text-sm py-2 border-b border-gray-800 last:border-0">
                    <span className="text-gray-300">{pack}</span>
                    <div className="text-right">
                      <span className="text-white font-medium">{price}</span>
                      {bonus && <div className="text-green-400 text-xs">{bonus}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-3 text-sm">Règles importantes</h3>
                <div className="space-y-2">
                  {[
                    ['Taux fixe garanti', 'Le taux 1 TC = 0,01€ ne varie jamais — pas spéculatif'],
                    ['Durée de validité', 'TruCoins achetés : valables 2 ans après achat'],
                    ['Conversion créateur', 'Commission fixe réduite (non-indexée au volume)'],
                    ['Non remboursable', 'Les TruCoins achetés ne sont pas remboursables en €'],
                    ['Reçus fiscaux', 'Reçu généré automatiquement pour chaque achat'],
                  ].map(([rule, detail]) => (
                    <div key={rule as string} className="flex gap-2.5 text-xs">
                      <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                      <span><span className="text-white font-medium">{rule} :</span><span className="text-gray-500"> {detail}</span></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-yellow-900/10 border border-yellow-800/30 rounded-xl text-xs text-yellow-300/70">
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                Le TruCoin est une monnaie virtuelle non-spéculative. Sa valeur est fixe et ne dépend pas de marchés financiers externes.
              </div>
            </div>
          </div>
        </section>

        {/* 5. Simulateur */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Calculator className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Simulateur de revenus créateur</h2>
              <p className="text-gray-500 text-sm">Estimez vos gains nets mensuels sur Goroti</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-5">
              <div>
                <label className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Ventes de contenu / mois</span>
                  <span className="text-white font-medium">{viewerSales} ventes</span>
                </label>
                <input type="range" min={0} max={500} value={viewerSales} onChange={e => setViewerSales(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Prix unitaire moyen</span>
                  <span className="text-white font-medium">{viewerPrice.toFixed(2)}€</span>
                </label>
                <input type="range" min={1} max={50} step={0.5} value={viewerPrice} onChange={e => setViewerPrice(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Membres abonnés</span>
                  <span className="text-white font-medium">{viewerMembers} membres</span>
                </label>
                <input type="range" min={0} max={2000} step={10} value={viewerMembers} onChange={e => setViewerMembers(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Prix abonnement mensuel</span>
                  <span className="text-white font-medium">{memberPrice.toFixed(2)}€ / mois</span>
                </label>
                <input type="range" min={1} max={20} step={0.5} value={memberPrice} onChange={e => setMemberPrice(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Tips reçus / mois (en €)</span>
                  <span className="text-white font-medium">{tips.toFixed(0)}€</span>
                </label>
                <input type="range" min={0} max={500} step={5} value={tips} onChange={e => setTips(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex flex-col">
              <h3 className="font-semibold text-gray-400 text-xs uppercase tracking-wider mb-4">Revenus estimés / mois</h3>
              <div className="space-y-2 flex-1">
                {[
                  { label: `Ventes (${viewerSales} × ${viewerPrice.toFixed(2)}€)`, gross: viewerSales * viewerPrice, net: salesNet, rate: '15%' },
                  { label: `Abonnements (${viewerMembers} × ${memberPrice.toFixed(2)}€)`, gross: viewerMembers * memberPrice, net: subscriptionNet, rate: '15%' },
                  { label: `Tips reçus`, gross: tips, net: tipsNet, rate: '10%' },
                ].map(({ label, gross, net, rate }) => (
                  <div key={label} className="py-2.5 border-b border-gray-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-gray-400">{gross.toFixed(2)}€ brut</span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <span className="text-gray-600 text-xs">Commission {rate}</span>
                      <span className="text-green-400 text-sm font-medium">{net.toFixed(2)}€ net</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 flex justify-between text-xs text-gray-500">
                  <span>Commission totale Goroti</span>
                  <span className="text-gray-400">−{totalCommission.toFixed(2)}€</span>
                </div>
              </div>
              <div className="mt-5 p-5 bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-800/30 rounded-xl text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-1">{totalNet.toFixed(2)}€</div>
                <div className="text-gray-400 text-sm">revenus nets / mois</div>
                <div className="text-gray-600 text-xs mt-1">
                  soit {(totalNet * 12).toFixed(0)}€ / an estimé
                </div>
              </div>
              <p className="text-gray-700 text-xs mt-3 text-center">
                Simulation indicative. Ne tient pas compte de la TVA ni des impôts.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Questions fréquentes</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Quand puis-je retirer mes gains ?',
                a: 'Le seuil de retrait minimum est de 10€. Les retraits sont traités chaque lundi. Pour les créateurs vérifiés (KYC complété), le virement SEPA arrive sous 3-5 jours ouvrés. PayPal est aussi disponible avec les mêmes délais.',
              },
              {
                q: 'Les commissions peuvent-elles changer ?',
                a: 'Les taux de commission sont contractuellement fixes pour les créateurs déjà actifs. Tout changement sera annoncé 30 jours à l\'avance avec notification directe. Les revenus générés avant un changement restent au taux de l\'époque.',
              },
              {
                q: 'Comment fonctionne le TruCoin en détail ?',
                a: 'Le TruCoin est la monnaie virtuelle de Goroti. 1 TruCoin = 0,01€ de façon garantie et non-spéculative. Les spectateurs achètent des TruCoins pour envoyer des tips aux créateurs. Les créateurs convertissent leurs TruCoins reçus en euros avec un frais fixe minimal. Les TruCoins non utilisés expirent après 2 ans d\'inactivité.',
              },
              {
                q: 'Les frais affichés incluent-ils la TVA ?',
                a: 'Les prix affichés aux spectateurs sont TTC. Les créateurs basés dans l\'UE doivent déclarer la TVA selon leur statut. Goroti fournit un récapitulatif fiscal annuel téléchargeable. Pour les auto-entrepreneurs français sous le régime micro, la franchise de TVA s\'applique sous les seuils légaux.',
              },
              {
                q: 'Que se passe-t-il si un spectateur demande un remboursement ?',
                a: 'Les remboursements sont possibles dans les 14 jours suivant un achat pour un contenu non-consommé (droit UE de rétractation). Le montant est remboursé au spectateur depuis les fonds Goroti. Si le remboursement est dû à une faute du créateur, sa commission est déduite. Les créateurs peuvent configurer une politique de remboursement personnalisée dans leur studio.',
              },
              {
                q: 'Y a-t-il des frais d\'inscription ou des abonnements obligatoires pour les créateurs ?',
                a: 'Non. Créer un compte créateur et publier du contenu est entièrement gratuit. Goroti se rémunère uniquement sur les transactions — si vous ne gagnez rien, vous ne payez rien.',
              },
            ].map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-gray-800">
          <h3 className="text-lg font-bold text-white mb-2">Des questions spécifiques sur la tarification ?</h3>
          <p className="text-gray-400 text-sm mb-5">Notre équipe répond sous 24h ouvrées.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => onNavigate('support')}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Contacter le support
            </button>
            <button
              onClick={() => onNavigate('enterprise')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              Informations entreprise
            </button>
          </div>
        </section>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
