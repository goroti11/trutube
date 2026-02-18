import { create } from 'zustand';

export interface VideoData {
  id: string;
  title: string;
  creator_id: string;
  creator_name: string;
  creator_avatar: string;
  video_url: string;
  thumbnail_url: string;
  view_count: number;
  like_count: number;
  created_at: string;
  duration: number;
}

interface PlayerState {
  // Current video playing
  currentVideo: VideoData | null;
  isPlaying: boolean;
  isMiniPlayer: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  quality: string;

  // Settings
  isLooping: boolean;
  isAmbientMode: boolean;
  isStableVolume: boolean;
  isScreenLocked: boolean;
  subtitlesEnabled: boolean;
  selectedSubtitleLanguage: string | null;

  // UI State
  showControls: boolean;
  isFullscreen: boolean;
  isBuffering: boolean;

  // Actions
  setCurrentVideo: (video: VideoData | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsMiniPlayer: (mini: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setQuality: (quality: string) => void;

  setIsLooping: (looping: boolean) => void;
  setIsAmbientMode: (ambient: boolean) => void;
  setIsStableVolume: (stable: boolean) => void;
  setIsScreenLocked: (locked: boolean) => void;
  setSubtitlesEnabled: (enabled: boolean) => void;
  setSelectedSubtitleLanguage: (lang: string | null) => void;

  setShowControls: (show: boolean) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setIsBuffering: (buffering: boolean) => void;

  togglePlayPause: () => void;
  seek: (seconds: number) => void;
  closePlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Initial state
  currentVideo: null,
  isPlaying: false,
  isMiniPlayer: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  quality: 'auto',

  isLooping: false,
  isAmbientMode: false,
  isStableVolume: false,
  isScreenLocked: false,
  subtitlesEnabled: false,
  selectedSubtitleLanguage: null,

  showControls: true,
  isFullscreen: false,
  isBuffering: false,

  // Setters
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsMiniPlayer: (mini) => set({ isMiniPlayer: mini }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setQuality: (quality) => set({ quality }),

  setIsLooping: (looping) => set({ isLooping: looping }),
  setIsAmbientMode: (ambient) => set({ isAmbientMode: ambient }),
  setIsStableVolume: (stable) => set({ isStableVolume: stable }),
  setIsScreenLocked: (locked) => set({ isScreenLocked: locked }),
  setSubtitlesEnabled: (enabled) => set({ subtitlesEnabled: enabled }),
  setSelectedSubtitleLanguage: (lang) => set({ selectedSubtitleLanguage: lang }),

  setShowControls: (show) => set({ showControls: show }),
  setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  setIsBuffering: (buffering) => set({ isBuffering: buffering }),

  // Actions
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

  seek: (seconds) => {
    const state = get();
    const newTime = Math.max(0, Math.min(state.duration, state.currentTime + seconds));
    set({ currentTime: newTime });
  },

  closePlayer: () => set({
    currentVideo: null,
    isPlaying: false,
    isMiniPlayer: false,
    currentTime: 0,
    duration: 0,
    showControls: true,
    isFullscreen: false
  })
}));
