import { useEffect, useRef } from 'react';
import { Play, Pause, X } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

interface GlobalMiniPlayerProps {
  onNavigateToPlayer: () => void;
}

export default function GlobalMiniPlayer({ onNavigateToPlayer }: GlobalMiniPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    currentVideo,
    isPlaying,
    isMiniPlayer,
    currentTime,
    volume,
    isMuted,
    playbackRate,
    setIsPlaying,
    setCurrentTime,
    togglePlayPause,
    closePlayer
  } = usePlayerStore();

  // Sync video element
  useEffect(() => {
    if (!videoRef.current || !currentVideo) return;

    const video = videoRef.current;
    video.src = currentVideo.video_url;
    video.currentTime = currentTime;
    video.volume = volume;
    video.muted = isMuted;
    video.playbackRate = playbackRate;

    if (isPlaying) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [currentVideo, currentTime, volume, isMuted, playbackRate, isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  if (!currentVideo || !isMiniPlayer) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-gray-900 rounded-xl shadow-2xl overflow-hidden border-2 border-gray-800 animate-slide-up">
      {/* Video */}
      <div
        className="relative aspect-video bg-black cursor-pointer"
        onClick={onNavigateToPlayer}
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          playsInline
        />

        {/* Play Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Play className="w-12 h-12 text-white" />
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            closePlayer();
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Info Bar */}
      <div className="p-3 flex items-center justify-between bg-gray-900 border-t border-gray-800">
        <div className="flex-1 min-w-0 mr-3">
          <p className="text-sm font-semibold text-white truncate">
            {currentVideo.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {currentVideo.creator_name}
          </p>
        </div>

        <button
          onClick={togglePlayPause}
          className="w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
