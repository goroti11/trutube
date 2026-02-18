import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  Repeat,
  Lock,
  Unlock
} from 'lucide-react';
import VideoSettings from './VideoSettings';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export default function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title: _title,
  onTimeUpdate
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [loop, setLoop] = useState(false);
  const [ambientMode, setAmbientMode] = useState(false);

  let controlsTimeout: NodeJS.Timeout;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate]);

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseMove = () => {
    if (isLocked) return;

    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSettingsChange = (setting: string, value: any) => {
    switch (setting) {
      case 'playbackRate':
        setPlaybackRate(value);
        if (videoRef.current) {
          videoRef.current.playbackRate = value;
        }
        break;
      case 'quality':
        setQuality(value);
        break;
      case 'loop':
        setLoop(value);
        if (videoRef.current) {
          videoRef.current.loop = value;
        }
        break;
      case 'ambientMode':
        setAmbientMode(value);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden group ${
        ambientMode ? 'shadow-2xl shadow-blue-500/50' : ''
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !isLocked && isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        src={videoUrl}
        poster={thumbnailUrl}
        onClick={togglePlay}
      />

      {ambientMode && (
        <div className="absolute inset-0 -z-10 blur-3xl opacity-50">
          <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setIsLocked(!isLocked)}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
          >
            {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white font-medium">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600"
              style={{
                background: `linear-gradient(to right, #dc2626 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%)`
              }}
            />
            <span className="text-sm text-white font-medium">{formatTime(duration)}</span>
          </div>

          {!isLocked && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  onClick={() => skip(-10)}
                  className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => skip(10)}
                  className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                <button
                  onClick={() => handleSettingsChange('loop', !loop)}
                  className={`w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors ${
                    loop ? 'text-red-500' : ''
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300 px-2 py-1 bg-black/50 rounded">
                  {playbackRate}x
                </span>
                <span className="text-xs text-gray-300 px-2 py-1 bg-black/50 rounded uppercase">
                  {quality}
                </span>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSettings && (
        <VideoSettings
          playbackRate={playbackRate}
          quality={quality}
          loop={loop}
          ambientMode={ambientMode}
          onChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
