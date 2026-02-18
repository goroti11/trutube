import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Video,
  Radio,
  Users,
  DollarSign,
  BarChart3,
  MessageSquare,
  Settings,
  Handshake,
  Store,
  Layers,
  Upload,
  Play,
  TrendingUp,
  Eye,
  DollarSign as Revenue,
  UserPlus,
  AlertCircle,
  Shield,
  Clock,
  Target,
  Award,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MonetizationDashboard from '../components/studio/MonetizationDashboard';
import ContentGuidePanel from '../components/studio/ContentGuidePanel';
import { liveStreamService, LiveStream } from '../services/liveStreamService';

type StudioSection = 'dashboard' | 'content' | 'live' | 'community' | 'monetization' | 'analytics' | 'comments' | 'collaborations' | 'marketplace' | 'multi-channel' | 'settings';

interface CreatorStudioPageProps {
  onNavigate: (page: string) => void;
}

export default function CreatorStudioPage({ onNavigate }: CreatorStudioPageProps) {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState<StudioSection>('dashboard');

  const menuItems = [
    { id: 'dashboard' as StudioSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'content' as StudioSection, label: 'Contenus', icon: Video },
    { id: 'live' as StudioSection, label: 'Live', icon: Radio },
    { id: 'community' as StudioSection, label: 'Communauté', icon: Users },
    { id: 'monetization' as StudioSection, label: 'Monétisation', icon: DollarSign },
    { id: 'analytics' as StudioSection, label: 'Analytics', icon: BarChart3 },
    { id: 'comments' as StudioSection, label: 'Commentaires', icon: MessageSquare },
    { id: 'collaborations' as StudioSection, label: 'Collaborations', icon: Handshake },
    { id: 'marketplace' as StudioSection, label: 'Marketplace', icon: Store },
    { id: 'multi-channel' as StudioSection, label: 'Multi-chaînes', icon: Layers },
    { id: 'settings' as StudioSection, label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-950 border-r border-gray-800 fixed h-full">
        {/* Studio Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">TruTube</h1>
              <p className="text-gray-400 text-xs">Studio</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Back to Platform */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
          <button
            onClick={() => onNavigate('home')}
            className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
          >
            ← Retour à TruTube
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {currentSection === 'dashboard' && <DashboardSection />}
        {currentSection === 'content' && <ContentSection />}
        {currentSection === 'live' && <LiveSection onNavigate={onNavigate} />}
        {currentSection === 'community' && <CommunitySection />}
        {currentSection === 'monetization' && <MonetizationSection />}
        {currentSection === 'analytics' && <AnalyticsSection />}
        {currentSection === 'comments' && <CommentsSection />}
        {currentSection === 'collaborations' && <CollaborationsSection />}
        {currentSection === 'marketplace' && <MarketplaceSection />}
        {currentSection === 'multi-channel' && <MultiChannelSection />}
        {currentSection === 'settings' && <SettingsSection />}
      </div>
    </div>
  );
}

// Dashboard Section
function DashboardSection() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={Revenue}
          label="Revenus du mois"
          value="€1,247.50"
          change="+12%"
          positive
        />
        <MetricCard
          icon={Eye}
          label="Vues totales"
          value="127.4K"
          change="+8.3%"
          positive
        />
        <MetricCard
          icon={UserPlus}
          label="Nouveaux abonnés"
          value="+342"
          change="+15%"
          positive
        />
        <MetricCard
          icon={TrendingUp}
          label="Taux engagement"
          value="8.7%"
          change="+2.1%"
          positive
        />
      </div>

      {/* Performance Last Video */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Dernière vidéo publiée</h2>
        <div className="flex items-start gap-4">
          <img
            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop"
            alt="Dernière vidéo"
            className="w-48 h-28 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-2">
              Comment créer du contenu authentique
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Vues</p>
                <p className="text-white font-semibold">12,450</p>
              </div>
              <div>
                <p className="text-gray-400">J'aime</p>
                <p className="text-white font-semibold">1,230</p>
              </div>
              <div>
                <p className="text-gray-400">Durée moy.</p>
                <p className="text-white font-semibold">8:34</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Alerts */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          Alertes importantes
        </h2>
        <div className="space-y-3">
          <AlertItem
            type="success"
            message="Votre dernière vidéo a atteint 10K vues en 24h"
          />
          <AlertItem
            type="info"
            message="3 nouveaux commentaires en attente de modération"
          />
          <AlertItem
            type="warning"
            message="Vérification d'identité requise pour activer les paiements"
          />
        </div>
      </div>
    </div>
  );
}

// Content Section
function ContentSection() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Contenus</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
          <Upload className="w-5 h-5" />
          Uploader une vidéo
        </button>
      </div>

      {/* Content Guide Panel */}
      <div className="mb-8">
        <ContentGuidePanel />
      </div>

      {/* Video List */}
      <div className="bg-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Mes vidéos</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-700">
          <VideoListItem
            title="Comment créer du contenu authentique"
            views={12450}
            status="publié"
            date="Il y a 2 jours"
          />
          <VideoListItem
            title="Les secrets d'une bonne miniature"
            views={8230}
            status="publié"
            date="Il y a 5 jours"
          />
          <VideoListItem
            title="Live Q&A avec mes abonnés"
            views={0}
            status="programmé"
            date="Dans 3 jours"
          />
        </div>
      </div>
    </div>
  );
}

// Analytics Section with Traffic Quality
function AnalyticsSection() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Analytics</h1>

      {/* Traffic Quality - DIFFÉRENCIATION TRUTUBE */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border-2 border-red-600">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-white">Qualité du trafic</h2>
          <span className="ml-auto px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm font-semibold">
            Score: 94/100
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <QualityMetric
            label="Vues réelles"
            value="98.7%"
            icon={CheckCircle}
            positive
          />
          <QualityMetric
            label="Trafic suspect"
            value="1.3%"
            icon={AlertCircle}
            warning
          />
          <QualityMetric
            label="Bots bloqués"
            value="127"
            icon={Shield}
            neutral
          />
          <QualityMetric
            label="Engagement humain"
            value="8.7%"
            icon={Target}
            positive
          />
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            <span className="text-green-400 font-semibold">✓ Aucune vue suspecte détectée</span> sur les 7 derniers jours.
            Votre contenu est 100% authentique et conforme aux standards TruTube.
          </p>
        </div>
      </div>

      {/* Key Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Temps de visionnage réel</h3>
          <div className="text-4xl font-bold text-white mb-2">42h 18min</div>
          <p className="text-gray-400 text-sm">Durée moyenne: 8min 34s</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Taux de soutien financier</h3>
          <div className="text-4xl font-bold text-white mb-2">3.2%</div>
          <p className="text-gray-400 text-sm">342 abonnés actifs sur 10,642</p>
        </div>
      </div>

      {/* Universe Distribution */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Provenance univers</h3>
        <div className="space-y-3">
          <UniverseBar universe="Music" percentage={45} color="bg-purple-500" />
          <UniverseBar universe="Tech" percentage={30} color="bg-blue-500" />
          <UniverseBar universe="Gaming" percentage={25} color="bg-green-500" />
        </div>
      </div>
    </div>
  );
}

// Monetization Section
function MonetizationSection() {
  return (
    <div className="p-8">
      <MonetizationDashboard />
    </div>
  );
}

// Collaborations Section
function CollaborationsSection() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Collaborations</h1>
        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
          Inviter un créateur
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollabCard
          creatorName="Marie Laurent"
          projectTitle="Podcast Tech & Créativité"
          status="En cours"
          revenue="€450.00"
        />
        <CollabCard
          creatorName="Thomas Dubois"
          projectTitle="Live Gaming Tournament"
          status="Planifié"
          revenue="€0.00"
        />
      </div>
    </div>
  );
}

// Marketplace Section
function MarketplaceSection() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Marketplace</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard
          category="Montage vidéo"
          provider="Alex Martin"
          rating={4.9}
          price="€150-€300"
        />
        <ServiceCard
          category="Graphiste"
          provider="Sophie Chen"
          rating={4.8}
          price="€50-€100"
        />
        <ServiceCard
          category="Community Manager"
          provider="Lucas Bernard"
          rating={4.7}
          price="€200/mois"
        />
      </div>
    </div>
  );
}

// Live Section - Diffusion en direct
function LiveSection({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [stats, setStats] = useState({
    totalLives: 0,
    averageViewers: 0,
    totalDuration: 0
  });

  useEffect(() => {
    if (user) {
      loadLiveStreams();
    }
  }, [user]);

  const loadLiveStreams = async () => {
    if (!user) return;
    const streams = await liveStreamService.getCreatorLiveStreams(user.id);
    setLiveStreams(streams);

    const totalLives = streams.filter(s => s.status === 'ended').length;
    const averageViewers = streams.reduce((acc, s) => acc + s.average_viewers, 0) / Math.max(totalLives, 1);
    const totalDuration = streams.reduce((acc, s) => acc + s.duration_seconds, 0);

    setStats({
      totalLives,
      averageViewers: Math.round(averageViewers),
      totalDuration
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}min`;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Live</h1>
        <button
          onClick={() => onNavigate('live-streaming')}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
        >
          <Radio className="w-5 h-5" />
          Démarrer un live
        </button>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-red-500" />
            <span className="text-gray-400 text-sm">Lives totaux</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalLives}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-gray-400 text-sm">Spectateurs moyens</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.averageViewers}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-green-500" />
            <span className="text-gray-400 text-sm">Durée totale</span>
          </div>
          <div className="text-3xl font-bold text-white">{formatDuration(stats.totalDuration)}</div>
        </div>
      </div>

      {/* Live Configuration */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Configuration du live</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Titre du live</label>
            <input
              type="text"
              placeholder="Ex: Session Q&A avec mes abonnés"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Univers</label>
              <select className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option>Music</option>
                <option>Gaming</option>
                <option>Tech</option>
                <option>Lifestyle</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Qualité</label>
              <select className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option>1080p 60fps</option>
                <option>720p 60fps</option>
                <option>720p 30fps</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Past Lives */}
      <div className="bg-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Lives précédents</h2>
        </div>
        <div className="divide-y divide-gray-700">
          <LiveHistoryItem
            title="Session Q&A - Spécial 10K abonnés"
            viewers={1845}
            duration="2h 15min"
            date="Il y a 3 jours"
            revenue="€47.50"
          />
          <LiveHistoryItem
            title="Création musicale en direct"
            viewers={923}
            duration="1h 42min"
            date="Il y a 1 semaine"
            revenue="€23.80"
          />
          <LiveHistoryItem
            title="Tutoriel production avancée"
            viewers={1234}
            duration="3h 05min"
            date="Il y a 2 semaines"
            revenue="€61.20"
          />
        </div>
      </div>
    </div>
  );
}

// Community Section - Gestion communauté
function CommunitySection() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Communauté</h1>
        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
          Créer une communauté
        </button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-gray-400 text-sm">Membres</span>
          </div>
          <div className="text-3xl font-bold text-white">10,642</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span className="text-gray-400 text-sm">Posts ce mois</span>
          </div>
          <div className="text-3xl font-bold text-white">347</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-gray-400 text-sm">Engagement</span>
          </div>
          <div className="text-3xl font-bold text-white">8.7%</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-400 text-sm">Membres actifs</span>
          </div>
          <div className="text-3xl font-bold text-white">4,231</div>
        </div>
      </div>

      {/* My Communities */}
      <div className="bg-gray-800 rounded-lg mb-6">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Mes communautés</h2>
        </div>
        <div className="divide-y divide-gray-700">
          <CommunityItem
            name="Fans de Musique Électronique"
            members={10642}
            posts={347}
            isPremium={true}
          />
          <CommunityItem
            name="Production Studio VIP"
            members={532}
            posts={128}
            isPremium={true}
          />
          <CommunityItem
            name="Communauté Générale"
            members={25430}
            posts={892}
            isPremium={false}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Activité récente</h2>
        </div>
        <div className="divide-y divide-gray-700">
          <ActivityItem
            user="Marie L."
            action="a publié un nouveau sujet"
            title="Quelle DAW recommandez-vous ?"
            time="Il y a 5 minutes"
          />
          <ActivityItem
            user="Thomas D."
            action="a rejoint la communauté"
            title="Fans de Musique Électronique"
            time="Il y a 23 minutes"
          />
          <ActivityItem
            user="Sophie M."
            action="a commenté sur"
            title="Tips pour améliorer le mixage"
            time="Il y a 1 heure"
          />
        </div>
      </div>
    </div>
  );
}

// Comments Section - Modération
function CommentsSection() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Commentaires</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            Tous
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            En attente
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            Signalés
          </button>
        </div>
      </div>

      {/* Moderation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className="text-gray-400 text-sm">Total commentaires</span>
          </div>
          <div className="text-3xl font-bold text-white">8,432</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-400 text-sm">En attente</span>
          </div>
          <div className="text-3xl font-bold text-white">12</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-red-500" />
            <span className="text-gray-400 text-sm">Signalés</span>
          </div>
          <div className="text-3xl font-bold text-white">3</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-400 text-sm">Approuvés</span>
          </div>
          <div className="text-3xl font-bold text-white">8,417</div>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Commentaires récents</h2>
        </div>
        <div className="divide-y divide-gray-700">
          <CommentModerationItem
            user="Julie Martin"
            comment="Super vidéo ! J'ai appris plein de choses sur le mastering"
            video="Comment créer du contenu authentique"
            status="approved"
            time="Il y a 5 minutes"
          />
          <CommentModerationItem
            user="Marc Dubois"
            comment="Merci pour ce tutoriel détaillé, ça va m'aider énormément"
            video="Les secrets d'une bonne miniature"
            status="pending"
            time="Il y a 12 minutes"
          />
          <CommentModerationItem
            user="Sophie Chen"
            comment="Contenu de qualité comme toujours !"
            video="Comment créer du contenu authentique"
            status="approved"
            time="Il y a 23 minutes"
          />
          <CommentModerationItem
            user="Anonymous User"
            comment="Spam link here..."
            video="Les secrets d'une bonne miniature"
            status="reported"
            time="Il y a 1 heure"
          />
        </div>
      </div>
    </div>
  );
}

// Multi-Channel Section - Gestion multi-plateformes
function MultiChannelSection() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Multi-chaînes</h1>
        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
          Connecter une plateforme
        </button>
      </div>

      {/* Multi-Channel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5 text-purple-500" />
            <span className="text-gray-400 text-sm">Plateformes connectées</span>
          </div>
          <div className="text-3xl font-bold text-white">4</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-5 h-5 text-blue-500" />
            <span className="text-gray-400 text-sm">Vidéos synchronisées</span>
          </div>
          <div className="text-3xl font-bold text-white">127</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-gray-400 text-sm">Portée totale</span>
          </div>
          <div className="text-3xl font-bold text-white">2.4M</div>
        </div>
      </div>

      {/* Connected Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PlatformCard
          name="YouTube"
          connected={true}
          subscribers="847K"
          views="12.4M"
          syncEnabled={true}
        />
        <PlatformCard
          name="Twitch"
          connected={true}
          subscribers="234K"
          views="3.2M"
          syncEnabled={true}
        />
        <PlatformCard
          name="Instagram"
          connected={true}
          subscribers="542K"
          views="8.7M"
          syncEnabled={false}
        />
        <PlatformCard
          name="TikTok"
          connected={false}
          subscribers="-"
          views="-"
          syncEnabled={false}
        />
      </div>

      {/* Sync Schedule */}
      <div className="bg-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Planning de synchronisation</h2>
        </div>
        <div className="p-6 space-y-4">
          <SyncScheduleItem
            video="Comment créer du contenu authentique"
            platforms={['YouTube', 'Twitch']}
            date="Aujourd'hui à 18:00"
            status="scheduled"
          />
          <SyncScheduleItem
            video="Les secrets d'une bonne miniature"
            platforms={['YouTube', 'Instagram']}
            date="Demain à 14:00"
            status="scheduled"
          />
          <SyncScheduleItem
            video="Live Q&A avec mes abonnés"
            platforms={['YouTube', 'Twitch', 'Instagram']}
            date="Dans 3 jours à 20:00"
            status="pending"
          />
        </div>
      </div>
    </div>
  );
}

// Settings Section - Paramètres Studio
function SettingsSection() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Paramètres</h1>

      {/* Channel Settings */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Paramètres de la chaîne</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Nom de la chaîne</label>
            <input
              type="text"
              defaultValue="Alex Beats"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              defaultValue="Music producer and beat maker"
              rows={3}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Monetization Settings */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Paramètres de monétisation</h2>
        <div className="space-y-4">
          <SettingToggle
            label="Activer la monétisation sur tous mes contenus"
            enabled={true}
          />
          <SettingToggle
            label="Autoriser les pourboires"
            enabled={true}
          />
          <SettingToggle
            label="Afficher les produits affiliés"
            enabled={false}
          />
          <SettingToggle
            label="Activer les abonnements créateur"
            enabled={true}
          />
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Confidentialité</h2>
        <div className="space-y-4">
          <SettingToggle
            label="Afficher mon nombre d'abonnés"
            enabled={true}
          />
          <SettingToggle
            label="Autoriser les commentaires par défaut"
            enabled={true}
          />
          <SettingToggle
            label="Modération automatique des commentaires"
            enabled={true}
          />
          <SettingToggle
            label="Autoriser les messages privés"
            enabled={false}
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
        <div className="space-y-4">
          <SettingToggle
            label="Nouveaux commentaires"
            enabled={true}
          />
          <SettingToggle
            label="Nouveaux abonnés"
            enabled={true}
          />
          <SettingToggle
            label="Revenus reçus"
            enabled={true}
          />
          <SettingToggle
            label="Alertes de modération"
            enabled={true}
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ icon: Icon, label, value, change, positive }: any) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className={`text-sm font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </div>
    </div>
  );
}

function AlertItem({ type, message }: any) {
  const colors = {
    success: 'bg-green-900 border-green-600 text-green-300',
    info: 'bg-blue-900 border-blue-600 text-blue-300',
    warning: 'bg-yellow-900 border-yellow-600 text-yellow-300',
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[type as keyof typeof colors]}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
}

function UploadStep({ number, label }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <span className="text-gray-300 text-sm font-medium">{label}</span>
    </div>
  );
}

function VideoListItem({ title, views, status, date }: any) {
  return (
    <div className="p-4 hover:bg-gray-700 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&h=68&fit=crop"
          alt={title}
          className="w-32 h-18 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{views.toLocaleString()} vues</span>
            <span className="px-2 py-1 bg-gray-600 rounded text-xs">{status}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QualityMetric({ label, value, icon: Icon, positive, warning, neutral }: any) {
  const colorClass = positive ? 'text-green-400' : warning ? 'text-yellow-400' : 'text-gray-400';

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
    </div>
  );
}

function UniverseBar({ universe, percentage, color }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-300 text-sm">{universe}</span>
        <span className="text-gray-400 text-sm">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function CollabCard({ creatorName, projectTitle, status, revenue }: any) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full" />
        <div>
          <h3 className="text-white font-semibold">{creatorName}</h3>
          <p className="text-gray-400 text-sm">{projectTitle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm">
          {status}
        </span>
        <span className="text-green-400 font-semibold">{revenue}</span>
      </div>
    </div>
  );
}

function ServiceCard({ category, provider, rating, price }: any) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:border-red-600 border-2 border-transparent transition-colors cursor-pointer">
      <h3 className="text-white font-semibold text-lg mb-2">{category}</h3>
      <p className="text-gray-400 text-sm mb-3">Par {provider}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Award className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-semibold">{rating}</span>
        </div>
        <span className="text-gray-300 font-semibold">{price}</span>
      </div>
    </div>
  );
}

// Helper Components for New Sections

function LiveHistoryItem({ title, viewers, duration, date, revenue }: any) {
  return (
    <div className="p-4 hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold">{title}</h3>
        <span className="text-green-400 font-semibold">{revenue}</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {viewers.toLocaleString()} spectateurs
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {duration}
        </span>
        <span>{date}</span>
      </div>
    </div>
  );
}

function CommunityItem({ name, members, posts, isPremium }: any) {
  return (
    <div className="p-4 hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold">{name}</h3>
          {isPremium && (
            <span className="px-2 py-1 bg-yellow-900 text-yellow-300 rounded text-xs font-semibold">
              PREMIUM
            </span>
          )}
        </div>
        <button className="text-red-500 hover:text-red-400 text-sm font-semibold">
          Gérer
        </button>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {members.toLocaleString()} membres
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          {posts} posts
        </span>
      </div>
    </div>
  );
}

function ActivityItem({ user, action, title, time }: any) {
  return (
    <div className="p-4 hover:bg-gray-700 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <p className="text-gray-300 text-sm">
            <span className="text-white font-semibold">{user}</span> {action}{' '}
            <span className="text-white font-semibold">"{title}"</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}

function CommentModerationItem({ user, comment, video, status, time }: any) {
  const statusColors = {
    approved: 'bg-green-900 text-green-300',
    pending: 'bg-yellow-900 text-yellow-300',
    reported: 'bg-red-900 text-red-300',
  };

  return (
    <div className="p-4 hover:bg-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex-shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">{user}</p>
            <p className="text-gray-400 text-xs">{video}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[status as keyof typeof statusColors]}`}>
          {status === 'approved' && 'Approuvé'}
          {status === 'pending' && 'En attente'}
          {status === 'reported' && 'Signalé'}
        </span>
      </div>
      <p className="text-gray-300 text-sm mb-2 ml-10">{comment}</p>
      <div className="flex items-center gap-2 ml-10">
        <button className="text-green-400 hover:text-green-300 text-xs font-semibold">
          Approuver
        </button>
        <button className="text-red-400 hover:text-red-300 text-xs font-semibold">
          Supprimer
        </button>
        <span className="text-gray-500 text-xs ml-auto">{time}</span>
      </div>
    </div>
  );
}

function PlatformCard({ name, connected, subscribers, views, syncEnabled }: any) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-700 hover:border-red-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold">{name}</h3>
            <p className={`text-xs ${connected ? 'text-green-400' : 'text-gray-500'}`}>
              {connected ? 'Connecté' : 'Non connecté'}
            </p>
          </div>
        </div>
        {connected && (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${syncEnabled ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
              {syncEnabled ? 'Sync ON' : 'Sync OFF'}
            </span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-xs">Abonnés</p>
          <p className="text-white font-bold">{subscribers}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Vues</p>
          <p className="text-white font-bold">{views}</p>
        </div>
      </div>
      {!connected && (
        <button className="w-full mt-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
          Connecter
        </button>
      )}
    </div>
  );
}

function SyncScheduleItem({ video, platforms, date, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
      <div className="flex-1">
        <h4 className="text-white font-semibold mb-1">{video}</h4>
        <div className="flex items-center gap-2">
          {platforms.map((platform: string) => (
            <span key={platform} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
              {platform}
            </span>
          ))}
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-300 text-sm mb-1">{date}</p>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${status === 'scheduled' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'}`}>
          {status === 'scheduled' ? 'Programmé' : 'En attente'}
        </span>
      </div>
    </div>
  );
}

function SettingToggle({ label, enabled }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
      <span className="text-gray-300">{label}</span>
      <button
        className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-green-600' : 'bg-gray-600'}`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}
        />
      </button>
    </div>
  );
}
