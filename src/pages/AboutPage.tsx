import {
  Target, Heart, Shield, Users, TrendingUp, Globe, Eye,
  Award, Zap, Lock, Play
} from 'lucide-react';
import Header from '../components/Header';

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
              TruTube : La vérité au cœur du contenu
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
              <h2 className="text-3xl font-bold text-white mb-4">Pourquoi TruTube existe</h2>
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
                    et que chaque créateur mérite une rémunération juste. TruTube n'est pas juste une plateforme :
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
                      globales de TruTube.
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
                      Fini les CPM mystérieux. Sur TruTube, les créateurs sont payés selon l'engagement
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
                valorisés équitablement, et où la communauté a son mot à dire. TruTube n'est que le début
                d'un écosystème plus large de plateformes décentralisées et transparentes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
                >
                  Rejoindre TruTube
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
    </>
  );
};
