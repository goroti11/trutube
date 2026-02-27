import { useState, useEffect } from 'react';
import MobileLayout from '../components/mobile/MobileLayout';
import MobileVideoPlayer from '../components/mobile/MobileVideoPlayer';
import FlowPlayer from '../components/video/FlowPlayer';
import QualitySpeedSheet from '../components/mobile/QualitySpeedSheet';
import VideoOptionsSheet from '../components/mobile/VideoOptionsSheet';
import VideoActions from '../components/mobile/VideoActions';
import CommentsPreview from '../components/mobile/CommentsPreview';
import MiniPlayer from '../components/mobile/MiniPlayer';
import { ChevronRight, Zap, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { flowService } from '../services/flowService';
import { videoService } from '../services/videoService';
import { commentService } from '../services/commentService';
import type { FlowInfo } from '../types/flow';
import type { Video, Comment } from '../types';

interface MobileVideoPageProps {
  videoId?: string;
  initialFlowMode?: boolean;
  initialFlowId?: string;
}

export default function MobileVideoPage({ videoId, initialFlowMode = false, initialFlowId }: MobileVideoPageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showQualitySheet, setShowQualitySheet] = useState(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [flowInfo, setFlowInfo] = useState<FlowInfo | null>(null);
  const [isFlowMode, setIsFlowMode] = useState(initialFlowMode);
  const [lastFlowNodeId, setLastFlowNodeId] = useState<string | null>(null);

  const [videoData, setVideoData] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideoData = async () => {
      if (!videoId) {
        setError('ID de vidéo manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [video, videoComments, related] = await Promise.all([
          videoService.getVideoById(videoId),
          commentService.getComments(videoId),
          videoService.getVideos(3)
        ]);

        if (!video) {
          setError('Vidéo non trouvée');
          return;
        }

        setVideoData(video as unknown as Video);
        setComments(videoComments.slice(0, 3) as unknown as Comment[]);
        setRelatedVideos(
          (related as unknown as Video[]).filter(v => v.id !== videoId).slice(0, 3)
        );
      } catch (err) {
        console.error('Error loading video:', err);
        setError('Erreur lors du chargement de la vidéo');
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
  }, [videoId, user]);

  useEffect(() => {
    if (user && videoId) {
      flowService.checkFlowForVideo(videoId).then(setFlowInfo);
    }
  }, [user, videoId]);

  useEffect(() => {
    if (initialFlowId) {
      setIsFlowMode(true);
    }
  }, [initialFlowId]);

  const handleToggleFlowMode = () => {
    setIsFlowMode(!isFlowMode);
  };

  const handleExitToFullVideo = (_exitVideoId: string, _timestamp: number) => {
    setIsFlowMode(false);
  };

  const handleBackToFlow = (nodeId: string) => {
    setLastFlowNodeId(nodeId);
    setIsFlowMode(false);
  };

  const handleLike = () => {
    if (!user || !videoId) return;
    if (!isLiked && isDisliked) setIsDisliked(false);
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    if (!user || !videoId) return;
    setIsSaved(!isSaved);
  };

  if (loading) {
    return (
      <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#D8A0B6] animate-spin" />
        </div>
      </MobileLayout>
    );
  }

  if (error || !videoData) {
    return (
      <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-xl text-white mb-4">{error || 'Vidéo introuvable'}</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-[#D8A0B6] text-white rounded-lg"
            >
              Retour
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="bg-[#0B0B0D] min-h-screen pb-20">
        {!isMinimized && (
          <>
            {isFlowMode && (flowInfo || initialFlowId) ? (
              <div className="w-full aspect-video">
                <FlowPlayer
                  flowId={initialFlowId || flowInfo!.id}
                  onExitToFullVideo={handleExitToFullVideo}
                  onBackToLongVideo={lastFlowNodeId ? handleBackToFlow : undefined}
                  userId={user?.id || null}
                />
              </div>
            ) : (
              <MobileVideoPlayer
                videoUrl={videoData.videoUrl}
                title={videoData.title}
                onMinimize={() => setIsMinimized(true)}
                onQualityClick={() => setShowQualitySheet(true)}
                onSettingsClick={() => setShowOptionsSheet(true)}
              />
            )}
          </>
        )}

        <div className="p-4 space-y-4">
          <div>
            <h1 className="text-xl font-bold text-white mb-2">{videoData.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{videoData.viewCount.toLocaleString()} vues</span>
              <span>•</span>
              <span>{new Date(videoData.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {flowInfo && !isFlowMode && (
            <button
              onClick={handleToggleFlowMode}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-colors font-semibold text-white"
            >
              <Zap className="w-5 h-5" />
              <span>FLOW Mode ({flowInfo.total_nodes} clips)</span>
            </button>
          )}

          {isFlowMode && (
            <button
              onClick={handleToggleFlowMode}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-semibold text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Exit FLOW</span>
            </button>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={videoData.user?.avatarUrl || '/default-avatar.png'}
                alt={videoData.user?.displayName || 'Creator'}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-white font-medium">{videoData.user?.displayName || 'Unknown'}</h3>
                <p className="text-sm text-gray-400">{videoData.user?.subscriberCount?.toLocaleString() || 0} abonnés</p>
              </div>
            </div>
            {user && videoData.creatorId !== user.id && (
              <button className="px-6 py-2 bg-[#D8A0B6] hover:bg-[#C890A6] rounded-full text-white font-medium transition-colors">
                S'abonner
              </button>
            )}
          </div>

          <VideoActions
            likes={videoData.likeCount}
            dislikes={0}
            isLiked={isLiked}
            isDisliked={isDisliked}
            isSaved={isSaved}
            onLike={handleLike}
            onDislike={() => setIsDisliked(!isDisliked)}
            onShare={() => console.log('Share')}
            onSave={handleSave}
            onReport={() => console.log('Report')}
          />

          <div className="bg-[#1A1A1A] rounded-lg p-4">
            <p className="text-sm text-gray-300 line-clamp-3">{videoData.description}</p>
            <button className="text-sm text-[#D8A0B6] font-medium mt-2 flex items-center gap-1">
              Afficher plus
              <ChevronRight size={16} />
            </button>
          </div>

          <CommentsPreview
            comments={comments.map(c => ({
              id: c.id,
              author: c.user?.displayName || c.user?.username || 'Anonymous',
              authorAvatar: c.user?.avatarUrl || '/default-avatar.png',
              content: c.content,
              likes: c.likeCount,
              timeAgo: new Date(c.createdAt).toLocaleDateString('fr-FR')
            }))}
            commentCount={videoData.commentCount || 0}
            onViewAll={() => console.log('View all comments')}
          />

          <div className="space-y-3">
            <h3 className="text-white font-semibold">Vidéos suggérées</h3>
            {relatedVideos.length === 0 ? (
              <p className="text-gray-400 text-sm">Aucune vidéo suggérée</p>
            ) : (
              relatedVideos.map((video) => (
                <div key={video.id} className="flex gap-3">
                  <div className="w-40 aspect-video bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                    {video.thumbnailUrl && (
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium line-clamp-2 mb-1">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-400">{video.user?.displayName}</p>
                    <p className="text-xs text-gray-400">{video.viewCount.toLocaleString()} vues</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isMinimized && (
        <MiniPlayer
          videoUrl={videoData.videoUrl}
          title={videoData.title}
          creator={videoData.user?.displayName || 'Unknown'}
          thumbnailUrl={videoData.thumbnailUrl || ''}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onClose={() => setIsMinimized(false)}
          onMaximize={() => setIsMinimized(false)}
        />
      )}

      <QualitySpeedSheet
        isOpen={showQualitySheet}
        onClose={() => setShowQualitySheet(false)}
      />

      <VideoOptionsSheet
        isOpen={showOptionsSheet}
        onClose={() => setShowOptionsSheet(false)}
      />
    </MobileLayout>
  );
}
