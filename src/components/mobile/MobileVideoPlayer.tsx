import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Cast,
  Maximize,
  RotateCcw,
  RotateCw,
  ChevronDown,
  Subtitles
} from 'lucide-react';

interface MobileVideoPlayerProps {
  videoUrl: string;
  title: string;
  onMinimize?: () => void;
  onQualityClick?: () => void;
  onSpeedClick?: () => void;
  onSettingsClick?: () => void;
}

export default function MobileVideoPlayer({
  videoUrl,
  title,
  onMinimize,
  onQualityClick,
  onSpeedClick,
  onSettingsClick
}: MobileVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);
  const [showSeekIndicator, setShowSeekIndicator] = useState<'forward' | 'backward' | null>(null);
  const [startY, setStartY] = useState(0);
  const hideControlsTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (!isDraggingSeek) {
        setProgress((video.currentTime / video.duration) * 100 || 0);
        setCurrentTime(video.currentTime);
      }
    };

    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [isDraggingSeek]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  const handleDoubleTap = (side: 'left' | 'right') => {
    const video = videoRef.current;
    if (!video) return;

    const seekAmount = side === 'left' ? -10 : 10;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seekAmount));

    setShowSeekIndicator(side === 'left' ? 'backward' : 'forward');
    setTimeout(() => setShowSeekIndicator(null), 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientY - startY;
    if (diff > 50) {
      onMinimize?.();
    }
  };

  const resetHideControlsTimer = () => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    setShowControls(true);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.3) {
      handleDoubleTap('left');
    } else if (x > width * 0.7) {
      handleDoubleTap('right');
    } else {
      togglePlay();
    }
    resetHideControlsTimer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    resetHideControlsTimer();
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onClick={handleContainerClick}
      onMouseMove={resetHideControlsTimer}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        playsInline
      />

      {showSeekIndicator && (
        <div className={`absolute top-1/2 ${showSeekIndicator === 'backward' ? 'left-8' : 'right-8'} -translate-y-1/2 bg-black/80 rounded-full p-6 animate-ping`}>
          {showSeekIndicator === 'backward' ? (
            <RotateCcw size={32} className="text-white" />
          ) : (
            <RotateCw size={32} className="text-white" />
          )}
        </div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize?.();
            }}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronDown size={24} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Cast size={20} className="text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSettingsClick?.();
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Settings size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              onMouseDown={() => setIsDraggingSeek(true)}
              onMouseUp={() => setIsDraggingSeek(false)}
              onTouchStart={() => setIsDraggingSeek(true)}
              onTouchEnd={() => setIsDraggingSeek(false)}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:bg-[#D8A0B6]
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-3
                [&::-moz-range-thumb]:h-3
                [&::-moz-range-thumb]:bg-[#D8A0B6]
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, #D8A0B6 0%, #D8A0B6 ${progress}%, #4B5563 ${progress}%, #4B5563 100%)`
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause size={24} className="text-white" fill="white" />
                ) : (
                  <Play size={24} className="text-white" fill="white" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX size={20} className="text-white" />
                ) : (
                  <Volume2 size={20} className="text-white" />
                )}
              </button>
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQualityClick?.();
                }}
                className="px-3 py-1 text-xs bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
              >
                1080p
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Subtitles size={20} className="text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Maximize size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
