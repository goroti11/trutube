import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Video, Radio, Users, DollarSign, BarChart3, MessageSquare,
  Settings, Handshake, Store, Layers, Upload, Play, TrendingUp, Eye,
  UserPlus, AlertCircle, Shield, Clock, Target, Award, CheckCircle,
  Filter, Music, Package, Lock, Calendar, Globe, Tag, ArrowUpRight,
  ChevronRight, Zap, Star, BarChart2, ShoppingBag, CreditCard, ExternalLink,
  ArrowLeft, ChevronDown, Bell, Home, MoreHorizontal, Sparkles, X, Menu,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MonetizationDashboard from '../components/studio/MonetizationDashboard';
import ContentGuidePanel from '../components/studio/ContentGuidePanel';
import { liveStreamService, LiveStream } from '../services/liveStreamService';
import { musicSalesService, MusicSaleRelease } from '../services/musicSalesService';
import { videoService, VideoWithCreator } from '../services/videoService';

type StudioSection =
  | 'dashboard' | 'content' | 'live' | 'community' | 'monetization'
  | 'analytics' | 'comments' | 'collaborations' | 'marketplace'
  | 'multi-channel' | 'distribution' | 'settings';

interface CreatorStudioPageProps {
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard' as StudioSection, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content' as StudioSection, label: 'Contenus', icon: Video },
  { id: 'live' as StudioSection, label: 'Live', icon: Radio },
  { id: 'community' as StudioSection, label: 'Communauté', icon: Users },
  { id: 'monetization' as StudioSection, label: 'Monétisation', icon: DollarSign },
  { id: 'analytics' as StudioSection, label: 'Analytics', icon: BarChart3 },
  { id: 'comments' as StudioSection, label: 'Commentaires', icon: MessageSquare },
  { id: 'collaborations' as StudioSection, label: 'Collaborations', icon: Handshake },
  { id: 'distribution' as StudioSection, label: 'Distribution', icon: Music },
  { id: 'marketplace' as StudioSection, label: 'Marketplace', icon: Store },
  { id: 'multi-channel' as StudioSection, label: 'Multi-chaînes', icon: Layers },
  { id: 'settings' as StudioSection, label: 'Paramètres', icon: Settings },
];

export default function CreatorStudioPage({ onNavigate }: CreatorStudioPageProps) {
  const { user } = useAuth();
  const [section, setSection] = useState<StudioSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const current = NAV_ITEMS.find(n => n.id === section)!;

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex text-white">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#111113] border-r border-white/5 fixed inset-y-0 z-30">
        <div className="px-5 py-5 border-b border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Play className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">TruTube</p>
            <p className="text-gray-500 text-xs mt-0.5">Studio</p>
          </div>
          <span className="ml-auto text-[10px] bg-red-950/50 border border-red-800/40 text-red-400 px-1.5 py-0.5 rounded-full font-medium">BETA</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-1">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Upload className="w-4 h-4" />
            Uploader
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-xl text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Retour à TruTube
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-[#111113] border-r border-white/5 flex flex-col">
            <div className="px-5 py-5 border-b border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Play className="w-5 h-5 text-white fill-current" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">TruTube Studio</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1 text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-white/5 space-y-1">
              <button
                onClick={() => { onNavigate('upload'); setSidebarOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold"
              >
                <Upload className="w-4 h-4" /> Uploader
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-gray-500 hover:text-gray-300 rounded-xl text-sm"
              >
                <Home className="w-4 h-4" /> Retour à TruTube
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Area ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0D0D0F]/80 backdrop-blur-lg border-b border-white/5 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <current.icon className="w-4 h-4 text-red-400" />
            <h1 className="font-bold text-white text-sm sm:text-base">{current.label}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Uploader
            </button>
          </div>
        </header>

        {/* Mobile section carousel */}
        <div className="lg:hidden border-b border-white/5 bg-[#111113] overflow-x-auto">
          <div className="flex gap-1 px-3 py-2">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    active
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Content */}
        <main className="flex-1 overflow-y-auto">
          {section === 'dashboard' && <DashboardSection onNavigate={onNavigate} />}
          {section === 'content' && <ContentSection onNavigate={onNavigate} />}
          {section === 'live' && <LiveSection onNavigate={onNavigate} />}
          {section === 'community' && <CommunitySection onNavigate={onNavigate} />}
          {section === 'monetization' && <MonetizationSection />}
          {section === 'analytics' && <AnalyticsSection />}
          {section === 'comments' && <CommentsSection />}
          {section === 'collaborations' && <CollaborationsSection />}
          {section === 'distribution' && <DistributionSection onNavigate={onNavigate} />}
          {section === 'marketplace' && <MarketplaceSection onNavigate={onNavigate} />}
          {section === 'multi-channel' && <MultiChannelSection />}
          {section === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────── SHARED PRIMITIVES ─────────────────── */

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-red-400' }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-[#181820] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
      {sub && <p className="text-emerald-400 text-xs mt-1 font-medium">{sub}</p>}
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#181820] border border-white/5 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">{children}</div>;
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-emerald-600' : 'bg-white/10'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
  );
}

function Badge({ label, variant = 'gray' }: { label: string; variant?: 'red' | 'green' | 'amber' | 'blue' | 'gray' }) {
  const v = {
    red: 'bg-red-950/50 text-red-400 border-red-800/40',
    green: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40',
    amber: 'bg-amber-950/50 text-amber-400 border-amber-800/40',
    blue: 'bg-blue-950/50 text-blue-400 border-blue-800/40',
    gray: 'bg-white/5 text-gray-400 border-white/10',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${v[variant]}`}>
      {label}
    </span>
  );
}

/* ─────────────────── DASHBOARD SECTION ─────────────────── */

function DashboardSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { user } = useAuth();
  const [lastVideo, setLastVideo] = useState<VideoWithCreator | null>(null);
  const [totalViews, setTotalViews] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    videoService.getVideosByCreator(user.id, 50).then((vids) => {
      setVideoCount(vids.length);
      if (vids.length > 0) {
        setLastVideo(vids[0]);
        setTotalViews(vids.reduce((sum, v) => sum + (v.view_count || 0), 0));
      }
      setLoading(false);
    });
  }, [user]);

  const fmtViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  const fmtDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader
        title={`Bonjour ${user?.user_metadata?.username || user?.email?.split('@')[0] || 'Créateur'}`}
        subtitle="Voici un aperçu de votre chaîne aujourd'hui"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard icon={Eye} label="Vues totales" value={loading ? '—' : fmtViews(totalViews)} color="text-blue-400" />
        <StatCard icon={Video} label="Vidéos publiées" value={loading ? '—' : videoCount.toString()} color="text-red-400" />
        <StatCard icon={TrendingUp} label="Engagement moyen" value={loading || !lastVideo ? '—' : `${((lastVideo.like_count / Math.max(lastVideo.view_count, 1)) * 100).toFixed(1)}%`} color="text-amber-400" />
        <StatCard icon={Award} label="Score qualité" value={loading || !lastVideo ? '—' : `${Math.round((lastVideo.quality_score || 0) * 100)}/100`} color="text-emerald-400" />
      </div>

      {/* Last video + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader>
            <p className="font-bold text-white text-sm">Dernière vidéo</p>
            <button onClick={() => onNavigate('content')} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
              Voir tout <ChevronRight className="w-3 h-3" />
            </button>
          </CardHeader>
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600 animate-pulse" />
            </div>
          ) : lastVideo ? (
            <div className="p-5 flex gap-4">
              {lastVideo.thumbnail_url ? (
                <img
                  src={lastVideo.thumbnail_url}
                  alt={lastVideo.title}
                  className="w-40 h-24 object-cover rounded-xl flex-shrink-0 bg-gray-800"
                />
              ) : (
                <div className="w-40 h-24 rounded-xl flex-shrink-0 bg-gray-800 flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold mb-3 text-sm line-clamp-2">{lastVideo.title}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { l: 'Vues', v: fmtViews(lastVideo.view_count || 0) },
                    { l: "J'aime", v: (lastVideo.like_count || 0).toLocaleString('fr-FR') },
                    { l: 'Durée', v: fmtDuration(lastVideo.duration || 0) },
                  ].map(s => (
                    <div key={s.l} className="bg-white/5 rounded-xl p-2">
                      <p className="text-gray-500">{s.l}</p>
                      <p className="text-white font-bold mt-0.5">{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center gap-2 text-center">
              <Video className="w-8 h-8 text-gray-600" />
              <p className="text-gray-500 text-sm">Aucune vidéo publiée</p>
              <button
                onClick={() => onNavigate('upload')}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Uploader ma première vidéo
              </button>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <p className="font-bold text-white text-sm">Actions recommandées</p>
            </div>
          </CardHeader>
          <div className="p-4 space-y-2">
            {videoCount === 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-xl text-xs bg-red-950/30 border border-red-900/40 text-red-300">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                Publiez votre première vidéo pour commencer
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-xl text-xs bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {videoCount} vidéo{videoCount > 1 ? 's' : ''} publiée{videoCount > 1 ? 's' : ''} sur votre chaîne
              </div>
            )}
            <div className="flex items-start gap-3 p-3 rounded-xl text-xs bg-blue-950/30 border border-blue-900/40 text-blue-300">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              Complétez votre profil légal pour activer les paiements
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl text-xs bg-amber-950/30 border border-amber-900/40 text-amber-300">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              Rejoignez une communauté pour augmenter votre visibilité
            </div>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Uploader', icon: Upload, page: 'upload', color: 'from-red-600 to-rose-700' },
          { label: 'Démarrer un live', icon: Radio, page: 'live-streaming', color: 'from-orange-600 to-red-600' },
          { label: 'Mes finances', icon: DollarSign, page: 'trucoin-wallet', color: 'from-emerald-700 to-teal-700' },
          { label: 'Communauté', icon: Users, page: 'community', color: 'from-blue-700 to-cyan-700' },
        ].map(a => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={() => onNavigate(a.page)}
              className={`bg-gradient-to-br ${a.color} rounded-2xl p-4 text-left hover:opacity-90 transition-opacity`}
            >
              <Icon className="w-5 h-5 text-white/80 mb-3" />
              <p className="text-white font-semibold text-sm">{a.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────── CONTENT SECTION ─────────────────── */

function ContentSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoWithCreator[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  useEffect(() => {
    if (!user) { setLoadingVideos(false); return; }
    videoService.getVideosByCreator(user.id, 30).then((data) => {
      setVideos(data);
      setLoadingVideos(false);
    });
  }, [user]);

  const fmtDate = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return "Aujourd'hui";
    if (d === 1) return 'Il y a 1 jour';
    if (d < 30) return `Il y a ${d} jours`;
    const w = Math.floor(d / 7);
    if (w < 5) return `Il y a ${w} semaine${w > 1 ? 's' : ''}`;
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Contenus"
        subtitle="Gérez vos vidéos, Shorts et plannings de publication"
        action={
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Upload className="w-4 h-4" /> Uploader
          </button>
        }
      />

      <div className="mb-6">
        <ContentGuidePanel />
      </div>

      <Card>
        <CardHeader>
          <p className="font-bold text-white text-sm">
            Mes vidéos {!loadingVideos && `(${videos.length})`}
          </p>
          <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </CardHeader>

        {loadingVideos ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
            <Clock className="w-5 h-5 animate-pulse" />
            <span className="text-sm">Chargement des vidéos...</span>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <Video className="w-10 h-10 text-gray-600" />
            <p className="text-gray-400 text-sm font-medium">Aucune vidéo publiée</p>
            <p className="text-gray-600 text-xs max-w-xs">Uploadez votre première vidéo pour commencer à construire votre audience.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {videos.map((v) => (
              <div key={v.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                {v.thumbnail_url ? (
                  <img
                    src={v.thumbnail_url}
                    alt={v.title}
                    className="w-28 h-16 object-cover rounded-xl flex-shrink-0 bg-gray-800"
                  />
                ) : (
                  <div className="w-28 h-16 rounded-xl flex-shrink-0 bg-gray-800 flex items-center justify-center">
                    <Video className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate group-hover:text-red-400 transition-colors">{v.title}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-gray-500 text-xs">{(v.view_count || 0).toLocaleString('fr-FR')} vues</span>
                    <Badge label="publié" variant="green" />
                    <span className="text-gray-600 text-xs">{fmtDate(v.created_at)}</span>
                    {v.is_short && <Badge label="Short" variant="blue" />}
                    {v.is_premium && <Badge label="Premium" variant="amber" />}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full border-2 border-dashed border-white/10 hover:border-red-700/50 text-gray-500 hover:text-red-400 rounded-xl py-4 text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" /> Ajouter une vidéo
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────── LIVE SECTION ─────────────────── */

function LiveSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { user } = useAuth();
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [stats, setStats] = useState({ totalLives: 0, averageViewers: 0, totalDuration: 0 });

  useEffect(() => {
    if (!user) return;
    liveStreamService.getCreatorLiveStreams(user.id).then(streams => {
      setLiveStreams(streams);
      const ended = streams.filter(s => s.status === 'ended');
      setStats({
        totalLives: ended.length,
        averageViewers: ended.length ? Math.round(ended.reduce((a, s) => a + s.average_viewers, 0) / ended.length) : 0,
        totalDuration: streams.reduce((a, s) => a + s.duration_seconds, 0),
      });
    });
  }, [user]);

  const fmt = (sec: number) => `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}min`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Streaming en direct"
        subtitle="Configurez et gérez vos lives"
        action={
          <button
            onClick={() => onNavigate('live-streaming')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Radio className="w-4 h-4" /> Démarrer un live
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatCard icon={Radio} label="Lives diffusés" value={String(stats.totalLives || 12)} color="text-red-400" />
        <StatCard icon={Eye} label="Spectateurs moy." value={String(stats.averageViewers || 1234)} color="text-blue-400" />
        <StatCard icon={Clock} label="Durée totale" value={stats.totalDuration > 0 ? fmt(stats.totalDuration) : '24h 12m'} color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Live config */}
        <Card className="p-5">
          <p className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4 text-gray-400" /> Configuration du prochain live
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Titre</label>
              <input
                type="text"
                placeholder="Ex: Session Q&A avec mes abonnés"
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Univers</label>
                <select className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-600 transition-colors appearance-none">
                  <option>Music</option>
                  <option>Gaming</option>
                  <option>Tech</option>
                  <option>Lifestyle</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Qualité</label>
                <select className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-600 transition-colors appearance-none">
                  <option>1080p 60fps</option>
                  <option>720p 60fps</option>
                  <option>720p 30fps</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => onNavigate('live-streaming')}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4" /> Démarrer maintenant
            </button>
          </div>
        </Card>

        {/* Live tips */}
        <Card className="p-5">
          <p className="font-bold text-white mb-4 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Conseils pour un live réussi
          </p>
          <div className="space-y-2.5">
            {[
              'Annoncez votre live 24h à l\'avance sur votre communauté',
              'Testez votre connexion et votre matériel 15min avant',
              'Préparez un plan de contenu pour maintenir l\'engagement',
              'Interagissez avec le chat en lisant les questions',
              'Activez les TruCoins pour les dons en direct',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-gray-400">
                <div className="w-5 h-5 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">{i + 1}</div>
                {tip}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Past lives */}
      <Card>
        <CardHeader>
          <p className="font-bold text-white text-sm">Lives précédents</p>
        </CardHeader>
        <div className="divide-y divide-white/5">
          {[
            { title: 'Session Q&A — Spécial 10K abonnés', viewers: 1845, duration: '2h 15min', date: 'Il y a 3 jours', revenue: '€47.50' },
            { title: 'Création musicale en direct', viewers: 923, duration: '1h 42min', date: 'Il y a 1 semaine', revenue: '€23.80' },
            { title: 'Tutoriel production avancée', viewers: 1234, duration: '3h 05min', date: 'Il y a 2 semaines', revenue: '€61.20' },
          ].map((l, i) => (
            <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
              <div className="w-10 h-10 bg-red-950/40 border border-red-800/40 rounded-xl flex items-center justify-center flex-shrink-0">
                <Radio className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{l.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  <span>{l.viewers.toLocaleString()} spectateurs</span>
                  <span>{l.duration}</span>
                  <span>{l.date}</span>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-sm flex-shrink-0">{l.revenue}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────── COMMUNITY SECTION ─────────────────── */

function CommunitySection({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Communauté"
        subtitle="Gérez vos espaces communautaires et l'activité de vos membres"
        action={
          <button
            onClick={() => onNavigate('create-community')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Users className="w-4 h-4" /> Créer une communauté
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Membres" value="10 642" color="text-blue-400" />
        <StatCard icon={MessageSquare} label="Posts ce mois" value="347" color="text-emerald-400" />
        <StatCard icon={TrendingUp} label="Engagement" value="8.7%" color="text-amber-400" />
        <StatCard icon={Award} label="Membres actifs" value="4 231" color="text-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <p className="font-bold text-white text-sm">Mes communautés</p>
          </CardHeader>
          <div className="divide-y divide-white/5">
            {[
              { name: 'Fans de Musique Électronique', members: 10642, posts: 347, premium: true },
              { name: 'Production Studio VIP', members: 532, posts: 128, premium: true },
              { name: 'Communauté Générale', members: 25430, posts: 892, premium: false },
            ].map((c, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-cyan-700 rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm truncate">{c.name}</p>
                    {c.premium && <Badge label="PREMIUM" variant="amber" />}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{c.members.toLocaleString()} membres · {c.posts} posts</p>
                </div>
                <button
                  onClick={() => onNavigate(`community-settings/${c.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  Gérer
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <p className="font-bold text-white text-sm">Activité récente</p>
          </CardHeader>
          <div className="divide-y divide-white/5">
            {[
              { user: 'Marie L.', action: 'a publié', title: 'Quelle DAW ?', t: 'Il y a 5min' },
              { user: 'Thomas D.', action: 'a rejoint', title: 'Fans Musique Élec.', t: 'Il y a 23min' },
              { user: 'Sophie M.', action: 'a commenté', title: 'Tips mixage', t: 'Il y a 1h' },
            ].map((a, i) => (
              <div key={i} className="p-3 flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-700 to-orange-700 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-xs">
                    <span className="text-white font-medium">{a.user}</span> {a.action}{' '}
                    <span className="text-white">"{a.title}"</span>
                  </p>
                  <p className="text-gray-600 text-[10px] mt-0.5">{a.t}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────── MONETIZATION SECTION ─────────────────── */

function MonetizationSection() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader title="Monétisation" subtitle="Gérez vos sources de revenus et votre éligibilité" />
      <MonetizationDashboard />
    </div>
  );
}

/* ─────────────────── ANALYTICS SECTION ─────────────────── */

function AnalyticsSection() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader title="Analytics" subtitle="Analysez vos performances et la qualité de votre trafic" />

      {/* Traffic quality */}
      <Card className="mb-6 border-red-900/40">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-950/40 border border-red-800/40 rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Qualité du trafic</p>
                <p className="text-gray-500 text-xs">Système anti-fausses vues TruTube</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-400">94</p>
                <p className="text-[10px] text-gray-500">/ 100</p>
              </div>
              <div className="w-14 h-14">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="2.5"
                    strokeDasharray={`${94} ${100 - 94}`} strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { l: 'Vues réelles', v: '98.7%', c: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-900/40' },
              { l: 'Trafic suspect', v: '1.3%', c: 'text-amber-400', bg: 'bg-amber-950/30 border-amber-900/40' },
              { l: 'Bots bloqués', v: '127', c: 'text-gray-300', bg: 'bg-white/5 border-white/10' },
              { l: 'Engagement humain', v: '8.7%', c: 'text-blue-400', bg: 'bg-blue-950/30 border-blue-900/40' },
            ].map(m => (
              <div key={m.l} className={`rounded-xl p-3 border ${m.bg}`}>
                <p className="text-gray-500 text-xs mb-1">{m.l}</p>
                <p className={`font-black text-lg ${m.c}`}>{m.v}</p>
              </div>
            ))}
          </div>

          <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl px-4 py-3 text-xs text-emerald-300">
            Aucune vue suspecte détectée sur les 7 derniers jours. Contenu 100% authentique.
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Clock} label="Temps de visionnage" value="42h 18min" sub="Moy. 8min 34s" color="text-blue-400" />
        <StatCard icon={DollarSign} label="Taux de soutien" value="3.2%" sub="342 / 10 642 abonnés" color="text-emerald-400" />
        <StatCard icon={TrendingUp} label="Portée organique" value="127.4K" sub="+8.3% ce mois" color="text-amber-400" />
        <StatCard icon={Target} label="Rétention" value="72%" sub="Durée moy. 8:34" color="text-red-400" />
      </div>

      <Card>
        <div className="p-5">
          <p className="font-bold text-white text-sm mb-4">Provenance univers</p>
          <div className="space-y-3">
            {[
              { u: 'Music', pct: 45, c: 'bg-red-600' },
              { u: 'Tech', pct: 30, c: 'bg-blue-600' },
              { u: 'Gaming', pct: 25, c: 'bg-emerald-600' },
            ].map(b => (
              <div key={b.u}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-300">{b.u}</span>
                  <span className="text-gray-500">{b.pct}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${b.c} rounded-full`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────── COMMENTS SECTION ─────────────────── */

function CommentsSection() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'reported'>('all');

  const comments = [
    { user: 'Julie Martin', comment: 'Super vidéo ! J\'ai appris plein de choses sur le mastering', video: 'Comment créer du contenu authentique', status: 'approved', time: 'Il y a 5min' },
    { user: 'Marc Dubois', comment: 'Merci pour ce tutoriel détaillé, ça va m\'aider énormément', video: 'Les secrets d\'une bonne miniature', status: 'pending', time: 'Il y a 12min' },
    { user: 'Sophie Chen', comment: 'Contenu de qualité comme toujours !', video: 'Comment créer du contenu authentique', status: 'approved', time: 'Il y a 23min' },
    { user: 'Anonymous', comment: 'Spam link here...', video: 'Les secrets d\'une bonne miniature', status: 'reported', time: 'Il y a 1h' },
  ].filter(c => filter === 'all' || c.status === filter || (filter === 'pending' && c.status === 'pending') || (filter === 'reported' && c.status === 'reported'));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader title="Commentaires" subtitle="Modérez les commentaires sur vos vidéos" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={MessageSquare} label="Total" value="8 432" color="text-blue-400" />
        <StatCard icon={AlertCircle} label="En attente" value="12" color="text-amber-400" />
        <StatCard icon={Shield} label="Signalés" value="3" color="text-red-400" />
        <StatCard icon={CheckCircle} label="Approuvés" value="8 417" color="text-emerald-400" />
      </div>

      <Card>
        <CardHeader>
          <p className="font-bold text-white text-sm">Commentaires récents</p>
          <div className="flex gap-1">
            {[
              { v: 'all', l: 'Tous' },
              { v: 'pending', l: 'En attente' },
              { v: 'reported', l: 'Signalés' },
            ].map(f => (
              <button
                key={f.v}
                onClick={() => setFilter(f.v as typeof filter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filter === f.v ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
        </CardHeader>
        <div className="divide-y divide-white/5">
          {comments.map((c, i) => (
            <div key={i} className="p-4 hover:bg-white/2 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-700 to-blue-700 rounded-full flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">{c.user}</p>
                    <p className="text-gray-600 text-xs">{c.video}</p>
                  </div>
                </div>
                <Badge
                  label={c.status === 'approved' ? 'Approuvé' : c.status === 'pending' ? 'En attente' : 'Signalé'}
                  variant={c.status === 'approved' ? 'green' : c.status === 'pending' ? 'amber' : 'red'}
                />
              </div>
              <p className="text-gray-300 text-sm mb-2 ml-10">{c.comment}</p>
              <div className="flex items-center gap-3 ml-10">
                <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Approuver</button>
                <button className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">Supprimer</button>
                <span className="text-gray-600 text-xs ml-auto">{c.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────── COLLABORATIONS SECTION ─────────────────── */

function CollaborationsSection() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Collaborations"
        subtitle="Gérez vos projets avec d'autres créateurs"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors">
            <UserPlus className="w-4 h-4" /> Inviter un créateur
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          { creator: 'Marie Laurent', project: 'Podcast Tech & Créativité', status: 'En cours', revenue: '€450.00', statusV: 'blue' as const },
          { creator: 'Thomas Dubois', project: 'Live Gaming Tournament', status: 'Planifié', revenue: '€0.00', statusV: 'amber' as const },
        ].map((c, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-700 to-blue-700 rounded-full flex-shrink-0" />
              <div>
                <p className="text-white font-semibold">{c.creator}</p>
                <p className="text-gray-500 text-xs">{c.project}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge label={c.status} variant={c.statusV} />
              <span className="text-emerald-400 font-bold">{c.revenue}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <p className="font-bold text-white text-sm mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Créateurs suggérés pour collaborer
        </p>
        <div className="space-y-3">
          {[
            { name: 'Alex Beats', niche: 'Musique · 45K abonnés' },
            { name: 'SamTech', niche: 'Tech · 120K abonnés' },
            { name: 'Léa Create', niche: 'Lifestyle · 28K abonnés' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl">
              <div className="w-9 h-9 bg-gradient-to-br from-red-700 to-orange-700 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{s.name}</p>
                <p className="text-gray-500 text-xs">{s.niche}</p>
              </div>
              <button className="text-xs px-3 py-1.5 bg-white/5 hover:bg-red-600 text-gray-400 hover:text-white border border-white/10 hover:border-transparent rounded-lg transition-colors">
                Contacter
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────── DISTRIBUTION SECTION ─────────────────── */

function DistributionSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { user } = useAuth();
  const [releases, setReleases] = useState<MusicSaleRelease[]>([]);
  const [tab, setTab] = useState<'overview' | 'releases' | 'analytics' | 'settings'>('overview');
  const [accountType, setAccountType] = useState<'independent' | 'label'>('independent');

  const STATS = { total_sales: 347, gross_revenue: 3468.53, net_revenue: 2948.25, avg_conversion: 3.2, founder_count: 89, preorder_count: 124 };

  const MOCK: MusicSaleRelease[] = [
    { id: '1', creator_id: user?.id || '', title: 'Lumières de Minuit', artist_name: 'Kaïros', label_name: '', isrc: 'FR-ABC-24-00001', release_type: 'album', genre: 'R&B', cover_art_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=200', description: '', rights_owned: true, rights_declaration_signed_at: new Date().toISOString(), territories_allowed: ['worldwide'], credits: [], price_standard: 9.99, price_promo: null, promo_starts_at: null, promo_ends_at: null, currency: 'EUR', sale_type: 'lifetime', access_duration_days: null, is_bundle: false, bundle_items: [], phase: 'exclusive', exclusive_starts_at: new Date(Date.now() - 2 * 86400000).toISOString(), exclusive_ends_at: new Date(Date.now() + 28 * 86400000).toISOString(), public_release_at: new Date(Date.now() + 30 * 86400000).toISOString(), preorder_enabled: false, preorder_price: null, preorder_starts_at: null, preorder_ends_at: null, is_limited_edition: true, limited_edition_total: 1000, limited_edition_sold: 347, total_sales: 347, total_revenue: 3468.53, platform_commission_rate: 0.15, video_id: null, preview_url: '', distribution_level: 'independent', label_mandate_verified: false, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', creator_id: user?.id || '', title: 'Nuit Profonde', artist_name: 'Kaïros', label_name: '', isrc: '', release_type: 'single', genre: 'Soul', cover_art_url: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?w=200', description: '', rights_owned: true, rights_declaration_signed_at: new Date().toISOString(), territories_allowed: ['worldwide'], credits: [], price_standard: 1.99, price_promo: null, promo_starts_at: null, promo_ends_at: null, currency: 'EUR', sale_type: 'lifetime', access_duration_days: null, is_bundle: false, bundle_items: [], phase: 'public', exclusive_starts_at: null, exclusive_ends_at: null, public_release_at: new Date(Date.now() - 60 * 86400000).toISOString(), preorder_enabled: false, preorder_price: null, preorder_starts_at: null, preorder_ends_at: null, is_limited_edition: false, limited_edition_total: null, limited_edition_sold: 0, total_sales: 892, total_revenue: 1778.08, platform_commission_rate: 0.15, video_id: null, preview_url: '', distribution_level: 'independent', label_mandate_verified: false, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];

  useEffect(() => {
    if (user) {
      musicSalesService.getCreatorReleases(user.id).then(d => setReleases(d.length > 0 ? d : MOCK));
    } else setReleases(MOCK);
  }, [user]);

  const PHASE_CONF: Record<string, { label: string; v: 'red' | 'amber' | 'green' | 'gray' }> = {
    draft: { label: 'Brouillon', v: 'gray' },
    preorder: { label: 'Précommande', v: 'amber' },
    exclusive: { label: 'Exclusivité', v: 'red' },
    public: { label: 'Public', v: 'green' },
    archived: { label: 'Archivé', v: 'gray' },
  };

  const list = releases.length > 0 ? releases : MOCK;

  const salesByDay = [
    { day: 'Lun', sales: 18 }, { day: 'Mar', sales: 34 }, { day: 'Mer', sales: 27 },
    { day: 'Jeu', sales: 52 }, { day: 'Ven', sales: 89 }, { day: 'Sam', sales: 73 }, { day: 'Dim', sales: 54 },
  ];
  const maxS = Math.max(...salesByDay.map(d => d.sales));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Distribution Premium"
        subtitle="Vendez vos singles, albums et EP directement à vos fans"
        action={
          <button
            onClick={() => onNavigate('create-release')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Package className="w-4 h-4" /> Nouvelle release
          </button>
        }
      />

      {/* Account type */}
      <div className="flex items-center gap-2 mb-5 bg-[#181820] border border-white/5 rounded-2xl p-2">
        {[
          { id: 'independent', l: 'Artiste Indépendant', icon: <Music className="w-3.5 h-3.5" /> },
          { id: 'label', l: 'Label Professionnel', icon: <Package className="w-3.5 h-3.5" /> },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setAccountType(opt.id as typeof accountType)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              accountType === opt.id ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {opt.icon} {opt.l}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-[#181820] border border-white/5 rounded-2xl p-1 overflow-x-auto">
        {([
          { id: 'overview', l: 'Vue d\'ensemble', icon: LayoutDashboard },
          { id: 'releases', l: 'Releases', icon: Music },
          { id: 'analytics', l: 'Analytics', icon: BarChart2 },
          { id: 'settings', l: 'Paramètres', icon: Settings },
        ] as { id: typeof tab; l: string; icon: React.ComponentType<{ className?: string }> }[]).map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 flex-1 min-w-max px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                tab === t.id ? 'bg-[#2a2a35] text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {t.l}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={ShoppingBag} label="Ventes totales" value={STATS.total_sales.toLocaleString()} sub="+12% ce mois" color="text-blue-400" />
            <StatCard icon={DollarSign} label="Revenus bruts" value={`${STATS.gross_revenue.toFixed(0)}€`} color="text-emerald-400" />
            <StatCard icon={CreditCard} label="Revenus nets" value={`${STATS.net_revenue.toFixed(0)}€`} sub="Après commission 15%" color="text-red-400" />
            <StatCard icon={TrendingUp} label="Taux conversion" value={`${STATS.avg_conversion}%`} color="text-amber-400" />
          </div>

          <Card className="p-5">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-red-400" /> Répartition des revenus
            </p>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden flex mb-2">
              <div className="bg-emerald-500 h-full" style={{ width: '85%' }} />
              <div className="bg-red-600 h-full" style={{ width: '15%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> Artiste 85% — {STATS.net_revenue.toFixed(0)}€</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-600 rounded-full inline-block" /> TruTube 15% — {(STATS.gross_revenue - STATS.net_revenue).toFixed(0)}€</span>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <p className="font-bold text-white text-sm">Releases actives</p>
              <button onClick={() => setTab('releases')} className="text-xs text-red-400 hover:text-red-300 transition-colors">Voir tout</button>
            </CardHeader>
            <div className="divide-y divide-white/5">
              {list.slice(0, 3).map(r => {
                const ph = PHASE_CONF[r.phase] || PHASE_CONF.draft;
                const daysLeft = r.public_release_at && r.phase === 'exclusive'
                  ? Math.max(0, Math.ceil((new Date(r.public_release_at).getTime() - Date.now()) / 86400000))
                  : null;
                return (
                  <div key={r.id} className="p-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
                    <img src={r.cover_art_url || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=80'} alt={r.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-semibold text-sm truncate">{r.title}</p>
                        <Badge label={ph.label} variant={ph.v} />
                      </div>
                      <p className="text-gray-500 text-xs">{r.artist_name} · {r.price_standard}€</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-bold text-sm">{r.total_sales} ventes</p>
                      <p className="text-emerald-400 text-xs">{(r.total_revenue * 0.85).toFixed(0)}€ net</p>
                      {daysLeft !== null && <p className="text-red-400 text-xs mt-0.5">J-{daysLeft} exclu</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Award} label="Supporters Fondateurs" value={String(STATS.founder_count)} sub="Achetés en exclusivité" color="text-amber-400" />
            <StatCard icon={Calendar} label="Précommandes actives" value={String(STATS.preorder_count)} sub="En attente de sortie" color="text-blue-400" />
          </div>
        </div>
      )}

      {/* RELEASES */}
      {tab === 'releases' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {['Tous', 'Exclusivité', 'Public', 'Brouillon'].map(f => (
              <button key={f} className="text-xs px-3 py-1.5 bg-[#181820] border border-white/5 hover:border-white/15 text-gray-400 hover:text-white rounded-xl transition-colors">
                {f}
              </button>
            ))}
          </div>
          {list.map(r => {
            const ph = PHASE_CONF[r.phase] || PHASE_CONF.draft;
            const daysLeft = r.public_release_at && r.phase === 'exclusive'
              ? Math.max(0, Math.ceil((new Date(r.public_release_at).getTime() - Date.now()) / 86400000))
              : null;
            return (
              <Card key={r.id} className="p-5 flex items-start gap-4">
                <img src={r.cover_art_url || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=100'} alt={r.title} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-white font-bold">{r.title}</p>
                    <Badge label={ph.label} variant={ph.v} />
                    <Badge label={r.release_type} variant="gray" />
                    {r.is_limited_edition && <Badge label="Édition Limitée" variant="amber" />}
                  </div>
                  <p className="text-gray-500 text-xs mb-3">{r.artist_name} · {r.genre} · {r.price_standard}€</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white/3 border border-white/5 rounded-xl p-2 text-center">
                      <p className="text-gray-500">Ventes</p>
                      <p className="font-bold text-white mt-0.5">{r.total_sales}</p>
                    </div>
                    <div className="bg-white/3 border border-white/5 rounded-xl p-2 text-center">
                      <p className="text-gray-500">Revenus nets</p>
                      <p className="font-bold text-emerald-400 mt-0.5">{(r.total_revenue * 0.85).toFixed(0)}€</p>
                    </div>
                    {r.is_limited_edition && r.limited_edition_total && (
                      <div className="bg-white/3 border border-white/5 rounded-xl p-2 text-center">
                        <p className="text-gray-500">Restantes</p>
                        <p className="font-bold text-amber-400 mt-0.5">{r.limited_edition_total - r.limited_edition_sold}/{r.limited_edition_total}</p>
                      </div>
                    )}
                    {daysLeft !== null && (
                      <div className="bg-red-950/30 border border-red-800/30 rounded-xl p-2 text-center">
                        <p className="text-red-500">Exclu restante</p>
                        <p className="font-bold text-red-300 mt-0.5">J-{daysLeft}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors">Gérer</button>
                  <button onClick={() => onNavigate('album-sale')} className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Voir
                  </button>
                </div>
              </Card>
            );
          })}
          <button
            onClick={() => onNavigate('create-release')}
            className="w-full border-2 border-dashed border-white/10 hover:border-red-700/50 text-gray-500 hover:text-red-400 rounded-2xl p-5 text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" /> Créer une nouvelle release
          </button>
        </div>
      )}

      {/* ANALYTICS */}
      {tab === 'analytics' && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-white text-sm">Ventes — 7 derniers jours</p>
              <Badge label="+23% vs semaine préc." variant="green" />
            </div>
            <div className="flex items-end gap-2 h-28">
              {salesByDay.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500">{d.sales}</span>
                  <div
                    className="w-full bg-red-600/80 hover:bg-red-500 transition-colors rounded-t-md"
                    style={{ height: `${(d.sales / maxS) * 100}%`, minHeight: '3px' }}
                  />
                  <span className="text-[10px] text-gray-600">{d.day}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={ShoppingBag} label="Unités vendues" value="347" color="text-blue-400" />
            <StatCard icon={DollarSign} label="Revenus bruts" value="3 468€" color="text-emerald-400" />
            <StatCard icon={Tag} label="Commission" value="520€" color="text-gray-400" />
            <StatCard icon={CreditCard} label="Revenus nets" value="2 948€" color="text-red-400" />
          </div>

          <Card className="p-5">
            <p className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" /> Top pays acheteurs
            </p>
            <div className="space-y-3">
              {[
                { country: 'France', pct: 62, count: 215 },
                { country: 'Belgique', pct: 18, count: 62 },
                { country: 'Suisse', pct: 12, count: 42 },
                { country: 'Canada', pct: 8, count: 28 },
              ].map(c => (
                <div key={c.country} className="flex items-center gap-3 text-xs">
                  <span className="text-gray-300 w-20 flex-shrink-0">{c.country}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${c.pct}%` }} />
                  </div>
                  <span className="text-gray-500 w-8 text-right">{c.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* SETTINGS */}
      {tab === 'settings' && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="font-bold text-white text-sm mb-4">Paramètres de sortie</p>
            <div className="space-y-2">
              {[
                { l: 'Durée exclusivité par défaut', v: '30 jours' },
                { l: 'Commission plateforme', v: '15%' },
                { l: 'Devise par défaut', v: 'EUR (€)' },
                { l: 'Territoires par défaut', v: 'Monde entier' },
              ].map(item => (
                <div key={item.l} className="flex items-center justify-between p-3 bg-white/3 rounded-xl">
                  <span className="text-sm text-gray-400">{item.l}</span>
                  <span className="text-sm font-semibold text-white">{item.v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" /> Protection & Anti-piratage
            </p>
            <div className="space-y-2">
              {['Streaming chiffré DRM', 'Téléchargement désactivé', 'Watermark invisible', 'Limite appareils (3 max)'].map(item => (
                <div key={item} className="flex items-center justify-between p-3 bg-white/3 rounded-xl">
                  <span className="text-sm text-gray-400">{item}</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                    <Lock className="w-3 h-3" /> Actif
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── MARKETPLACE SECTION ─────────────────── */

function MarketplaceSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Marketplace"
        subtitle="Trouvez des prestataires créatifs ou proposez vos services"
        action={
          <button onClick={() => onNavigate('marketplace')} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors">
            <ExternalLink className="w-4 h-4" /> Voir le Marketplace
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { cat: 'Montage vidéo', by: 'Alex Martin', rating: 4.9, price: '€150–€300' },
          { cat: 'Graphiste', by: 'Sophie Chen', rating: 4.8, price: '€50–€100' },
          { cat: 'Community Manager', by: 'Lucas Bernard', rating: 4.7, price: '€200/mois' },
        ].map((s, i) => (
          <Card key={i} className="p-5 hover:border-red-700/40 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-red-700 to-orange-700 rounded-xl mb-3 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-bold mb-1">{s.cat}</p>
            <p className="text-gray-500 text-xs mb-3">Par {s.by}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                <Award className="w-3.5 h-3.5" /> {s.rating}
              </div>
              <span className="text-gray-300 font-semibold text-sm">{s.price}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-950/40 border border-red-800/40 rounded-xl flex items-center justify-center">
            <Zap className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Vous êtes prestataire ?</p>
            <p className="text-gray-500 text-xs">Vendez vos services aux créateurs TruTube</p>
          </div>
          <button onClick={() => onNavigate('marketplace')} className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
            Créer mon profil <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[{ l: 'Commission', v: '10%' }, { l: 'Paiement escrow', v: 'Sécurisé' }, { l: 'Arbitrage', v: 'TruTube' }].map(i => (
            <div key={i.l} className="bg-white/3 rounded-xl p-3">
              <p className="text-gray-500 text-xs">{i.l}</p>
              <p className="font-bold text-white mt-1 text-sm">{i.v}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────── MULTI-CHANNEL SECTION ─────────────────── */

function MultiChannelSection() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Multi-chaînes"
        subtitle="Synchronisez votre contenu sur toutes les plateformes"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors">
            <Layers className="w-4 h-4" /> Connecter une plateforme
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard icon={Layers} label="Plateformes" value="4" color="text-red-400" />
        <StatCard icon={Video} label="Vidéos sync." value="127" color="text-blue-400" />
        <StatCard icon={TrendingUp} label="Portée totale" value="2.4M" color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {[
          { name: 'YouTube', connected: true, subs: '847K', views: '12.4M', sync: true },
          { name: 'Twitch', connected: true, subs: '234K', views: '3.2M', sync: true },
          { name: 'Instagram', connected: true, subs: '542K', views: '8.7M', sync: false },
          { name: 'TikTok', connected: false, subs: '—', views: '—', sync: false },
        ].map((p, i) => (
          <Card key={i} className={`p-5 ${!p.connected ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.connected ? 'bg-gradient-to-br from-red-700 to-orange-700' : 'bg-white/5'}`}>
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{p.name}</p>
                  <p className={`text-xs ${p.connected ? 'text-emerald-400' : 'text-gray-600'}`}>
                    {p.connected ? 'Connecté' : 'Non connecté'}
                  </p>
                </div>
              </div>
              {p.connected && <Badge label={p.sync ? 'Sync ON' : 'Sync OFF'} variant={p.sync ? 'green' : 'gray'} />}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/3 rounded-xl p-2">
                <p className="text-gray-500">Abonnés</p>
                <p className="text-white font-bold mt-0.5">{p.subs}</p>
              </div>
              <div className="bg-white/3 rounded-xl p-2">
                <p className="text-gray-500">Vues</p>
                <p className="text-white font-bold mt-0.5">{p.views}</p>
              </div>
            </div>
            {!p.connected && (
              <button className="w-full mt-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition-colors">
                Connecter
              </button>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <p className="font-bold text-white text-sm">Planning de synchronisation</p>
        </CardHeader>
        <div className="divide-y divide-white/5">
          {[
            { video: 'Comment créer du contenu authentique', platforms: ['YouTube', 'Twitch'], date: 'Aujourd\'hui à 18:00', status: 'scheduled' as const },
            { video: 'Les secrets d\'une bonne miniature', platforms: ['YouTube', 'Instagram'], date: 'Demain à 14:00', status: 'scheduled' as const },
            { video: 'Live Q&A avec mes abonnés', platforms: ['YouTube', 'Twitch', 'Instagram'], date: 'Dans 3 jours à 20:00', status: 'pending' as const },
          ].map((s, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 hover:bg-white/2 transition-colors">
              <div>
                <p className="text-white text-sm font-medium mb-1">{s.video}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.platforms.map(p => <Badge key={p} label={p} variant="gray" />)}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-gray-400 text-xs mb-1">{s.date}</p>
                <Badge label={s.status === 'scheduled' ? 'Programmé' : 'En attente'} variant={s.status === 'scheduled' ? 'blue' : 'amber'} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────── SETTINGS SECTION ─────────────────── */

function SettingsSection() {
  const groups = [
    {
      title: 'Chaîne',
      icon: <Video className="w-4 h-4 text-red-400" />,
      inputs: true,
    },
    {
      title: 'Monétisation',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      toggles: [
        { l: 'Activer la monétisation sur tous mes contenus', on: true },
        { l: 'Autoriser les pourboires', on: true },
        { l: 'Afficher les produits affiliés', on: false },
        { l: 'Activer les abonnements créateur', on: true },
      ],
    },
    {
      title: 'Confidentialité',
      icon: <Shield className="w-4 h-4 text-blue-400" />,
      toggles: [
        { l: 'Afficher mon nombre d\'abonnés', on: true },
        { l: 'Autoriser les commentaires par défaut', on: true },
        { l: 'Modération automatique des commentaires', on: true },
        { l: 'Autoriser les messages privés', on: false },
      ],
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-4 h-4 text-amber-400" />,
      toggles: [
        { l: 'Nouveaux commentaires', on: true },
        { l: 'Nouveaux abonnés', on: true },
        { l: 'Revenus reçus', on: true },
        { l: 'Alertes de modération', on: true },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <PageHeader title="Paramètres" subtitle="Configurez votre studio et vos préférences" />

      <div className="space-y-4">
        {groups.map((g, gi) => (
          <Card key={gi} className="p-5">
            <p className="font-bold text-white text-sm mb-4 flex items-center gap-2">{g.icon} {g.title}</p>
            {g.inputs ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">Nom de la chaîne</label>
                  <input type="text" defaultValue="Alex Beats" className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-600 transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">Description</label>
                  <textarea defaultValue="Music producer and beat maker" rows={3} className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-600 transition-colors resize-none" />
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors">Sauvegarder</button>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-sm transition-colors">Annuler</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {g.toggles!.map((t, ti) => (
                  <div key={ti} className="flex items-center justify-between p-3 bg-white/3 rounded-xl">
                    <span className="text-gray-300 text-sm">{t.l}</span>
                    <Toggle enabled={t.on} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}

        <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-2xl">
          <p className="text-red-300 font-semibold text-sm mb-1">Zone dangereuse</p>
          <p className="text-gray-500 text-xs mb-3">Ces actions sont irréversibles. Procédez avec précaution.</p>
          <button className="text-xs px-4 py-2 border border-red-800/50 text-red-400 hover:bg-red-950/40 rounded-xl transition-colors font-medium">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}
