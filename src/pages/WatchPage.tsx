import { useEffect, useState } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Share2, Save, Scissors, Flag, MessageCircle, Zap } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { videoService, VideoWithCreator } from '../services/videoService';
import { flowService } from '../services/flowService';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Video } from '../types';
import EnhancedVideoPlayer from '../components/video/EnhancedVideoPlayer';
import FlowPlayer from '../components/video/FlowPlayer';
import VideoSettingsSheet from '../components/video/VideoSettingsSheet';
import VideoMoreSheet from '../components/video/VideoMoreSheet';
import RelatedVideos from '../components/video/RelatedVideos';
import ReviewsList from '../components/reviews/ReviewsList';
import { convertSupabaseVideosToTypeVideos } from '../utils/videoConverters';
import type { FlowInfo } from '../types/flow';

interface WatchPageProps {
  videoId: string;
  onNavigate: (page: string, data?: any) => void;
  initialFlowMode?: boolean;
  initialFlowId?: string;
}

export default function WatchPage({ videoId, onNavigate, initialFlowMode = false, initialFlowId }: WatchPageProps) {
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [flowInfo, setFlowInfo] = useState<FlowInfo | null>(null);
  const [isFlowMode, setIsFlowMode] = useState(initialFlowMode);
  const [lastFlowNodeId, setLastFlowNodeId] = useState<string | null>(null);

  const { setCurrentVideo, setIsMiniPlayer } = usePlayerStore();

  useEffect(() => {
    loadVideo();
    setIsMiniPlayer(false);
  }, [videoId]);

  useEffect(() => {
    if (initialFlowId) {
      setIsFlowMode(true);
    }
  }, [initialFlowId]);

  const loadVideo = async () => {
    setLoading(true);

    try {
      const videoData = await videoService.getVideoById(videoId);
      setVideo(videoData);

      if (videoData) {
        setCurrentVideo({
          id: videoData.id,
          title: videoData.title,
          creator_id: videoData.creator_id,
          creator_name: videoData.creator?.display_name || 'Créateur',
          creator_avatar: videoData.creator?.avatar_url || '',
          video_url: videoData.video_url || '/placeholder-video.mp4',
          thumbnail_url: videoData.thumbnail_url || '',
          view_count: videoData.view_count || 0,
          like_count: videoData.like_count || 0,
          created_at: videoData.created_at,
          duration: videoData.duration || 0
        });

        if (videoData.universe_id) {
          const related = await videoService.getVideos(12, videoData.universe_id);
          const convertedVideos = convertSupabaseVideosToTypeVideos(related);
          setRelatedVideos(convertedVideos.filter((v) => v.id !== videoId));
        }

        if (user) {
          const flow = await flowService.checkFlowForVideo(videoId);
          setFlowInfo(flow);
        }
      }
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !video) return;

    try {
      if (liked) {
        await supabase
          .from('video_reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', video.id)
          .eq('reaction_type', 'like');
        setLiked(false);
      } else {
        if (disliked) {
          await supabase
            .from('video_reactions')
            .delete()
            .eq('user_id', user.id)
            .eq('video_id', video.id)
            .eq('reaction_type', 'dislike');
          setDisliked(false);
        }
        await supabase
          .from('video_reactions')
          .insert({
            user_id: user.id,
            video_id: video.id,
            reaction_type: 'like'
          });
        setLiked(true);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleDislike = async () => {
    if (!user || !video) return;

    try {
      if (disliked) {
        await supabase
          .from('video_reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', video.id)
          .eq('reaction_type', 'dislike');
        setDisliked(false);
      } else {
        if (liked) {
          await supabase
            .from('video_reactions')
            .delete()
            .eq('user_id', user.id)
            .eq('video_id', video.id)
            .eq('reaction_type', 'like');
          setLiked(false);
        }
        await supabase
          .from('video_reactions')
          .insert({
            user_id: user.id,
            video_id: video.id,
            reaction_type: 'dislike'
          });
        setDisliked(true);
      }
    } catch (error) {
      console.error('Error handling dislike:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers!');
    }
  };

  const handleToggleFlowMode = () => {
    setIsFlowMode(!isFlowMode);
  };

  const handleExitToFullVideo = (exitVideoId: string, timestamp: number) => {
    setIsFlowMode(false);
    if (exitVideoId !== videoId) {
      onNavigate('watch', { videoId: exitVideoId, timestamp });
    }
  };

  const handleBackToFlow = (nodeId: string) => {
    setLastFlowNodeId(nodeId);
    setIsFlowMode(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4">Vidéo introuvable</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold line-clamp-1">{video.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black">
              {isFlowMode && (flowInfo || initialFlowId) ? (
                <div className="aspect-video w-full">
                  <FlowPlayer
                    flowId={initialFlowId || flowInfo!.id}
                    onExitToFullVideo={handleExitToFullVideo}
                    onBackToLongVideo={lastFlowNodeId ? handleBackToFlow : undefined}
                    userId={user?.id || null}
                  />
                </div>
              ) : (
                <EnhancedVideoPlayer
                  onSettingsClick={() => setShowSettings(true)}
                  className="aspect-video w-full"
                />
              )}
            </div>

            {/* Video Info */}
            <div className="p-4 space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-2">{video.title}</h2>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{formatNumber(video.view_count)} vues • {formatDate(video.created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {flowInfo && !isFlowMode && (
                  <button
                    onClick={handleToggleFlowMode}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full transition-colors"
                  >
                    <Zap className="w-5 h-5" />
                    <span>FLOW Mode ({flowInfo.total_nodes} clips)</span>
                  </button>
                )}

                {isFlowMode && (
                  <button
                    onClick={handleToggleFlowMode}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Exit FLOW</span>
                  </button>
                )}

                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    liked ? 'bg-primary-500' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>{formatNumber(video.like_count + (liked ? 1 : 0))}</span>
                </button>

                <button
                  onClick={handleDislike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    disliked ? 'bg-red-500' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Partager</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                  <Save className="w-5 h-5" />
                  <span>Enregistrer</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                  <Scissors className="w-5 h-5" />
                  <span>Clip</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                  <Flag className="w-5 h-5" />
                  <span>Signaler</span>
                </button>
              </div>

              {/* Creator Info */}
              <div className="flex items-start gap-4 p-4 bg-gray-900 rounded-xl">
                <div
                  className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0 overflow-hidden cursor-pointer"
                  onClick={() => onNavigate('profile', { userId: video.creator_id })}
                >
                  {video.creator?.avatar_url ? (
                    <img src={video.creator.avatar_url} alt={video.creator.display_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {video.creator?.display_name?.[0] || '?'}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold cursor-pointer hover:text-primary-400"
                    onClick={() => onNavigate('profile', { userId: video.creator_id })}
                  >
                    {video.creator?.display_name || 'Créateur'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {formatNumber(video.creator?.subscriber_count || 0)} abonnés
                  </p>

                  {/* Description */}
                  <div className="mt-3">
                    <p className={`text-sm text-gray-300 whitespace-pre-line ${
                      showFullDescription ? '' : 'line-clamp-3'
                    }`}>
                      {video.description}
                    </p>
                    {video.description?.length > 150 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-sm text-gray-400 hover:text-white mt-2"
                      >
                        {showFullDescription ? 'Voir moins' : 'Voir plus'}
                      </button>
                    )}
                  </div>
                </div>

                <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-full font-semibold transition-colors">
                  S'abonner
                </button>
              </div>

              {/* Reviews Section */}
              <div className="mt-8">
                <ReviewsList
                  targetId={video.id}
                  reviewType="video"
                  canRespond={user?.id === video.creator_id}
                />
              </div>

              {/* Comments Preview */}
              <div className="p-4 bg-gray-900 rounded-xl mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Commentaires
                    <span className="text-sm text-gray-400">({video.comment_count || 0})</span>
                  </h3>
                </div>
                <p className="text-sm text-gray-400">
                  Section commentaires disponible prochainement
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <RelatedVideos
              videos={relatedVideos}
              onVideoClick={(id) => onNavigate('watch', { videoId: id })}
            />
          </div>
        </div>
      </div>

      {/* Settings Sheet */}
      {showSettings && (
        <VideoSettingsSheet
          onClose={() => setShowSettings(false)}
          onMoreClick={() => {
            setShowSettings(false);
            setShowMore(true);
          }}
        />
      )}

      {/* More Sheet */}
      {showMore && (
        <VideoMoreSheet onClose={() => setShowMore(false)} />
      )}
    </div>
  );
}
