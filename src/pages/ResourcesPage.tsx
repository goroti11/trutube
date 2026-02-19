import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  Book, Video, FileText, Users, TrendingUp, Shield, PlayCircle, DollarSign,
  Scale, Cog, Wallet, AlertCircle, HelpCircle, Search, ChevronRight,
  BookOpen, ShoppingBag, Music, Globe, MessageSquare, Newspaper, Activity,
  CheckCircle, Code, Settings
} from 'lucide-react';

interface ResourcesPageProps {
  onNavigate: (page: string) => void;
}

export default function ResourcesPage({ onNavigate }: ResourcesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tout', icon: Book },
    { id: 'getting-started', label: 'Démarrage', icon: PlayCircle },
    { id: 'creators', label: 'Créateurs', icon: Video },
    { id: 'payments', label: 'Paiements', icon: Wallet },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'account', label: 'Compte', icon: Users },
  ];

  const articles = [
    {
      category: 'getting-started',
      title: 'Créer un compte Goroti',
      description: 'Guide complet pour démarrer sur la plateforme',
      icon: Users,
      color: 'text-cyan-400',
    },
    {
      category: 'getting-started',
      title: 'Créer votre première chaîne',
      description: 'Configuration et personnalisation de votre chaîne',
      icon: PlayCircle,
      color: 'text-cyan-400',
    },
    {
      category: 'getting-started',
      title: 'Vérification d\'identité (KYC)',
      description: 'Processus de vérification pour la monétisation',
      icon: CheckCircle,
      color: 'text-cyan-400',
    },
    {
      category: 'creators',
      title: 'Publier votre première vidéo',
      description: 'Upload, métadonnées et optimisation',
      icon: Video,
      color: 'text-blue-400',
    },
    {
      category: 'creators',
      title: 'Vendre un album ou contenu premium',
      description: 'Configuration de prix et droits d\'accès',
      icon: Music,
      color: 'text-blue-400',
    },
    {
      category: 'creators',
      title: 'Configurer les royalties partagés',
      description: 'Splits automatiques pour collaborations',
      icon: TrendingUp,
      color: 'text-blue-400',
    },
    {
      category: 'creators',
      title: 'Stratégie de tarification',
      description: 'Définir les prix optimaux pour votre contenu',
      icon: DollarSign,
      color: 'text-blue-400',
    },
    {
      category: 'creators',
      title: 'Utiliser les Shorts',
      description: 'Format court pour promotion et engagement',
      icon: PlayCircle,
      color: 'text-blue-400',
    },
    {
      category: 'payments',
      title: 'Acheter du contenu',
      description: 'Paiements sécurisés et accès immédiat',
      icon: ShoppingBag,
      color: 'text-green-400',
    },
    {
      category: 'payments',
      title: 'Utiliser TruCoin',
      description: 'Wallet, recharge et conversion',
      icon: Wallet,
      color: 'text-green-400',
    },
    {
      category: 'payments',
      title: 'Retrait de revenus',
      description: 'Seuils, délais et méthodes de paiement',
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      category: 'payments',
      title: 'Délais bancaires',
      description: 'Comprendre les délais de virement',
      icon: AlertCircle,
      color: 'text-green-400',
    },
    {
      category: 'security',
      title: 'Protection copyright',
      description: 'Signaler une violation de droits d\'auteur',
      icon: Shield,
      color: 'text-red-400',
    },
    {
      category: 'security',
      title: 'Signalement de contenu',
      description: 'Procédure de signalement et modération',
      icon: AlertCircle,
      color: 'text-red-400',
    },
    {
      category: 'security',
      title: 'Contestation DMCA',
      description: 'Comment contester un retrait de contenu',
      icon: Scale,
      color: 'text-red-400',
    },
    {
      category: 'security',
      title: 'Suppression de contenu',
      description: 'Politique et procédure de suppression',
      icon: FileText,
      color: 'text-red-400',
    },
    {
      category: 'marketplace',
      title: 'Commander un service',
      description: 'Marketplace de services créateurs',
      icon: ShoppingBag,
      color: 'text-yellow-400',
    },
    {
      category: 'marketplace',
      title: 'Livrer un travail',
      description: 'Validation et livraison client',
      icon: CheckCircle,
      color: 'text-yellow-400',
    },
    {
      category: 'marketplace',
      title: 'Litiges et escrow',
      description: 'Résolution des conflits marketplace',
      icon: Scale,
      color: 'text-yellow-400',
    },
    {
      category: 'account',
      title: 'Récupération de mot de passe',
      description: 'Réinitialiser l\'accès à votre compte',
      icon: Settings,
      color: 'text-gray-400',
    },
    {
      category: 'account',
      title: 'Récupération de compte',
      description: 'Procédure en cas de compte bloqué',
      icon: HelpCircle,
      color: 'text-gray-400',
    },
    {
      category: 'account',
      title: 'Suppression de compte',
      description: 'Supprimer définitivement votre compte',
      icon: AlertCircle,
      color: 'text-gray-400',
    },
    {
      category: 'account',
      title: 'Confidentialité et données',
      description: 'Gestion de vos données personnelles',
      icon: Shield,
      color: 'text-gray-400',
    },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const blogPosts = [
    { title: 'Nouvelles fonctionnalités - Janvier 2026', category: 'Produit', date: '15 Jan 2026' },
    { title: '10 conseils pour monétiser votre contenu', category: 'Créateurs', date: '10 Jan 2026' },
    { title: 'Tendances musique streaming 2026', category: 'Industrie', date: '5 Jan 2026' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
              Centre de Ressources
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Documentation complète, guides pratiques et assistance pour utiliser Goroti
            </p>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === id
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Documentation & Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article, index) => (
              <button
                key={index}
                className="flex items-start gap-4 p-5 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-cyan-600/50 hover:bg-gray-800 transition-all text-left group"
              >
                <div className="p-2.5 bg-gray-900 rounded-lg shrink-0 group-hover:bg-gray-800 transition-colors">
                  <article.icon className={`w-5 h-5 ${article.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {article.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Blog Officiel</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-cyan-600/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span className="px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                <button className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">
                  Lire l'article <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">État de la Plateforme</h2>
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white font-semibold">Tous les systèmes opérationnels</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { service: 'Streaming vidéo', status: 'operational' },
                { service: 'Upload de contenu', status: 'operational' },
                { service: 'Système de paiements', status: 'operational' },
                { service: 'Retraits créateurs', status: 'operational' },
                { service: 'Marketplace', status: 'operational' },
              ].map(({ service, status }) => (
                <div key={service} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-300">{service}</span>
                  <span className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Opérationnel
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('status')}
              className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-2"
            >
              Voir l'historique complet <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Communauté Officielle</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { platform: 'X / Twitter', usage: 'Annonces rapides', icon: MessageSquare, color: 'text-sky-400' },
              { platform: 'Instagram', usage: 'Visuel & créateurs', icon: Activity, color: 'text-pink-400' },
              { platform: 'Discord', usage: 'Support communauté', icon: Users, color: 'text-indigo-400' },
              { platform: 'LinkedIn', usage: 'Corporate & B2B', icon: Briefcase, color: 'text-blue-400' },
            ].map(({ platform, usage, icon: Icon, color }) => (
              <div key={platform} className="bg-gray-800/30 border border-gray-700 rounded-xl p-5 hover:border-cyan-600/50 transition-colors cursor-pointer">
                <Icon className={`w-6 h-6 ${color} mb-3`} />
                <h3 className="text-white font-semibold mb-1">{platform}</h3>
                <p className="text-gray-400 text-sm">{usage}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-600/30 rounded-xl p-8 text-center">
            <HelpCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Besoin d'aide supplémentaire ?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Notre équipe support est disponible pour répondre à vos questions
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => onNavigate('support')}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
              >
                Contacter le Support
              </button>
              <button
                onClick={() => onNavigate('help')}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Centre d'Aide
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function Briefcase({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
