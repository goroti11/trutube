import { useState, useEffect } from 'react';
import { ArrowLeft, Radio, Users, Clock, Eye, DollarSign, MessageSquare, PlayCircle, StopCircle, Settings, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { liveStreamService, LiveStream, LiveStreamStats } from '../services/liveStreamService';
import { universeService } from '../services/universeService';

interface LiveStreamingPageProps {
  onNavigate: (page: string) => void;
}

export default function LiveStreamingPage({ onNavigate }: LiveStreamingPageProps) {
  const { user } = useAuth();
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(null);
  const [stats, setStats] = useState<LiveStreamStats | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [universes, setUniverses] = useState<any[]>([]);

  useEffect(() => {
    loadUniverses();
    loadCurrentStream();
  }, [user]);

  useEffect(() => {
    if (currentStream && isLive) {
      const interval = setInterval(() => {
        updateStats();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentStream, isLive]);

  const loadUniverses = async () => {
    const data = await universeService.getAllUniverses();
    setUniverses(data);
  };

  const loadCurrentStream = async () => {
    if (!user) return;
    const streams = await liveStreamService.getCreatorLiveStreams(user.id);
    const activeStream = streams.find(s => s.status === 'live');
    if (activeStream) {
      setCurrentStream(activeStream);
      setIsLive(true);
      updateStats();
    }
  };

  const updateStats = async () => {
    if (!currentStream) return;
    const newStats = await liveStreamService.getStreamStats(currentStream.id);
    if (newStats) {
      setStats(newStats);
    }
  };

  const handleStartStream = async () => {
    if (!currentStream) return;
    const result = await liveStreamService.startLiveStream(currentStream.id);
    if (result.success) {
      setIsLive(true);
      setCurrentStream({ ...currentStream, status: 'live', started_at: new Date().toISOString() });
    }
  };

  const handleEndStream = async () => {
    if (!currentStream) return;
    if (!confirm('Êtes-vous sûr de vouloir terminer ce live?')) return;

    const result = await liveStreamService.endLiveStream(currentStream.id);
    if (result.success) {
      setIsLive(false);
      setCurrentStream({ ...currentStream, status: 'ended', ended_at: new Date().toISOString() });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Vous devez être connecté pour accéder au live streaming</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('creator-studio')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au Studio
          </button>

          {isLive && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="font-bold">EN DIRECT</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!currentStream || currentStream.status === 'ended' ? (
          <CreateLiveSection onNavigate={onNavigate} />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{currentStream.title}</h1>
              <p className="text-gray-400">{currentStream.description}</p>
            </div>

            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Users}
                  label="Spectateurs actuels"
                  value={stats.currentViewers.toString()}
                  color="text-blue-400"
                />
                <StatCard
                  icon={Eye}
                  label="Pic de spectateurs"
                  value={stats.peakViewers.toString()}
                  color="text-green-400"
                />
                <StatCard
                  icon={Users}
                  label="Spectateurs totaux"
                  value={stats.totalViewers.toString()}
                  color="text-red-400"
                />
                <StatCard
                  icon={Users}
                  label="Moyenne spectateurs"
                  value={Math.round(stats.averageViewers).toString()}
                  color="text-purple-400"
                />
              </div>
            )}

            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  icon={Clock}
                  label="Durée du live"
                  value={liveStreamService.formatDuration(stats.duration)}
                  color="text-yellow-400"
                />
                <StatCard
                  icon={MessageSquare}
                  label="Messages"
                  value={stats.totalMessages.toString()}
                  color="text-pink-400"
                />
                <StatCard
                  icon={DollarSign}
                  label="Tips reçus"
                  value={`€${stats.totalTips.toFixed(2)}`}
                  color="text-green-400"
                />
              </div>
            )}

            <div className="bg-gray-900 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Contrôles du live</h2>
              <div className="flex gap-4">
                {!isLive ? (
                  <button
                    onClick={handleStartStream}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Démarrer le live
                  </button>
                ) : (
                  <button
                    onClick={handleEndStream}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                  >
                    <StopCircle className="w-5 h-5" />
                    Terminer le live
                  </button>
                )}

                <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors">
                  <Settings className="w-5 h-5" />
                  Paramètres
                </button>
              </div>
            </div>

            {isLive && (
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Informations de connexion</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Clé de streaming
                    </label>
                    <div className="bg-gray-800 rounded-lg px-4 py-3 font-mono text-sm">
                      {currentStream.stream_key}
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      Utilisez cette clé dans votre logiciel de streaming (OBS, Streamlabs, etc.)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      URL du serveur RTMP
                    </label>
                    <div className="bg-gray-800 rounded-lg px-4 py-3 font-mono text-sm">
                      rtmp://stream.goroti.com/live
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <PastLivesSection userId={user.id} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

function CreateLiveSection({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    universe_id: '',
    sub_universe_id: ''
  });
  const [universes, setUniverses] = useState<any[]>([]);
  const [subUniverses, setSubUniverses] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadUniverses();
  }, []);

  useEffect(() => {
    if (formData.universe_id) {
      loadSubUniverses(formData.universe_id);
    } else {
      setSubUniverses([]);
    }
  }, [formData.universe_id]);

  const loadUniverses = async () => {
    const data = await universeService.getAllUniverses();
    setUniverses(data);
  };

  const loadSubUniverses = async (universeId: string) => {
    const data = await universeService.getSubUniverses(universeId);
    setSubUniverses(data);
  };

  const handleCreateLive = async () => {
    if (!formData.title.trim()) {
      alert('Veuillez entrer un titre');
      return;
    }

    setIsCreating(true);

    const result = await liveStreamService.createLiveStream({
      title: formData.title,
      description: formData.description,
      universe_id: formData.universe_id || undefined,
      sub_universe_id: formData.sub_universe_id || undefined
    });

    setIsCreating(false);

    if (result.success) {
      window.location.reload();
    } else {
      alert(result.error || 'Erreur lors de la création');
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Radio className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Créer un live</h1>
        <p className="text-gray-400">Partagez du contenu en direct avec votre communauté</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Titre du live <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Donnez un titre accrocheur à votre live"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez le contenu de votre live..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            maxLength={500}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Univers
            </label>
            <select
              value={formData.universe_id}
              onChange={(e) => setFormData({ ...formData, universe_id: e.target.value, sub_universe_id: '' })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Sélectionner un univers</option>
              {universes.map((universe) => (
                <option key={universe.id} value={universe.id}>
                  {universe.icon} {universe.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sous-univers
            </label>
            <select
              value={formData.sub_universe_id}
              onChange={(e) => setFormData({ ...formData, sub_universe_id: e.target.value })}
              disabled={!formData.universe_id || subUniverses.length === 0}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              <option value="">Aucun</option>
              {subUniverses.map((subUniverse) => (
                <option key={subUniverse.id} value={subUniverse.id}>
                  {subUniverse.icon} {subUniverse.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCreateLive}
          disabled={isCreating}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Création...' : 'Créer le live'}
        </button>
      </div>
    </div>
  );
}

function PastLivesSection({ userId, onNavigate }: { userId: string; onNavigate: (page: string) => void }) {
  const [pastLives, setPastLives] = useState<LiveStream[]>([]);

  useEffect(() => {
    loadPastLives();
  }, [userId]);

  const loadPastLives = async () => {
    const streams = await liveStreamService.getCreatorLiveStreams(userId);
    const ended = streams.filter(s => s.status === 'ended');
    setPastLives(ended);
  };

  if (pastLives.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Lives précédents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastLives.map((stream) => (
          <PastLiveCard key={stream.id} stream={stream} />
        ))}
      </div>
    </div>
  );
}

function PastLiveCard({ stream }: { stream: LiveStream }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors">
      <h3 className="font-bold text-lg mb-2">{stream.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{stream.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-400">Spectateurs</div>
          <div className="font-bold">{stream.total_viewers}</div>
        </div>
        <div>
          <div className="text-gray-400">Durée</div>
          <div className="font-bold">{liveStreamService.formatDuration(stream.duration_seconds)}</div>
        </div>
        <div>
          <div className="text-gray-400">Pic</div>
          <div className="font-bold">{stream.peak_viewers}</div>
        </div>
        <div>
          <div className="text-gray-400">Messages</div>
          <div className="font-bold">{stream.total_messages}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-400">
        {new Date(stream.ended_at!).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
