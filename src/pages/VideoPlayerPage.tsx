import { useState } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Video } from '../types';
import { useAuth } from '../contexts/AuthContext';
import VideoPlayer from '../components/video/VideoPlayer';
import VideoInfo from '../components/video/VideoInfo';
import VideoActions from '../components/video/VideoActions';
import CreatorInfo from '../components/video/CreatorInfo';
import CommentsSection from '../components/video/CommentsSection';
import RelatedVideos from '../components/video/RelatedVideos';
import TipModal from '../components/TipModal';
import ReportContentModal from '../components/ReportContentModal';
import AdUnit from '../components/AdUnit';

interface VideoPlayerPageProps {
  video: Video;
  relatedVideos: Video[];
  onBack: () => void;
  onVideoClick: (videoId: string) => void;
  onNavigateHome: () => void;
}

export default function VideoPlayerPage({
  video,
  relatedVideos,
  onBack,
  onVideoClick,
  onNavigateHome
}: VideoPlayerPageProps) {
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [localVideo, setLocalVideo] = useState(video);
  const [comments, setComments] = useState<any[]>([]);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLocalVideo((prev) => ({
        ...prev,
        likeCount: Math.max(0, prev.likeCount - 1)
      }));
    } else {
      setIsLiked(true);
      if (isDisliked) {
        setIsDisliked(false);
        setLocalVideo((prev) => ({
          ...prev,
          likeCount: prev.likeCount + 1,
          dislikeCount: Math.max(0, (prev as any).dislikeCount - 1)
        }));
      } else {
        setLocalVideo((prev) => ({
          ...prev,
          likeCount: prev.likeCount + 1
        }));
      }
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
      setLocalVideo((prev) => ({
        ...prev,
        dislikeCount: Math.max(0, (prev as any).dislikeCount - 1)
      } as any));
    } else {
      setIsDisliked(true);
      if (isLiked) {
        setIsLiked(false);
        setLocalVideo((prev) => ({
          ...prev,
          dislikeCount: ((prev as any).dislikeCount || 0) + 1,
          likeCount: Math.max(0, prev.likeCount - 1)
        } as any));
      } else {
        setLocalVideo((prev) => ({
          ...prev,
          dislikeCount: ((prev as any).dislikeCount || 0) + 1
        } as any));
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: localVideo.title,
        text: `Regardez "${localVideo.title}" sur TruTube`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier!');
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleDownload = () => {
    alert('Téléchargement commencé...');
  };

  const handleCreateClip = () => {
    alert('Fonctionnalité de création de clips à venir');
  };

  const handleAddToPlaylist = () => {
    alert('Fonctionnalité de playlist à venir');
  };

  const handleRemix = () => {
    alert('Fonctionnalité de remix à venir');
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    if (!isSubscribed) {
      setHasNotifications(true);
    }
  };

  const handleToggleNotifications = () => {
    if (isSubscribed) {
      setHasNotifications(!hasNotifications);
    }
  };

  const handleAddComment = (content: string) => {
    const newComment = {
      id: Date.now().toString(),
      user: {
        id: user?.id || 'unknown',
        displayName: user?.user_metadata?.username || user?.email?.split('@')[0] || 'Anonymous',
        avatarUrl: user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
      },
      content,
      likeCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false
    };
    setComments([newComment, ...comments]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? { ...c, isLiked: !c.isLiked, likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1 }
          : c
      )
    );
  };

  const handleReportComment = (commentId: string) => {
    alert(`Commentaire ${commentId} signalé`);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNavigateHome}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg line-clamp-1">{localVideo.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer
              videoUrl={localVideo.videoUrl || ''}
              thumbnailUrl={localVideo.thumbnailUrl}
              title={localVideo.title}
            />

            <AdUnit slot="video-top" format="horizontal" responsive />

            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{localVideo.title}</h1>

              <VideoActions
                likeCount={localVideo.likeCount}
                dislikeCount={(localVideo as any).dislikeCount || 0}
                isLiked={isLiked}
                isDisliked={isDisliked}
                isSaved={isSaved}
                onLike={handleLike}
                onDislike={handleDislike}
                onShare={handleShare}
                onSave={handleSave}
                onDownload={handleDownload}
                onReport={() => setShowReportModal(true)}
                onCreateClip={handleCreateClip}
                onAddToPlaylist={handleAddToPlaylist}
                onRemix={handleRemix}
              />

              {localVideo.user && (
                <CreatorInfo
                  creator={localVideo.user}
                  isSubscribed={isSubscribed}
                  subscriberCount={localVideo.user.subscriberCount || 0}
                  hasNotifications={hasNotifications}
                  onSubscribe={handleSubscribe}
                  onToggleNotifications={handleToggleNotifications}
                  onTip={() => setShowTipModal(true)}
                />
              )}

              <VideoInfo
                title={localVideo.title}
                description={localVideo.description || 'Aucune description disponible.'}
                viewCount={localVideo.viewCount}
                uploadDate={localVideo.createdAt}
                hashtags={(localVideo as any).hashtags || []}
                transcript={(localVideo as any).transcript || ''}
              />

              <AdUnit slot="video-middle" format="rectangle" responsive />

              <CommentsSection
                comments={comments}
                commentCount={localVideo.commentCount}
                currentUserId={user?.id}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onReportComment={handleReportComment}
                onDeleteComment={handleDeleteComment}
              />
            </div>
          </div>

          <div className="space-y-4">
            <AdUnit slot="video-sidebar" format="vertical" responsive />

            <RelatedVideos
              videos={relatedVideos}
              onVideoClick={onVideoClick}
            />
          </div>
        </div>
      </div>

      {showTipModal && localVideo.user && (
        <TipModal
          creator={localVideo.user}
          videoId={localVideo.id}
          onClose={() => setShowTipModal(false)}
          onSuccess={() => {
            setShowTipModal(false);
            alert('Merci pour votre soutien!');
          }}
        />
      )}

      {showReportModal && (
        <ReportContentModal
          contentType="video"
          contentId={localVideo.id}
          onClose={() => setShowReportModal(false)}
          onSubmit={(reason, description) => {
            console.log('Report:', reason, description);
            setShowReportModal(false);
            alert('Signalement envoyé');
          }}
        />
      )}
    </div>
  );
}
