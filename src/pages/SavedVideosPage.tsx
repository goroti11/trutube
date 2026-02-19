import { useState, useEffect } from 'react';
import { Bookmark, Search, Trash2, Play, Clock, ArrowLeft, BookmarkX, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { savedVideosService, SavedVideo } from '../services/savedVideosService';

interface SavedVideosPageProps {
  onNavigate: (page: string) => void;
  onVideoClick?: (videoId: string) => void;
}

function formatDuration(seconds: number): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${h}:${(m % 60).toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
  return `Il y a ${Math.floor(days / 30)} mois`;
}

type SortOption = 'recent' | 'oldest' | 'title';

export default function SavedVideosPage({ onNavigate, onVideoClick }: SavedVideosPageProps) {
  const { user } = useAuth();
  const [videos, setVideos] = useState<SavedVideo[]>([]);
  const [filtered, setFiltered] = useState<SavedVideo[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('recent');
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    savedVideosService.getSavedVideos(user.id).then(data => {
      setVideos(data);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    let result = [...videos];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(v =>
        v.video_title.toLowerCase().includes(q) ||
        v.video_creator.toLowerCase().includes(q)
      );
    }
    if (sort === 'recent') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sort === 'oldest') result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else if (sort === 'title') result.sort((a, b) => a.video_title.localeCompare(b.video_title));
    setFiltered(result);
  }, [videos, search, sort]);

  const handleRemove = async (savedId: string, videoId: string) => {
    if (!user) return;
    setRemoving(savedId);
    await savedVideosService.unsaveVideo(user.id, videoId);
    setVideos(prev => prev.filter(v => v.id !== savedId));
    setRemoving(null);
  };

  const handleClearAll = async () => {
    if (!user || !window.confirm('Supprimer toutes les vidéos sauvegardées ?')) return;
    for (const v of videos) {
      await savedVideosService.unsaveVideo(user.id, v.video_id);
    }
    setVideos([]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Connexion requise</h2>
          <p className="text-gray-400 mb-6">Connectez-vous pour voir vos vidéos sauvegardées.</p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600/20 rounded-xl flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">Vidéos sauvegardées</h1>
              <p className="text-xs text-gray-400 mt-0.5">{videos.length} vidéo{videos.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {videos.length > 0 && (
            <button
              onClick={handleClearAll}
              className="ml-auto flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Tout supprimer</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {videos.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans vos sauvegardes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="recent">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="title">Titre A-Z</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-700" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-gray-800/80 rounded-3xl flex items-center justify-center mb-6">
              <BookmarkX className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {search ? 'Aucun résultat' : 'Aucune vidéo sauvegardée'}
            </h2>
            <p className="text-gray-400 max-w-sm mb-8">
              {search
                ? 'Aucune vidéo ne correspond à votre recherche.'
                : 'Sauvegardez des vidéos pour les retrouver facilement ici. Cliquez sur le bouton "Enregistrer" sous n\'importe quelle vidéo.'}
            </p>
            {!search && (
              <button
                onClick={() => onNavigate('home')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
              >
                Explorer les vidéos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(video => (
              <div
                key={video.id}
                className="group bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all hover:shadow-xl hover:shadow-black/40"
              >
                <div className="relative aspect-video bg-gray-800 overflow-hidden cursor-pointer"
                  onClick={() => onVideoClick?.(video.video_id)}
                >
                  {video.video_thumbnail ? (
                    <img
                      src={video.video_thumbnail}
                      alt={video.video_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <Play className="w-10 h-10 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  {video.video_duration > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                      {formatDuration(video.video_duration)}
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3
                    className="font-semibold text-sm text-white line-clamp-2 cursor-pointer hover:text-red-400 transition-colors leading-snug mb-1"
                    onClick={() => onVideoClick?.(video.video_id)}
                  >
                    {video.video_title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">{video.video_creator}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {timeAgo(video.created_at)}
                    </div>
                    <button
                      onClick={() => handleRemove(video.id, video.video_id)}
                      disabled={removing === video.id}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                      title="Retirer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
