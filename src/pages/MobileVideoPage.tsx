import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/mobile/MobileLayout';
import MobileVideoPlayer from '../components/mobile/MobileVideoPlayer';
import FlowPlayer from '../components/video/FlowPlayer';
import QualitySpeedSheet from '../components/mobile/QualitySpeedSheet';
import VideoOptionsSheet from '../components/mobile/VideoOptionsSheet';
import VideoActions from '../components/mobile/VideoActions';
import CommentsPreview from '../components/mobile/CommentsPreview';
import MiniPlayer from '../components/mobile/MiniPlayer';
import { ChevronRight, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { flowService } from '../services/flowService';
import type { FlowInfo } from '../types/flow';

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

  const videoData = {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Comment créer une application mobile moderne avec React',
    creator: 'TechCreator',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop',
    views: 125000,
    uploadDate: 'il y a 2 jours',
    description: 'Dans ce tutoriel complet, nous allons voir comment créer une application mobile moderne avec React Native. Nous aborderons tous les aspects essentiels du développement mobile.',
    likes: 8500,
    dislikes: 123,
    commentCount: 456,
  };

  const mockComments = [
    {
      id: '1',
      author: 'Jean Dupont',
      authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      content: 'Excellent tutoriel ! Très bien expliqué, merci pour ce contenu de qualité.',
      likes: 245,
      timeAgo: 'il y a 1 jour'
    },
    {
      id: '2',
      author: 'Marie Martin',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: "J'ai réussi à suivre toutes les étapes sans problème. Parfait pour les débutants.",
      likes: 189,
      timeAgo: 'il y a 18h'
    },
    {
      id: '3',
      author: 'Thomas Bernard',
      authorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
      content: 'Est-ce que vous pourriez faire une suite sur les animations ?',
      likes: 67,
      timeAgo: 'il y a 12h'
    }
  ];

  const handleToggleFlowMode = () => {
    setIsFlowMode(!isFlowMode);
  };

  const handleExitToFullVideo = (exitVideoId: string, timestamp: number) => {
    setIsFlowMode(false);
  };

  const handleBackToFlow = (nodeId: string) => {
    setLastFlowNodeId(nodeId);
    setIsFlowMode(false);
  };

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
              <span>{videoData.views.toLocaleString()} vues</span>
              <span>•</span>
              <span>{videoData.uploadDate}</span>
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
                src={videoData.creatorAvatar}
                alt={videoData.creator}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-white font-medium">{videoData.creator}</h3>
                <p className="text-sm text-gray-400">1.2M abonnés</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-[#D8A0B6] hover:bg-[#C890A6] rounded-full text-white font-medium transition-colors">
              S'abonner
            </button>
          </div>

          <VideoActions
            likes={videoData.likes}
            dislikes={videoData.dislikes}
            isLiked={isLiked}
            isDisliked={isDisliked}
            isSaved={isSaved}
            onLike={() => setIsLiked(!isLiked)}
            onDislike={() => setIsDisliked(!isDisliked)}
            onShare={() => console.log('Share')}
            onSave={() => setIsSaved(!isSaved)}
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
            comments={mockComments}
            commentCount={videoData.commentCount}
            onViewAll={() => console.log('View all comments')}
          />

          <div className="space-y-3">
            <h3 className="text-white font-semibold">Vidéos suggérées</h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-40 aspect-video bg-gray-800 rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium line-clamp-2 mb-1">
                    Titre de la vidéo suggérée {i}
                  </h4>
                  <p className="text-xs text-gray-400">Nom de la chaîne</p>
                  <p className="text-xs text-gray-400">100K vues • il y a 1 jour</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isMinimized && (
        <MiniPlayer
          videoUrl={videoData.videoUrl}
          title={videoData.title}
          creator={videoData.creator}
          thumbnailUrl={videoData.thumbnailUrl}
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
