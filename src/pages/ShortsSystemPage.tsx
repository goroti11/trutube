import { useState } from 'react';
import {
  Zap, Video, ShoppingBag, Play, ArrowRight, Target, BarChart3,
  Clock, Scissors, Upload, Cpu, Eye, TrendingUp, ShieldCheck,
  Lock, CheckCircle, ChevronDown, ChevronUp, MousePointerClick,
  Repeat, Music, DollarSign, Layers, AlertTriangle
} from 'lucide-react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface Props {
  onNavigate: (page: string) => void;
}

const CREATION_MODES = [
  {
    icon: <Cpu className="w-5 h-5" />,
    label: 'Auto',
    desc: 'L\'IA analyse la vidéo et propose automatiquement les meilleurs extraits (hook fort, refrain, moment clé).',
    color: 'bg-red-900/20 border-red-900/50',
    accent: 'text-red-400',
    badge: 'IA',
    badgeColor: 'bg-red-900/40 text-red-400',
  },
  {
    icon: <Scissors className="w-5 h-5" />,
    label: 'Manuel',
    desc: 'Sélection précise par timestamps. Le créateur choisit le début et la fin de l\'extrait sur la timeline.',
    color: 'bg-blue-900/20 border-blue-900/50',
    accent: 'text-blue-400',
    badge: 'Contrôle',
    badgeColor: 'bg-blue-900/40 text-blue-400',
  },
  {
    icon: <Upload className="w-5 h-5" />,
    label: 'Upload direct',
    desc: 'Upload d\'un court format pré-monté. Liaison manuelle à une vidéo source existante obligatoire.',
    color: 'bg-emerald-900/20 border-emerald-900/50',
    accent: 'text-emerald-400',
    badge: 'Flexible',
    badgeColor: 'bg-emerald-900/40 text-emerald-400',
  },
];

const CTA_TYPES = [
  { type: 'Vidéo gratuite', label: 'Regarder maintenant', color: 'bg-blue-600', icon: <Play className="w-3.5 h-3.5" /> },
  { type: 'Vidéo premium', label: 'Débloquer', color: 'bg-red-600', icon: <Lock className="w-3.5 h-3.5" /> },
  { type: 'Location 48h', label: 'Louer', color: 'bg-amber-600', icon: <Clock className="w-3.5 h-3.5" /> },
  { type: 'Album complet', label: 'Voir l\'album', color: 'bg-emerald-600', icon: <Music className="w-3.5 h-3.5" /> },
];

const ALGO_SIGNALS = [
  { signal: 'Taux de complétion', weight: 95, desc: 'Proportion de spectateurs qui regardent jusqu\'à la fin', color: 'bg-red-600' },
  { signal: 'Clic vers vidéo complète', weight: 90, desc: 'CTR depuis le short vers la vidéo source', color: 'bg-orange-500' },
  { signal: 'Achat après visionnage', weight: 85, desc: 'Conversion directe short → achat ou abonnement', color: 'bg-amber-500' },
  { signal: 'Relecture', weight: 70, desc: 'Nombre de replays sur le même court format', color: 'bg-yellow-500' },
  { signal: 'Likes / commentaires', weight: 30, desc: 'Signal secondaire — pas le critère principal', color: 'bg-gray-600' },
];

const STATS = [
  { stat: 'Vues', desc: 'Total absolu', icon: <Eye className="w-4 h-4" /> },
  { stat: 'Taux complétion', desc: '% jusqu\'à la fin', icon: <Clock className="w-4 h-4" /> },
  { stat: 'CTR vidéo', desc: 'Clics vers vidéo complète', icon: <MousePointerClick className="w-4 h-4" /> },
  { stat: 'Conversions', desc: 'Achats générés via short', icon: <ShoppingBag className="w-4 h-4" /> },
  { stat: 'Revenus', desc: 'Montant généré', icon: <DollarSign className="w-4 h-4" /> },
  { stat: 'Watch-time post-clic', desc: 'Durée sur vidéo complète', icon: <BarChart3 className="w-4 h-4" /> },
];

const PLATFORM_COMPARE = [
  { platform: 'TikTok', role: 'Divertissement', goal: 'Rétention maximale', value: 'Temps passé', accent: 'text-gray-400', bar: 'bg-gray-700' },
  { platform: 'YouTube Shorts', role: 'Visibilité', goal: 'Croissance chaîne', value: 'Abonnés', accent: 'text-gray-400', bar: 'bg-gray-700' },
  { platform: 'Goroti Shorts', role: 'Tunnel de conversion', goal: 'Transaction', value: 'Revenu direct', accent: 'text-red-400', bar: 'bg-red-600' },
];

const ANTI_PIRACY = [
  { rule: 'Short limité à 40% de la durée de la vidéo source', icon: <Lock className="w-4 h-4 text-red-400" /> },
  { rule: 'Impossible d\'enchaîner tous les segments d\'une même vidéo', icon: <ShieldCheck className="w-4 h-4 text-red-400" /> },
  { rule: 'Détection automatique de tentative de reconstruction', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
];

const PARAMS = [
  { param: 'Début extrait', desc: 'Timestamp précis (hh:mm:ss)', required: true },
  { param: 'Fin extrait', desc: 'Timestamp précis (hh:mm:ss)', required: true },
  { param: 'Durée max', desc: '60 secondes strictement', required: true },
  { param: 'Titre court', desc: 'Court et percutant — optionnel', required: false },
  { param: 'Call-to-action', desc: 'Bouton d\'action — obligatoire', required: true },
  { param: 'Lien cible', desc: 'Auto-lié à la vidéo source', required: true },
];

export default function ShortsSystemPage({ onNavigate }: Props) {
  const [algoOpen, setAlgoOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [paramsOpen, setParamsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="mt-16">

        {/* Hero */}
        <div className="relative overflow-hidden border-b border-gray-900">
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/25 via-gray-950 to-gray-950" />
          <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
            <span className="inline-block text-xs font-semibold tracking-widest text-red-400 uppercase mb-4 bg-red-950/40 border border-red-900/50 px-4 py-1.5 rounded-full">
              Module — Section 16
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
              Shorts — Extraits<br />
              <span className="text-red-400">Promotionnels Intelligents</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-base mb-6">
              Le short n'est pas une fin de contenu. C'est un point d'entrée transactionnel vers l'œuvre complète.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {['Tunnel de conversion', 'Bande-annonce native', 'Acquisition fans', 'Levier premium'].map(tag => (
                <span key={tag} className="text-xs text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

          {/* Core mechanic */}
          <section>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-900/30 border border-red-900/50 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Un short est obligatoirement lié à sa source</h2>
                  <p className="text-xs text-gray-500">Principe fondamental — Section 16.2</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
                {[
                  { label: 'Vidéo complète', sub: 'contenu source', icon: <Video className="w-4 h-4" />, color: 'border-gray-700 bg-gray-800/60' },
                  { label: 'Segments sélectionnés', sub: 'extrait ≤ 60s', icon: <Scissors className="w-4 h-4" />, color: 'border-gray-700 bg-gray-800/60' },
                  { label: 'Short publié', sub: 'format court lié', icon: <Play className="w-4 h-4" />, color: 'border-red-900/50 bg-red-950/20' },
                  { label: 'Redirection automatique', sub: 'CTA vers source', icon: <ArrowRight className="w-4 h-4" />, color: 'border-green-900/50 bg-green-950/20' },
                ].map((step, i, arr) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className={`w-full border ${step.color} rounded-xl p-4 text-center`}>
                      <div className="flex justify-center mb-2 text-gray-400">{step.icon}</div>
                      <p className="text-sm font-semibold text-white">{step.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.sub}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="hidden sm:flex items-center justify-center w-6">
                        <ArrowRight className="w-4 h-4 text-gray-600 absolute" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: 'Augmente la découverte', icon: <Eye className="w-4 h-4 text-blue-400" />, bg: 'bg-blue-950/20 border-blue-900/40' },
                  { label: 'Convertit vers le long', icon: <TrendingUp className="w-4 h-4 text-amber-400" />, bg: 'bg-amber-950/20 border-amber-900/40' },
                  { label: 'Génère des achats', icon: <ShoppingBag className="w-4 h-4 text-green-400" />, bg: 'bg-green-950/20 border-green-900/40' },
                ].map((item, i) => (
                  <div key={i} className={`${item.bg} border rounded-xl p-3 flex items-center gap-2`}>
                    {item.icon}
                    <span className="text-sm font-medium text-gray-200">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Creation modes */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">3 méthodes de création</h2>
              <p className="text-gray-400 text-sm">Selon votre workflow et niveau de contrôle souhaité</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CREATION_MODES.map((mode, i) => (
                <div key={i} className={`${mode.color} border rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gray-900/60 flex items-center justify-center ${mode.accent}`}>
                      {mode.icon}
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${mode.badgeColor}`}>{mode.badge}</span>
                  </div>
                  <h3 className={`text-base font-bold mb-2 ${mode.accent}`}>{mode.label}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{mode.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Configurable params */}
          <section>
            <button
              onClick={() => setParamsOpen(!paramsOpen)}
              className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Paramètres configurables</p>
                  <p className="text-xs text-gray-500">Tous les réglages disponibles lors de la création d'un short</p>
                </div>
              </div>
              {paramsOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {paramsOpen && (
              <div className="mt-3 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-800/40">
                      <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Paramètre</th>
                      <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Description</th>
                      <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {PARAMS.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-3 font-medium text-white">{p.param}</td>
                        <td className="px-5 py-3 text-gray-400">{p.desc}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.required ? 'bg-red-900/30 text-red-400' : 'bg-gray-800 text-gray-500'}`}>
                            {p.required ? 'Requis' : 'Optionnel'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* CTA at end of short */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">Call-to-Action automatique</h2>
              <p className="text-gray-400 text-sm">Affiché plein écran à la fin de chaque short — adapté au type de contenu lié</p>
            </div>

            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-red-400 to-transparent" />
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {CTA_TYPES.map((cta, i) => (
                    <div key={i} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{cta.type}</p>
                        <div className={`inline-flex items-center gap-2 ${cta.color} text-white text-sm font-bold px-4 py-2 rounded-lg`}>
                          {cta.icon}
                          {cta.label}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    </div>
                  ))}
                </div>
                <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4">
                  <p className="text-sm text-gray-300">
                    <span className="text-red-400 font-semibold">Redirection immédiate au clic.</span>{' '}
                    Le short agit comme un trailer commercial intégré. Un album premium → short → page album → achat → lecture complète.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Algorithm */}
          <section>
            <button
              onClick={() => setAlgoOpen(!algoOpen)}
              className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-900/30 border border-amber-900/40 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Algorithme de diffusion</p>
                  <p className="text-xs text-gray-500">Conversion {'>'} likes — les créateurs performants commercialement sont favorisés</p>
                </div>
              </div>
              {algoOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {algoOpen && (
              <div className="mt-3 bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
                {ALGO_SIGNALS.map((sig, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-gray-200">{sig.signal}</p>
                      <span className="text-xs text-gray-500">{sig.weight}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{sig.desc}</p>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${sig.bar} rounded-full transition-all`} style={{ width: `${sig.weight}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                  Les signaux de conversion pèsent 3× plus que les signaux d'engagement classiques.
                </p>
              </div>
            )}
          </section>

          {/* Stats */}
          <section>
            <button
              onClick={() => setStatsOpen(!statsOpen)}
              className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-900/40 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Shorts Analytics — Studio</p>
                  <p className="text-xs text-gray-500">6 métriques disponibles dans le tableau de bord créateur</p>
                </div>
              </div>
              {statsOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {statsOpen && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STATS.map((s, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                      {s.icon}
                      <span className="text-sm font-bold text-white">{s.stat}</span>
                    </div>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Anti-piracy */}
          <section>
            <div className="bg-red-950/10 border border-red-900/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-900/30 border border-red-900/50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Règles anti-piratage — Contenus premium</h2>
                  <p className="text-xs text-red-400/70">Section 16.8 — Protections automatiques</p>
                </div>
              </div>
              <div className="space-y-3">
                {ANTI_PIRACY.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                    <div className="flex-shrink-0 mt-0.5">{rule.icon}</div>
                    <p className="text-sm text-gray-200">{rule.rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Platform comparison */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">Goroti vs les autres formats</h2>
              <p className="text-gray-400 text-sm">La différence fondamentale d'objectif</p>
            </div>
            <div className="space-y-3">
              {PLATFORM_COMPARE.map((row, i) => (
                <div
                  key={i}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border p-5 ${
                    row.platform === 'Goroti Shorts'
                      ? 'bg-red-950/15 border-red-900/50'
                      : 'bg-gray-900 border-gray-800'
                  }`}
                >
                  <div className="w-32 flex-shrink-0">
                    <p className={`font-bold text-sm ${row.accent}`}>{row.platform}</p>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Rôle</p>
                      <p className="text-gray-300">{row.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Objectif</p>
                      <p className="text-gray-300">{row.goal}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Valeur mesurée</p>
                      <p className={`font-semibold ${row.accent}`}>{row.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Impact ecosystem */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">Impact sur l'écosystème</h2>
              <p className="text-gray-400 text-sm">Ce que le short devient pour chaque acteur</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Pour le créateur',
                  icon: <Zap className="w-5 h-5 text-red-400" />,
                  color: 'border-red-900/40 bg-red-950/10',
                  items: ['Outil marketing interne gratuit', 'Bande-annonce album native', 'Acquisition de nouveaux fans', 'Levier direct vers revenus'],
                },
                {
                  title: 'Pour la plateforme',
                  icon: <Layers className="w-5 h-5 text-blue-400" />,
                  color: 'border-blue-900/40 bg-blue-950/10',
                  items: ['Remplace l\'annonceur publicitaire par le fan', 'Attention courte → revenu long', 'Algorithme orienté valeur réelle', 'Croissance organique des transactions'],
                },
              ].map((col, i) => (
                <div key={i} className={`${col.color} border rounded-2xl p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-center">
                      {col.icon}
                    </div>
                    <h3 className="font-bold text-white text-sm">{col.title}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Synthesis banner */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-red-900/30 border border-red-900/50 flex items-center justify-center mx-auto mb-5">
                <Target className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">Transformer l'attention courte<br />en revenu long</h2>
              <p className="text-gray-400 text-sm mb-6">
                Le short Goroti n'est pas un contenu de divertissement autonome.<br />
                C'est un levier commercial natif, conçu pour chaque étape du tunnel de conversion.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('studio')}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors"
                >
                  <Zap className="w-4 h-4" /> Créer un short
                </button>
                <button
                  onClick={() => onNavigate('upload')}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-6 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  <Upload className="w-4 h-4" /> Uploader une vidéo
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
