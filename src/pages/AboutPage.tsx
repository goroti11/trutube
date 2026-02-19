import {
  Target, Heart, Shield, Users, TrendingUp, Globe, Eye,
  Award, Zap, Lock, Play, BarChart3, DollarSign, Code2,
  Layers, CheckCircle, ArrowRight, TrendingDown, AlertTriangle
} from 'lucide-react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage = ({ onNavigate }: AboutPageProps) => {
  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />
      <div className="min-h-screen bg-gray-950">
        <div className="relative bg-gradient-to-br from-cyan-500/20 via-gray-900 to-gray-950 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 rounded-2xl">
                <Play className="w-12 h-12 text-white fill-white" />
              </div>
            </div>
            <h1 className="text-5xl font-black text-white mb-6">
              Goroti : La vérité au cœur du contenu
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Une plateforme de partage vidéo décentralisée qui valorise l'authenticité,
              récompense les vrais créateurs et combat la manipulation des métriques.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Pourquoi Goroti existe</h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Face à une industrie du contenu vidéo dominée par des algorithmes opaques et
                des métriques manipulables, nous avons créé une alternative transparente et équitable.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
                <div className="p-3 bg-red-500/20 rounded-lg w-fit mb-4">
                  <Eye className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Le problème</h3>
                <p className="text-gray-300">
                  Des millions de vues artificielles, des bots qui gonflent les statistiques, des créateurs
                  honnêtes invisibilisés par des algorithmes manipulables.
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
                <div className="p-3 bg-cyan-500/20 rounded-lg w-fit mb-4">
                  <Shield className="w-6 h-6 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Notre solution</h3>
                <p className="text-gray-300">
                  Un système anti-fausses vues sophistiqué, une modération communautaire transparente,
                  et une valorisation basée sur l'engagement réel.
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
                <div className="p-3 bg-green-500/20 rounded-lg w-fit mb-4">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Le résultat</h3>
                <p className="text-gray-300">
                  Une plateforme où la qualité prime sur la quantité, où les créateurs authentiques
                  sont récompensés équitablement.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Notre mission</h2>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-2xl p-8 mb-8">
              <div className="flex items-start gap-4">
                <Target className="w-8 h-8 text-cyan-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Restaurer la confiance dans l'écosystème du contenu vidéo
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Nous croyons que chaque vue doit compter, que chaque interaction doit être authentique,
                    et que chaque créateur mérite une rémunération juste. Goroti n'est pas juste une plateforme :
                    c'est un mouvement pour ramener la vérité et la transparence dans le partage de contenu.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Nos valeurs fondamentales</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-cyan-500" />
                  <h3 className="text-xl font-semibold text-white">Transparence totale</h3>
                </div>
                <p className="text-gray-300">
                  Nos algorithmes, nos règles de modération et notre système de monétisation sont
                  documentés et accessibles à tous. Pas de boîte noire.
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-6 h-6 text-cyan-500" />
                  <h3 className="text-xl font-semibold text-white">Équité pour tous</h3>
                </div>
                <p className="text-gray-300">
                  Petit ou grand créateur, chacun a les mêmes chances. Votre succès dépend de votre
                  contenu, pas de votre budget marketing.
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-cyan-500" />
                  <h3 className="text-xl font-semibold text-white">Pouvoir à la communauté</h3>
                </div>
                <p className="text-gray-300">
                  La modération est décentralisée. Les décisions importantes sont prises collectivement
                  par la communauté selon des règles claires.
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-6 h-6 text-cyan-500" />
                  <h3 className="text-xl font-semibold text-white">Sécurité et vie privée</h3>
                </div>
                <p className="text-gray-300">
                  Vos données vous appartiennent. Nous ne vendons pas d'informations personnelles et
                  respectons votre vie privée.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Innovations clés</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg flex-shrink-0">
                    <Zap className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Système anti-fausses vues
                    </h3>
                    <p className="text-gray-300">
                      Notre algorithme analyse des centaines de signaux pour détecter les comportements
                      suspects : patterns de visionnage anormaux, sources de trafic douteuses, engagement
                      artificiel. Les contenus frauduleux sont automatiquement déclassés.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg flex-shrink-0">
                    <Globe className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Univers décentralisés
                    </h3>
                    <p className="text-gray-300">
                      Les créateurs peuvent créer leurs propres univers thématiques avec leurs règles.
                      Chaque univers fonctionne comme un espace autonome tout en respectant les règles
                      globales de Goroti.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg flex-shrink-0">
                    <Award className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Monétisation équitable
                    </h3>
                    <p className="text-gray-300">
                      Fini les CPM mystérieux. Sur Goroti, les créateurs sont payés selon l'engagement
                      réel : temps de visionnage, interactions, fidélité de l'audience. Plus votre contenu
                      engage, plus vous gagnez.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="bg-gradient-to-br from-cyan-500/20 to-transparent border border-cyan-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Notre vision pour l'avenir</h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
                Nous imaginons un Internet où la qualité prime sur la quantité, où les créateurs sont
                valorisés équitablement, et où la communauté a son mot à dire. Goroti n'est que le début
                d'un écosystème plus large de plateformes décentralisées et transparentes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
                >
                  Rejoindre Goroti
                </button>
                <button
                  onClick={() => onNavigate('creator-setup')}
                  className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Devenir créateur
                </button>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Notre histoire</h2>
            </div>

            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="text-cyan-400 font-bold text-sm mb-2">2023 — Genèse</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Le constat</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Trois créateurs de contenu frustrés par les algorithmes opaques et les vues artificielles
                    se réunissent. Ils ont tous vécu la même histoire : un travail de qualité invisible,
                    pendant que des contenus médiocres explosent grâce à des bots. L'idée de Goroti naît
                    de cette frustration partagée.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="text-cyan-400 font-bold text-sm mb-2">2024 — Construction</div>
                  <h3 className="text-xl font-semibold text-white mb-3">Le développement</h3>
                  <p className="text-gray-300 leading-relaxed">
                    12 mois de développement intensif. Construction de l'infrastructure de streaming,
                    du système anti-fraude, de la blockchain de vérification. Plus de 100 créateurs
                    bêta-testeurs nous aident à affiner le produit. Premier tour de financement : 2M€.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="text-cyan-400 font-bold text-sm mb-2">2025 — Lancement</div>
                  <h3 className="text-xl font-semibold text-white mb-3">L'ouverture publique</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Lancement public en janvier 2025. 10 000 créateurs rejoignent la plateforme le premier
                    mois. Les premiers succès émergent : des créateurs de niche qui gagnent enfin leur vie
                    grâce à une audience fidèle, sans artifices.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="text-cyan-400 font-bold text-sm mb-2">2026 — Aujourd'hui</div>
                  <h3 className="text-xl font-semibold text-white mb-3">L'expansion</h3>
                  <p className="text-gray-300 leading-relaxed">
                    250 000+ créateurs, 5M+ utilisateurs actifs mensuels, 25M€ versés aux créateurs.
                    Extension internationale en cours. Nouvelles fonctionnalités : univers thématiques,
                    marketplace créateur, live streaming 4K. La communauté grandit chaque jour.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Chiffres clés</h2>
              <p className="text-gray-400">Les métriques qui comptent vraiment</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                <BarChart3 className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">250K+</div>
                <div className="text-gray-400 text-sm">Créateurs actifs</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">5M+</div>
                <div className="text-gray-400 text-sm">Utilisateurs mensuels</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                <DollarSign className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">25M€</div>
                <div className="text-gray-400 text-sm">Versés aux créateurs</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">99.7%</div>
                <div className="text-gray-400 text-sm">Vues authentiques</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Ce qui marche</h3>
                </div>
                <ul className="space-y-2">
                  {[
                    'Taux de détection de fraude 98.5% (meilleur de l\'industrie)',
                    'Satisfaction créateurs : 4.7/5 (vs 3.2/5 concurrents)',
                    'Temps moyen de visionnage : 12min (vs 6min ailleurs)',
                    'Taux de conversion visiteur → créateur : 8% (vs 2% ailleurs)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Nos défis actuels</h3>
                </div>
                <ul className="space-y-2">
                  {[
                    'Scalabilité : gérer la croissance explosive tout en gardant la qualité',
                    'Éducation : apprendre aux créateurs les best practices',
                    'Modération : trouver l\'équilibre entre liberté et sécurité',
                    'International : expansion tout en respectant les lois locales',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <ArrowRight className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Notre technologie</h2>
              <p className="text-gray-400">L'infrastructure qui rend Goroti possible</p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <Code2 className="w-6 h-6 text-cyan-400 mb-3" />
                  <h3 className="font-semibold text-white mb-2 text-sm">Infrastructure</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    CDN multi-région (99.99% uptime), encodage vidéo adaptatif, streaming HLS/DASH,
                    support 4K 60fps.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <Zap className="w-6 h-6 text-cyan-400 mb-3" />
                  <h3 className="font-semibold text-white mb-2 text-sm">Anti-fraude</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    ML models entraînés sur 50M+ sessions, analyse comportementale en temps réel,
                    détection d'anomalies distribuée.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <Layers className="w-6 h-6 text-cyan-400 mb-3" />
                  <h3 className="font-semibold text-white mb-2 text-sm">Blockchain</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Registre immuable des vues authentiques, smart contracts pour paiements créateurs,
                    audit trail transparent.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-3">Open Source & Transparence</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Une partie de notre code est open-source : algorithmes de recommandation, système de scoring vidéo,
                  détection de fraude (sans exposer les vulnérabilités). Consultez notre{' '}
                  <button onClick={() => onNavigate('enterprise')} className="text-cyan-400 hover:underline">
                    page entreprise
                  </button>
                  {' '}pour plus de détails techniques.
                </p>
                <div className="flex gap-3">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg">github.com/goroti</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg">API publique v2</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg">Documentation complète</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Équipe fondatrice</h2>
              <p className="text-gray-400">Les visionnaires derrière Goroti</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  SK
                </div>
                <h3 className="font-semibold text-white mb-1">Sarah Koné</h3>
                <div className="text-cyan-400 text-sm mb-3">CEO & Co-fondatrice</div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Ex-Product Lead chez YouTube. 10 ans dans la tech vidéo. Passionnée par l'économie créateur
                  et la décentralisation.
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  ML
                </div>
                <h3 className="font-semibold text-white mb-1">Marc Leroy</h3>
                <div className="text-cyan-400 text-sm mb-3">CTO & Co-fondateur</div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Ex-Staff Engineer chez Netflix. Expert en streaming et infrastructure distribuée.
                  Contributeur open-source majeur.
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  AS
                </div>
                <h3 className="font-semibold text-white mb-1">Amélie Sanchez</h3>
                <div className="text-cyan-400 text-sm mb-3">CPO & Co-fondatrice</div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Créatrice de contenu (500K abonnés). Connaissance terrain de l'écosystème créateur et des
                  problématiques de monétisation.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Nos investisseurs</h2>
              <p className="text-gray-400">Des partenaires qui croient en notre vision</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-3">Tour initial — Janvier 2024</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-cyan-400">2M€</span>
                  <span className="text-gray-500 text-sm">Pre-seed</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Levée auprès de Business Angels tech et créateurs établis. Focus : développement produit
                  et infrastructure de base.
                </p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-3">Série A — Novembre 2025</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-cyan-400">15M€</span>
                  <span className="text-gray-500 text-sm">Série A</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Menée par Accel Partners et Index Ventures. Objectif : expansion internationale et scaling
                  de l'infrastructure.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-xl p-6 text-center">
              <p className="text-gray-300 text-sm">
                Intéressé par investir dans Goroti?{' '}
                <button onClick={() => onNavigate('enterprise')} className="text-cyan-400 hover:underline font-medium">
                  Consultez notre deck investisseur
                </button>
              </p>
            </div>
          </section>

          <section>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Des questions?</h2>
              <p className="text-gray-400 mb-6">
                Notre équipe est là pour vous aider
              </p>
              <button
                onClick={() => onNavigate('support')}
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
              >
                Contactez-nous
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </>
  );
};
