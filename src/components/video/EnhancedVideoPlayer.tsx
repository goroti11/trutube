import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Settings,
  SkipBack, SkipForward, Loader
} from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

interface EnhancedVideoPlayerProps {
  onSettingsClick?: () => void;
  className?: string;
}

export default function EnhancedVideoPlayer({
  onSettingsClick,
  className = ''
}: EnhancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    currentVideo,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isLooping,
    isScreenLocked,
    showControls,
    isBuffering,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    setIsMuted,
    setShowControls,
    setIsFullscreen,
    setIsBuffering,
    togglePlayPause,
    seek
  } = usePlayerStore();

  // Initialize video player
  useEffect(() => {
    if (!currentVideo || !videoRef.current) return;

    const video = videoRef.current;
    const videoUrl = currentVideo.video_url;

    // Check if HLS
    if (videoUrl.includes('.m3u8') || videoUrl.includes('/hls/')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });

        hlsRef.current = hls;
        hls.loadSource(videoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsBuffering(false);
          if (isPlaying) {
            video.play().catch(() => setIsPlaying(false));
          }
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                console.error('HLS fatal error:', data);
                break;
            }
          }
        });

        return () => {
          hls.destroy();
          hlsRef.current = null;
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = videoUrl;
        setIsBuffering(false);
      }
    } else {
      // Direct MP4
      video.src = videoUrl;
      setIsBuffering(false);
    }
  }, [currentVideo]);

  // Play/Pause control
  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Volume control
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
  }, [volume]);

  // Mute control
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
  }, [isMuted]);

  // Playback rate
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // Loop
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.loop = isLooping;
  }, [isLooping]);

  // Time update
  useEffect(() => {
    if (!videoRef.current) return;
    if (Math.abs(videoRef.current.currentTime - currentTime) > 1) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handlePlaying = () => setIsBuffering(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // Controls auto-hide
  useEffect(() => {
    if (showControls && isPlaying && !isScreenLocked) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying, isScreenLocked]);

  // Fullscreen
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mouse move to show controls
  const handleMouseMove = () => {
    if (!isScreenLocked) {
      setShowControls(true);
    }
  };

  // Click to toggle controls
  const handleVideoClick = (e: React.MouseEvent) => {
    if (isScreenLocked) return;

    const rect = videoRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const width = rect.width;

    // Double click for seek
    if (e.detail === 2) {
      if (x < width / 3) {
        seek(-10);
      } else if (x > (2 * width) / 3) {
        seek(10);
      }
    } else {
      togglePlayPause();
    }
  };

  // Seek bar
  const handleSeekBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  // Volume bar
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentVideo) {
    return (
      <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Aucune vidéo sélectionnée</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !isScreenLocked && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onClick={handleVideoClick}
        playsInline
        poster={currentVideo.thumbnail_url}
      />

      {/* Buffering Loader */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader className="w-12 h-12 animate-spin text-white" />
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ pointerEvents: showControls || !isPlaying ? 'auto' : 'none' }}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg line-clamp-1">
            {currentVideo.title}
          </h2>
        </div>

        {/* Center Play/Pause */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!isPlaying && !isBuffering && (
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-10 h-10 text-black ml-1" />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Seek Bar */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-mono">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeekBarChange}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
            />
            <span className="text-white text-sm font-mono">
              {formatTime(duration)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Skip Back */}
              <button
                onClick={() => seek(-10)}
                className="text-white hover:text-primary-400 transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => seek(10)}
                className="text-white hover:text-primary-400 transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-primary-400 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Settings */}
              <button
                onClick={onSettingsClick}
                className="text-white hover:text-primary-400 transition-colors"
              >
                <Settings className="w-6 h-6" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary-400 transition-colors"
              >
                <Maximize className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Lock Indicator */}
      {isScreenLocked && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 px-4 py-2 rounded-lg">
          <p className="text-white text-sm">Écran verrouillé</p>
        </div>
      )}
    </div>
  );
}
