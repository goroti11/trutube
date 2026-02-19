import { useState } from 'react';
import {
  Briefcase, Home, Video, User, Zap, Search, ShoppingBag,
  BadgeCheck, Tag, Gift, MousePointerClick, ShoppingCart, DollarSign,
  Shield, ChevronDown, ChevronUp, ArrowRight, CheckCircle,
  Eye, TrendingUp, Star, Layers, AlertTriangle, Play, Tv
} from 'lucide-react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface Props {
  onNavigate: (page: string) => void;
}

const PLACEMENTS = [
  { label: 'Accueil', desc: 'Bannière sponsorisée en haut du feed', icon: <Home className="w-4 h-4" />, color: 'border-blue-900/40 bg-blue-950/10', accent: 'text-blue-400' },
  { label: 'Page vidéo', desc: 'Carte partenaire dans le panneau latéral', icon: <Video className="w-4 h-4" />, color: 'border-emerald-900/40 bg-emerald-950/10', accent: 'text-emerald-400' },
  { label: 'Page artiste', desc: 'Badge "Partenaire officiel" sur le profil', icon: <User className="w-4 h-4" />, color: 'border-amber-900/40 bg-amber-950/10', accent: 'text-amber-400' },
  { label: 'Shorts', desc: 'Carte recommandation après visionnage', icon: <Zap className="w-4 h-4" />, color: 'border-red-900/40 bg-red-950/10', accent: 'text-red-400' },
  { label: 'Recherche', desc: 'Résultat sponsorisé dans les suggestions', icon: <Search className="w-4 h-4" />, color: 'border-cyan-900/40 bg-cyan-950/10', accent: 'text-cyan-400' },
  { label: 'Store', desc: 'Produit partenaire dans le catalogue', icon: <ShoppingBag className="w-4 h-4" />, color: 'border-orange-900/40 bg-orange-950/10', accent: 'text-orange-400' },
];

const AD_TYPES = [
  {
    key: 'A',
    label: 'Placement natif plateforme',
    icon: <Layers className="w-5 h-5" />,
    color: 'border-blue-900/40 bg-blue-950/10',
    accent: 'text-blue-400',
    desc: 'Intégration discrète dans l\'interface. Jamais imposée. Toujours clairement identifiée comme partenariat.',
    tags: ['Recommandé par Goroti', 'Partenaire officiel', 'Offre fans'],
    tagColor: 'bg-blue-900/30 text-blue-300 border-blue-900/40',
  },
  {
    key: 'B',
    label: 'Sponsoring créateur',
    icon: <Star className="w-5 h-5" />,
    color: 'border-amber-900/40 bg-amber-950/10',
    accent: 'text-amber-400',
    desc: 'Le créateur associe volontairement une marque à une vidéo. Déclaré obligatoirement. Fiche produit liée visible sous la vidéo.',
    tags: ['Badge sponsor', 'Fiche produit liée', 'Déclaration obligatoire'],
    tagColor: 'bg-amber-900/30 text-amber-300 border-amber-900/40',
  },
  {
    key: 'C',
    label: 'Produit interactif',
    icon: <MousePointerClick className="w-5 h-5" />,
    color: 'border-emerald-900/40 bg-emerald-950/10',
    accent: 'text-emerald-400',
    desc: 'Pendant la lecture : une icône discrète cliquable apparaît sur la vidéo. Le clic ouvre une fiche produit sans couper la lecture.',
    tags: ['Aucune coupure lecture', 'Icône discrète', 'Fiche produit overlay'],
    tagColor: 'bg-emerald-900/30 text-emerald-300 border-emerald-900/40',
  },
  {
    key: 'D',
    label: 'Offre fan',
    icon: <Gift className="w-5 h-5" />,
    color: 'border-red-900/40 bg-red-950/10',
    accent: 'text-red-400',
    desc: 'Coupon exclusif réservé aux abonnés d\'une chaîne. Récompense la fidélité sans interrompre l\'expérience.',
    tags: ['Abonnés uniquement', 'Coupon exclusif', 'Lien fidélité'],
    tagColor: 'bg-red-900/30 text-red-300 border-red-900/40',
  },
];

const CREATOR_GAINS = [
  { action: 'Clic sur produit', gain: true, model: 'CPV — coût par vue qualifiée' },
  { action: 'Ajout au panier', gain: true, model: 'CPA — coût par achat' },
  { action: 'Achat confirmé', gain: true, model: 'RevShare — % sur vente' },
  { action: 'Visionnage sponsor long', gain: true, model: 'CPV — durée qualifiée' },
];

const PLATFORM_REVENUE = [
  { source: 'Campagne marque', type: 'Forfait', icon: <Briefcase className="w-4 h-4 text-blue-400" /> },
  { source: 'Commission vente', type: '% transaction', icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
  { source: 'Visibilité premium', type: 'Abonnement partenaire', icon: <TrendingUp className="w-4 h-4 text-amber-400" /> },
];

const ECOSYSTEM_TARGETS = [
  { label: 'Shorts', icon: <Zap className="w-3.5 h-3.5" /> },
  { label: 'Live', icon: <Tv className="w-3.5 h-3.5" /> },
  { label: 'Albums', icon: <Play className="w-3.5 h-3.5" /> },
  { label: 'Store artiste', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  { label: 'Édition limitée', icon: <Star className="w-3.5 h-3.5" /> },
];

const PLATFORM_COMPARE = [
  { platform: 'YouTube', model: 'Intrusive', detail: 'Pre-roll non skippable, mid-roll forcé', accent: 'text-gray-400', bar: 'bg-gray-700', pct: 30 },
  { platform: 'TikTok', model: 'Addictive', detail: 'Intégration totale contenu/pub, confusion', accent: 'text-gray-400', bar: 'bg-gray-700', pct: 50 },
  { platform: 'Goroti', model: 'Commerciale utile', detail: 'Intégrée à la valeur du contenu, opt-in', accent: 'text-red-400', bar: 'bg-red-600', pct: 100 },
];

const COMPLIANCE = [
  { rule: 'Mention sponsor obligatoire sur toute intégration commerciale', icon: <BadgeCheck className="w-4 h-4 text-emerald-400" /> },
  { rule: 'Refus du ciblage comportemental intrusif', icon: <Shield className="w-4 h-4 text-emerald-400" /> },
  { rule: 'Aucun tracking externe tiers autorisé', icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
  { rule: 'Conformité RGPD — données minimales collectées', icon: <Shield className="w-4 h-4 text-emerald-400" /> },
];

export default function NativeSponsoringPage({ onNavigate }: Props) {
  const [revenueOpen, setRevenueOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="mt-16">

        {/* Hero */}
        <div className="relative overflow-hidden border-b border-gray-900">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-gray-950 to-gray-950" />
          <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
            <span className="inline-block text-xs font-semibold tracking-widest text-amber-400 uppercase mb-4 bg-amber-950/40 border border-amber-900/50 px-4 py-1.5 rounded-full">
              Module — Section 19
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
              Espace Publicité<br />
              <span className="text-amber-400">Partenaires — Sponsoring Natif</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-base mb-6">
              La publicité Goroti n'interrompt pas le contenu. Elle s'intègre à sa valeur.
              On ne monétise pas l'attention captive — on monétise l'intérêt réel.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {['Sans interruption', 'Déclaré et transparent', 'Basé sur l\'intérêt', 'RGPD natif'].map(tag => (
                <span key={tag} className="text-xs text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

          {/* No autoplay rule */}
          <section>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 bg-red-900/30 border border-red-900/50 flex items-center justify-center">
                <Play className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="font-bold text-white mb-1">Règle absolue</p>
                <p className="text-gray-300 text-sm">
                  <span className="text-red-400 font-semibold">Aucune publicité ne se lance automatiquement avec le lecteur vidéo.</span>{' '}
                  Toute interaction commerciale est opt-in ou contextuelle. Jamais forcée, jamais intrusive.
                </p>
              </div>
            </div>
          </section>

          {/* Placements */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">6 emplacements autorisés</h2>
              <p className="text-gray-400 text-sm">Chaque espace est conçu pour une intégration contextuelle et non perturbatrice</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLACEMENTS.map((p, i) => (
                <div key={i} className={`${p.color} border rounded-xl p-5`}>
                  <div className={`flex items-center gap-2 mb-3 ${p.accent}`}>
                    {p.icon}
                    <span className="font-bold text-sm text-white">{p.label}</span>
                  </div>
                  <p className="text-sm text-gray-400">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4 ad types */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">4 types de publicité</h2>
              <p className="text-gray-400 text-sm">De la présence discrète à l'offre exclusive — chaque format respecte l'expérience</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AD_TYPES.map((type) => (
                <div key={type.key} className={`${type.color} border rounded-2xl p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-center ${type.accent}`}>
                      {type.icon}
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gray-900/50 ${type.accent}`}>
                      Type {type.key}
                    </span>
                  </div>
                  <h3 className={`font-bold text-sm mb-2 ${type.accent}`}>{type.label}</h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">{type.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {type.tags.map((tag, i) => (
                      <span key={i} className={`text-xs px-2.5 py-1 rounded-full border ${type.tagColor}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Creator monetization */}
          <section>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/30 border border-emerald-900/50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white">Rémunération créateurs</h2>
                    <p className="text-xs text-gray-500">Uniquement sur interaction réelle — pas sur l'affichage passif</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-800/60">
                {CREATOR_GAINS.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-800/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-950/40 border border-emerald-900/40 flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-sm text-gray-200">{item.action}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">{item.model}</span>
                  </div>
                ))}
              </div>
              <div className="p-5 bg-emerald-950/10 border-t border-emerald-900/30">
                <div className="flex flex-wrap gap-3 text-xs text-emerald-400/80">
                  <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> CPV — coût par vue qualifiée</span>
                  <span className="flex items-center gap-1.5"><ShoppingCart className="w-3.5 h-3.5" /> CPA — coût par achat</span>
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> RevShare — % sur vente</span>
                </div>
              </div>
            </div>
          </section>

          {/* Platform revenue */}
          <section>
            <button
              onClick={() => setRevenueOpen(!revenueOpen)}
              className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-900/40 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Rémunération plateforme</p>
                  <p className="text-xs text-gray-500">3 sources de revenus côté Goroti</p>
                </div>
              </div>
              {revenueOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {revenueOpen && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLATFORM_REVENUE.map((r, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {r.icon}
                      <span className="text-sm font-bold text-white">{r.source}</span>
                    </div>
                    <p className="text-xs text-gray-500 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full inline-block">{r.type}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Compliance */}
          <section>
            <button
              onClick={() => setComplianceOpen(!complianceOpen)}
              className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/30 border border-emerald-900/40 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Conditions obligatoires — Transparence</p>
                  <p className="text-xs text-gray-500">Conformité RGPD et engagements éditoriaux non négociables</p>
                </div>
              </div>
              {complianceOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {complianceOpen && (
              <div className="mt-3 space-y-2">
                {COMPLIANCE.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
                    <div className="flex-shrink-0 mt-0.5">{rule.icon}</div>
                    <p className="text-sm text-gray-200">{rule.rule}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Ecosystem */}
          <section>
            <button
              onClick={() => setEcosystemOpen(!ecosystemOpen)}
              className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-900/30 border border-amber-900/40 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Intégration dans l'écosystème</p>
                  <p className="text-xs text-gray-500">Le sponsor peut apparaître sur tous les espaces Goroti</p>
                </div>
              </div>
              {ecosystemOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {ecosystemOpen && (
              <div className="mt-3 bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex flex-wrap gap-2">
                  {ECOSYSTEM_TARGETS.map((target, i) => (
                    <div key={i} className="flex items-center gap-2 bg-amber-950/20 border border-amber-900/40 text-amber-300 text-sm px-4 py-2 rounded-full">
                      {target.icon}
                      {target.label}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Une seule campagne peut se diffuser sur l'ensemble des formats — cohérence de marque assurée sans friction.
                </p>
              </div>
            )}
          </section>

          {/* Platform comparison */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">Goroti vs les autres modèles</h2>
              <p className="text-gray-400 text-sm">La différence de philosophie publicitaire</p>
            </div>
            <div className="space-y-3">
              {PLATFORM_COMPARE.map((row, i) => (
                <div
                  key={i}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border p-5 ${
                    row.platform === 'Goroti'
                      ? 'bg-amber-950/15 border-amber-900/50'
                      : 'bg-gray-900 border-gray-800'
                  }`}
                >
                  <div className="w-28 flex-shrink-0">
                    <p className={`font-bold text-sm ${row.accent}`}>{row.platform}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm font-semibold ${row.accent}`}>{row.model}</span>
                      <span className="text-xs text-gray-600">{row.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
                      <div className={`h-full ${row.bar} rounded-full`} style={{ width: `${row.pct}%` }} />
                    </div>
                    <p className="text-xs text-gray-500">{row.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Results for each actor */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">Résultats pour chaque acteur</h2>
              <p className="text-gray-400 text-sm">Quand la publicité respecte l'expérience, tout le monde gagne</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  actor: 'Utilisateurs',
                  result: 'Tolèrent la publicité',
                  detail: 'Car elle apporte de la valeur contextuellement, sans jamais forcer ni interrompre.',
                  icon: <Eye className="w-5 h-5 text-blue-400" />,
                  color: 'border-blue-900/40 bg-blue-950/10',
                  accent: 'text-blue-400',
                },
                {
                  actor: 'Créateurs',
                  result: 'Gagnent plus',
                  detail: 'Rémunération basée sur les interactions réelles, pas sur la quantité d\'affichages.',
                  icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
                  color: 'border-emerald-900/40 bg-emerald-950/10',
                  accent: 'text-emerald-400',
                },
                {
                  actor: 'Marques',
                  result: 'Ciblent mieux',
                  detail: 'Contexte d\'intérêt réel — l\'audience est qualifiée naturellement par le contenu.',
                  icon: <Star className="w-5 h-5 text-amber-400" />,
                  color: 'border-amber-900/40 bg-amber-950/10',
                  accent: 'text-amber-400',
                },
              ].map((col, i) => (
                <div key={i} className={`${col.color} border rounded-2xl p-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-center">
                      {col.icon}
                    </div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{col.actor}</span>
                  </div>
                  <p className={`font-black text-base mb-2 ${col.accent}`}>{col.result}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{col.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Platform premium effect */}
          <section>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 bg-amber-900/30 border border-amber-900/50 flex items-center justify-center">
                <BadgeCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-bold text-white mb-1">La plateforme reste premium</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  En refusant les formats agressifs, Goroti préserve la qualité perçue de l'expérience.
                  Les marques accèdent à une audience engagée — pas à une audience captive.
                  Ce positionnement premium permet de facturer plus cher des emplacements plus qualitatifs.
                </p>
              </div>
            </div>
          </section>

          {/* Synthesis */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-900/30 border border-amber-900/50 flex items-center justify-center mx-auto mb-5">
                <Briefcase className="w-7 h-7 text-amber-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">
                Publicité = contenu intégré<br />
                <span className="text-amber-400">Pas = interruption forcée</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                On ne monétise pas l'attention captive.<br />
                On monétise l'intérêt réel.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('partner-program')}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors"
                >
                  <Briefcase className="w-4 h-4" /> Programme partenaire
                </button>
                <button
                  onClick={() => onNavigate('revenue-model')}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-6 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  <ArrowRight className="w-4 h-4" /> Modèle de revenus
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
