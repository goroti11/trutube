import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Video, Eye, ThumbsUp, MessageCircle, Trash2, Edit, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { videoUploadService } from '../services/videoUploadService';
import { videoService } from '../services/videoService';

interface CreatorDashboardV2PageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function CreatorDashboardV2Page({ onNavigate }: CreatorDashboardV2PageProps) {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });

  useEffect(() => {
    loadVideos();
  }, [user]);

  const loadVideos = async () => {
    if (!user) return;

    setLoading(true);
    const data = await videoUploadService.getCreatorVideos(user.id, true);
    setVideos(data);

    const totalViews = data.reduce((sum, v) => sum + (v.view_count || 0), 0);
    const totalLikes = data.reduce((sum, v) => sum + (v.like_count || 0), 0);
    const totalComments = data.reduce((sum, v) => sum + (v.comment_count || 0), 0);

    setStats({
      totalVideos: data.length,
      totalViews,
      totalLikes,
      totalComments
    });

    setLoading(false);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;

    const success = await videoUploadService.deleteVideo(videoId);
    if (success) {
      loadVideos();
    } else {
      alert('Erreur lors de la suppression de la vidéo');
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getStatusBadge = (status: string, isPublished: boolean) => {
    if (!isPublished) {
      return (
        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
          Brouillon
        </span>
      );
    }

    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
            Publié
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
            En traitement
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
            En attente
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
            Échec
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Dashboard Créateur</h1>
                <p className="text-sm text-gray-400">Gérez votre contenu et vos statistiques</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('upload')}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Publier une vidéo
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-500/20 to-primary-500/5 border border-primary-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-sm text-gray-400">Vidéos</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalVideos}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm text-gray-400">Vues</span>
            </div>
            <p className="text-3xl font-bold">{formatNumber(stats.totalViews)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Likes</span>
            </div>
            <p className="text-3xl font-bold">{formatNumber(stats.totalLikes)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm text-gray-400">Commentaires</span>
            </div>
            <p className="text-3xl font-bold">{formatNumber(stats.totalComments)}</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold">Mes vidéos</h2>
            <p className="text-sm text-gray-400 mt-1">
              {videos.length === 0
                ? 'Vous n\'avez pas encore publié de vidéo'
                : `${videos.length} vidéo${videos.length > 1 ? 's' : ''} publiée${videos.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {videos.length === 0 ? (
            <div className="p-12 text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold mb-2">Aucune vidéo</h3>
              <p className="text-gray-400 mb-6">
                Commencez à partager votre contenu avec votre communauté
              </p>
              <button
                onClick={() => onNavigate('upload')}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Publier ma première vidéo
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="p-6 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0 w-40 h-24 bg-gray-800 rounded-lg overflow-hidden group">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                      {video.is_published && video.processing_status === 'completed' && (
                        <button
                          onClick={() => onNavigate('video', { videoId: video.id })}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Play className="w-8 h-8" />
                        </button>
                      )}
                      {video.duration > 0 && (
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-xs rounded">
                          {videoUploadService.formatDuration(video.duration)}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold mb-1 truncate">{video.title}</h3>
                          <p className="text-sm text-gray-400 line-clamp-2">{video.description}</p>
                        </div>
                        {getStatusBadge(video.processing_status, video.is_published)}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(video.view_count || 0)} vues</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{formatNumber(video.like_count || 0)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{formatNumber(video.comment_count || 0)}</span>
                        </div>
                        {video.universe && (
                          <span className="px-2 py-1 bg-gray-800 rounded text-xs">
                            {video.universe.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {new Date(video.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        {video.file_size > 0 && (
                          <>
                            <span className="text-gray-700">•</span>
                            <span className="text-xs text-gray-500">
                              {videoUploadService.formatFileSize(video.file_size)}
                            </span>
                          </>
                        )}
                        {video.quality && (
                          <>
                            <span className="text-gray-700">•</span>
                            <span className="text-xs text-gray-500">{video.quality}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => onNavigate('video', { videoId: video.id })}
                        disabled={!video.is_published || video.processing_status !== 'completed'}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Voir la vidéo"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {}}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
