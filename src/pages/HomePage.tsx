import { Link } from 'react-router-dom';
import {
  Sparkles,
  Trophy,
  Play,
  Music,
  Zap,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative section">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-semibold">
                La nouvelle ère du streaming
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Bienvenue sur{' '}
              <span className="text-gradient text-gradient-primary">GOROTI</span>
            </h1>

            <p className="text-xl md:text-2xl text-neutral-300 mb-12 leading-relaxed">
              La plateforme complète pour le streaming vidéo, le gaming compétitif,
              et la musique. Rejoignez une communauté qui récompense l'excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary text-lg">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/explore" className="btn btn-outline text-lg">
                Explorer la plateforme
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>1.2M utilisateurs actifs</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-neutral-800"></div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>50K+ créateurs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-neutral-900/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-neutral-400">
              Une plateforme complète pour créer, partager et grandir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/legende"
              className="card card-hover p-8 group animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                LÉGENDE
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Le système de prestige qui récompense le contenu exceptionnel avec 4
                niveaux d'excellence.
              </p>
            </Link>

            <Link
              to="/gaming"
              className="card card-hover p-8 group animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                Gaming
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Tournois, classements, et récompenses. Participez aux compétitions et
                gagnez des TruCoins.
              </p>
            </Link>

            <Link
              to="/live"
              className="card card-hover p-8 group animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <Play className="w-7 h-7 text-white" fill="white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                Live Streaming
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Streamez en direct, interagissez avec votre audience, et monétisez votre
                passion.
              </p>
            </Link>

            <Link
              to="/music"
              className="card card-hover p-8 group animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Music className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                Music
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Partagez votre musique, créez des albums, et vendez vos tracks
                directement aux fans.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-semibold">
                  Économie virtuelle
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                TruCoins : La monnaie du talent
              </h2>
              <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
                Gagnez des TruCoins en créant du contenu de qualité, en participant aux
                tournois, et en engageant votre communauté. Utilisez-les pour débloquer
                des fonctionnalités premium et soutenir vos créateurs préférés.
              </p>

              <ul className="space-y-4">
                {[
                  'Gagnez en streamant et en participant',
                  'Échangez contre des avantages exclusifs',
                  'Soutenez les créateurs que vous aimez',
                  'Système anti-fraude ultra-sécurisé',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                    </div>
                    <span className="text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative card p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl border border-cyan-500/20">
                    <TrendingUp className="w-8 h-8 text-cyan-400 mb-3" />
                    <div className="text-3xl font-bold mb-1">2.5M</div>
                    <div className="text-sm text-neutral-400">TruCoins distribués</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-xl border border-emerald-500/20">
                    <Users className="w-8 h-8 text-emerald-400 mb-3" />
                    <div className="text-3xl font-bold mb-1">150K</div>
                    <div className="text-sm text-neutral-400">Transactions actives</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-amber-500/10 to-transparent rounded-xl border border-amber-500/20">
                    <Trophy className="w-8 h-8 text-amber-400 mb-3" />
                    <div className="text-3xl font-bold mb-1">50K+</div>
                    <div className="text-sm text-neutral-400">Récompenses gagnées</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl border border-blue-500/20">
                    <Shield className="w-8 h-8 text-blue-400 mb-3" />
                    <div className="text-3xl font-bold mb-1">99.9%</div>
                    <div className="text-sm text-neutral-400">Sécurité garantie</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à commencer votre aventure ?
            </h2>
            <p className="text-xl text-neutral-300 mb-10">
              Rejoignez des milliers de créateurs qui font déjà partie de la communauté
              GOROTI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary text-lg">
                Créer un compte gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="btn btn-secondary text-lg">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
