import { useState } from 'react';
import {
  Music, Star, Heart, ShoppingBag, Briefcase, Repeat,
  ArrowRight, TrendingUp, Users, Zap, Shield, CheckCircle,
  ChevronDown, ChevronUp, DollarSign, Eye, EyeOff, BarChart3,
  Video, Package, Mic, Layers
} from 'lucide-react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface Props {
  onNavigate: (page: string) => void;
}

const REVENUE_SOURCES = [
  {
    id: 'content',
    letter: 'A',
    title: 'Vente de contenu premium',
    subtitle: 'Revenu principal',
    icon: <Music className="w-6 h-6" />,
    color: 'from-red-600 to-red-800',
    accent: 'text-red-400',
    border: 'border-red-900/50',
    bg: 'bg-red-900/10',
    description: 'Chaque album, EP, single ou vidéo peut devenir un produit vendable avec un modèle clair : achat, location ou accès limité.',
    table: [
      { action: 'Achat album / single', gain: 'Revenu direct permanent' },
      { action: 'Location vidéo 48-72h', gain: 'Revenu récurrent' },
      { action: 'Accès limité (phase exclusive)', gain: 'Revenu premium' },
      { action: 'Édition numérotée', gain: 'Revenu collecteur' },
    ],
    analogy: 'Équivalent : billetterie cinéma + streaming payant',
    commission: '15% pour la plateforme',
  },
  {
    id: 'subscription',
    letter: 'B',
    title: 'Abonnement chaîne',
    subtitle: 'Fan membership',
    icon: <Star className="w-6 h-6" />,
    color: 'from-amber-600 to-amber-800',
    accent: 'text-amber-400',
    border: 'border-amber-900/50',
    bg: 'bg-amber-900/10',
    description: 'Le fan s\'abonne directement à son créateur. Pas à la plateforme — à l\'artiste. Paiement mensuel récurrent.',
    table: [
      { action: 'Accès anticipé aux sorties', gain: 'Fidélité renforcée' },
      { action: 'Vidéos et lives privés', gain: 'Communauté exclusive' },
      { action: 'Bonus & coulisses', gain: 'Lien artistique direct' },
      { action: 'Badge abonné', gain: 'Statut visible' },
    ],
    analogy: 'Équivalent : Patreon + Twitch Sub',
    commission: 'Variable selon tier',
  },
  {
    id: 'tips',
    letter: 'C',
    title: 'Tips & Pourboires',
    subtitle: 'Soutien direct',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-pink-600 to-pink-800',
    accent: 'text-pink-400',
    border: 'border-pink-900/50',
    bg: 'bg-pink-900/10',
    description: 'Pendant ou après le visionnage, le fan peut soutenir librement son artiste via TruCoins. Montant libre ou suggéré.',
    table: [
      { action: 'Tip pendant un live', gain: 'Revenu temps réel' },
      { action: 'Tip après une vidéo', gain: 'Gratitude convertie' },
      { action: 'Super commentaire', gain: 'Visibilité + revenu' },
      { action: 'Message épinglé', gain: 'Interaction premium' },
    ],
    analogy: 'Équivalent : StreamElements + Buy Me a Coffee',
    commission: 'Faible',
  },
  {
    id: 'merch',
    letter: 'D',
    title: 'Merchandising',
    subtitle: 'Produits dérivés',
    icon: <ShoppingBag className="w-6 h-6" />,
    color: 'from-emerald-600 to-emerald-800',
    accent: 'text-emerald-400',
    border: 'border-emerald-900/50',
    bg: 'bg-emerald-900/10',
    description: 'La boutique créateur est intégrée au profil. Fan merchandise, vinyles, bundles : la marge revient au créateur.',
    table: [
      { action: 'T-shirt / hoodie', gain: 'Marge standard' },
      { action: 'Vinyle / CD', gain: 'Marge collecteur' },
      { action: 'Bundle album + merch', gain: 'Marge élevée' },
      { action: 'Produit numérique', gain: 'Marge maximale' },
    ],
    analogy: 'Équivalent : Shopify intégré',
    commission: 'Variable',
  },
  {
    id: 'marketplace',
    letter: 'E',
    title: 'Marketplace de services',
    subtitle: 'Revenu professionnel',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'from-blue-600 to-blue-800',
    accent: 'text-blue-400',
    border: 'border-blue-900/50',
    bg: 'bg-blue-900/10',
    description: 'Le créateur peut aussi vendre son expertise : beats, montage vidéo, cover art, marketing, voix-off. Paiement sécurisé via escrow.',
    table: [
      { action: 'Vente de beats', gain: 'Revenu passif' },
      { action: 'Montage vidéo', gain: 'Prestation freelance' },
      { action: 'Cover / artwork', gain: 'Service créatif' },
      { action: 'Stratégie marketing', gain: 'Service consultant' },
    ],
    analogy: 'Équivalent : Fiverr intégré',
    commission: '10% pour la plateforme',
  },
  {
    id: 'secondary',
    letter: 'F',
    title: 'Marché secondaire',
    subtitle: 'Future feature',
    icon: <Repeat className="w-6 h-6" />,
    color: 'from-gray-600 to-gray-700',
    accent: 'text-gray-400',
    border: 'border-gray-700/50',
    bg: 'bg-gray-800/40',
    description: 'Revente interne des éditions limitées entre utilisateurs GOROTI. Commission sur chaque transaction secondaire.',
    table: [
      { action: 'Édition numérotée revendue', gain: 'Commission plateforme + artiste' },
      { action: 'Certificate de propriété', gain: 'Authenticité garantie' },
    ],
    analogy: 'Marché secondaire interne — sans blockchain',
    commission: 'À définir',
  },
];

const PLATFORM_COMMISSIONS = [
  { source: 'Vente de contenu', rate: '15 %', type: 'Principal' },
  { source: 'Marketplace services', rate: '10 %', type: 'Secondaire' },
  { source: 'Merchandising', rate: 'Variable', type: 'Secondaire' },
  { source: 'Retrait wallet', rate: 'Optionnel', type: 'Optionnel' },
  { source: 'Distribution externe', rate: '5 %', type: 'Futur' },
];

const COMPARISON = [
  { model: 'Publicité (YouTube Ads)', fans: '1000 fans', gain: '2–5 €', type: 'passive' },
  { model: 'Vente directe (album)', fans: '1000 fans', gain: '300–2000 €', type: 'active' },
  { model: 'Membership mensuel', fans: '1000 fans', gain: '500–5000 € / mois', type: 'recurring' },
  { model: 'Merch + bundle', fans: '1000 fans', gain: '1000–8000 €', type: 'high' },
];

export default function RevenueModelPage({ onNavigate }: Props) {
  const [expanded, setExpanded] = useState<string | null>('content');
  const [showPlatform, setShowPlatform] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="mt-16">

        {/* Hero */}
        <div className="relative overflow-hidden border-b border-gray-900">
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-gray-950 to-gray-950" />
          <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
            <span className="inline-block text-xs font-semibold tracking-widest text-red-400 uppercase mb-4 bg-red-950/40 border border-red-900/50 px-4 py-1.5 rounded-full">
              Modèle économique
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
              GOROTI n'est pas financé<br />
              <span className="text-red-400">par l'attention.</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
              Mais par la valeur.
            </p>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              Les fans financent directement les créateurs.
              L'absence de publicité n'est pas un manque — c'est le cœur du modèle.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

          {/* Core principle */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-red-400" />,
                  title: 'Chaque interaction',
                  desc: 'peut devenir une transaction',
                  color: 'border-red-900/40 bg-red-950/10',
                },
                {
                  icon: <Users className="w-6 h-6 text-amber-400" />,
                  title: 'Petit public engagé',
                  desc: 'vaut plus qu\'une grande audience passive',
                  color: 'border-amber-900/40 bg-amber-950/10',
                },
                {
                  icon: <TrendingUp className="w-6 h-6 text-green-400" />,
                  title: 'Revenus immédiats',
                  desc: 'sans dépendance à l\'algorithme',
                  color: 'border-green-900/40 bg-green-950/10',
                },
              ].map((card, i) => (
                <div key={i} className={`${card.color} border rounded-2xl p-6 text-center`}>
                  <div className="flex justify-center mb-3">{card.icon}</div>
                  <p className="font-bold text-white mb-1">{card.title}</p>
                  <p className="text-sm text-gray-400">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Revenue sources */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-white mb-2">6 sources de revenus</h2>
              <p className="text-gray-400 text-sm">Cumulables, complémentaires, sans concurrence entre elles</p>
            </div>

            <div className="space-y-3">
              {REVENUE_SOURCES.map(source => {
                const isOpen = expanded === source.id;
                return (
                  <div
                    key={source.id}
                    className={`${source.bg} border ${source.border} rounded-2xl overflow-hidden transition-all`}
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : source.id)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${source.color} flex items-center justify-center flex-shrink-0 text-white`}>
                        {source.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-semibold ${source.accent}`}>{source.letter}.</span>
                          <span className="font-bold text-white">{source.title}</span>
                          <span className="hidden sm:inline text-xs text-gray-500 bg-gray-800/60 px-2 py-0.5 rounded-full ml-1">{source.subtitle}</span>
                        </div>
                        <p className="text-xs text-gray-400 hidden sm:block truncate">{source.description}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-semibold ${source.accent} hidden sm:block`}>{source.commission}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 space-y-4">
                        <p className="text-sm text-gray-300">{source.description}</p>

                        <div className="overflow-hidden rounded-xl border border-gray-800">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-800 bg-gray-900/60">
                                <th className="text-left px-4 py-2.5 text-xs text-gray-400 font-medium">Action utilisateur</th>
                                <th className="text-left px-4 py-2.5 text-xs text-gray-400 font-medium">Gain créateur</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                              {source.table.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                  <td className="px-4 py-3 text-gray-200">{row.action}</td>
                                  <td className={`px-4 py-3 font-medium ${source.accent}`}>{row.gain}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 italic">{source.analogy}</p>
                          <span className={`text-xs font-semibold ${source.accent} bg-gray-900/60 px-3 py-1 rounded-full border border-gray-800`}>
                            {source.commission}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Short as native ad */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-900/40 border border-red-900/50 flex items-center justify-center">
                  <Video className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Le Short comme publicité native gratuite</h2>
                  <p className="text-xs text-gray-500">Section 17.2 — Rôle du short dans le modèle</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap mb-5">
                {[
                  { label: 'Short', icon: <Video className="w-3 h-3" /> },
                  { label: 'Intérêt', icon: <Eye className="w-3 h-3" /> },
                  { label: 'Vidéo', icon: <Mic className="w-3 h-3" /> },
                  { label: 'Achat / Support', icon: <Heart className="w-3 h-3" /> },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200">
                      <span className="text-red-400">{step.icon}</span>
                      {step.label}
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-gray-600" />}
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Avant</p>
                  <p className="text-sm text-gray-300">La plateforme vend de l'espace publicitaire à des annonceurs</p>
                </div>
                <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-4">
                  <p className="text-xs text-red-400 mb-1">GOROTI</p>
                  <p className="text-sm text-gray-300">La plateforme <strong className="text-white">remplace l'annonceur par le fan</strong></p>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">Pourquoi ce modèle est plus rentable</h2>
              <p className="text-gray-400 text-sm">Comparaison des gains moyens pour 1 000 fans actifs</p>
            </div>

            <div className="space-y-3">
              {COMPARISON.map((row, i) => {
                const widths = ['5%', '35%', '70%', '100%'];
                const colors = ['bg-gray-700', 'bg-blue-600', 'bg-amber-600', 'bg-red-600'];
                const textColors = ['text-gray-400', 'text-blue-400', 'text-amber-400', 'text-red-400'];
                return (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-white">{row.model}</span>
                        <span className="text-xs text-gray-500 ml-2">{row.fans}</span>
                      </div>
                      <span className={`text-sm font-bold ${textColors[i]}`}>{row.gain}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${colors[i]} rounded-full transition-all`} style={{ width: widths[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              Un petit public engagé vaut plus qu'une grande audience passive.
            </p>
          </section>

          {/* Platform revenue */}
          <section>
            <button
              onClick={() => setShowPlatform(!showPlatform)}
              className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Revenus plateforme</p>
                  <p className="text-xs text-gray-500">Comment GOROTI génère ses revenus sans publicité</p>
                </div>
              </div>
              {showPlatform ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>

            {showPlatform && (
              <div className="mt-3 bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="overflow-hidden rounded-xl border border-gray-800 mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-800/60 border-b border-gray-800">
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Source</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Commission</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {PLATFORM_COMMISSIONS.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3 text-gray-200">{row.source}</td>
                          <td className="px-4 py-3 font-bold text-red-400">{row.rate}</td>
                          <td className="px-4 py-3 text-xs">
                            <span className={`px-2 py-0.5 rounded-full ${
                              row.type === 'Principal' ? 'bg-red-900/40 text-red-400' :
                              row.type === 'Secondaire' ? 'bg-blue-900/40 text-blue-400' :
                              row.type === 'Futur' ? 'bg-gray-800 text-gray-500' :
                              'bg-gray-800 text-gray-400'
                            }`}>
                              {row.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500">
                  Aucune régie publicitaire. Aucun tracking de données à des fins commerciales tierces. La croissance de GOROTI est directement corrélée à celle de ses créateurs.
                </p>
              </div>
            )}
          </section>

          {/* Triple advantage */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">Avantage stratégique</h2>
              <p className="text-gray-400 text-sm">Pour chaque partie de l'écosystème</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: 'Pour le créateur',
                  icon: <Mic className="w-5 h-5" />,
                  color: 'border-red-900/40 bg-red-950/10',
                  accent: 'text-red-400',
                  points: [
                    'Revenus immédiats dès le 1er fan',
                    'Pas de seuil minimum de vues',
                    'Pas de dépendance à l\'algorithme',
                    'Audience qualitative > quantité',
                    'Multi-sources cumulables',
                  ],
                },
                {
                  title: 'Pour l\'utilisateur',
                  icon: <Users className="w-5 h-5" />,
                  color: 'border-blue-900/40 bg-blue-950/10',
                  accent: 'text-blue-400',
                  points: [
                    'Zéro publicité',
                    'Relation directe artiste-fan',
                    'Choisit ce qu\'il soutient',
                    'Expérience non interrompue',
                    'Accès à du contenu exclusif',
                  ],
                },
                {
                  title: 'Pour la plateforme',
                  icon: <Layers className="w-5 h-5" />,
                  color: 'border-green-900/40 bg-green-950/10',
                  accent: 'text-green-400',
                  points: [
                    'Revenus prévisibles et stables',
                    'Économie interne autonome',
                    'Pas de dépendance aux annonceurs',
                    'Alignement avec les créateurs',
                    'Modèle scalable internationalement',
                  ],
                },
              ].map((col, i) => (
                <div key={i} className={`${col.color} border rounded-2xl p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-center ${col.accent}`}>
                      {col.icon}
                    </div>
                    <h3 className="font-bold text-white text-sm">{col.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {col.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${col.accent}`} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center border-t border-gray-900 pt-16">
            <div className="inline-flex items-center gap-2 bg-red-950/30 border border-red-900/40 rounded-full px-5 py-2 text-red-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Modèle éthique — sans publicité — transparent
            </div>
            <h2 className="text-3xl font-black text-white mb-4">
              Prêt à monétiser<br />votre audience ?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
              Créez votre chaîne, configurez vos sources de revenus, et commencez à recevoir le soutien de vos fans dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('studio')}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors"
              >
                <Zap className="w-4 h-4" /> Accéder au Studio
              </button>
              <button
                onClick={() => onNavigate('my-channels')}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-6 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                <Users className="w-4 h-4" /> Mes chaînes
              </button>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
