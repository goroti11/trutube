import { useState } from 'react';
import { X, ChevronRight, Check, Lock, MoreHorizontal } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

interface VideoSettingsSheetProps {
  onClose: () => void;
  onMoreClick: () => void;
}

type View = 'main' | 'quality' | 'speed' | 'subtitles';

const QUALITY_OPTIONS = ['Auto', '2160p', '1080p', '720p', '480p', '360p', '240p'];
const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SUBTITLE_LANGUAGES = [
  { code: 'off', name: 'Désactivés' },
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' }
];

export default function VideoSettingsSheet({ onClose, onMoreClick }: VideoSettingsSheetProps) {
  const [currentView, setCurrentView] = useState<View>('main');

  const {
    quality,
    playbackRate,
    isScreenLocked,
    subtitlesEnabled,
    selectedSubtitleLanguage,
    setQuality,
    setPlaybackRate,
    setIsScreenLocked,
    setSubtitlesEnabled,
    setSelectedSubtitleLanguage
  } = usePlayerStore();

  const handleQualitySelect = (q: string) => {
    setQuality(q.toLowerCase());
    setCurrentView('main');
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackRate(speed);
    setCurrentView('main');
  };

  const handleSubtitleSelect = (code: string) => {
    if (code === 'off') {
      setSubtitlesEnabled(false);
      setSelectedSubtitleLanguage(null);
    } else {
      setSubtitlesEnabled(true);
      setSelectedSubtitleLanguage(code);
    }
    setCurrentView('main');
  };

  const getCurrentQualityLabel = () => {
    return quality.charAt(0).toUpperCase() + quality.slice(1);
  };

  const getCurrentSubtitleLabel = () => {
    if (!subtitlesEnabled) return 'Désactivés';
    const lang = SUBTITLE_LANGUAGES.find(l => l.code === selectedSubtitleLanguage);
    return lang ? lang.name : 'Désactivés';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-gray-900 w-full max-w-md rounded-t-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold">
            {currentView === 'main' && 'Paramètres'}
            {currentView === 'quality' && 'Qualité'}
            {currentView === 'speed' && 'Vitesse de lecture'}
            {currentView === 'subtitles' && 'Sous-titres'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {currentView === 'main' && (
            <div className="divide-y divide-gray-800">
              {/* Quality */}
              <button
                onClick={() => setCurrentView('quality')}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <span className="text-gray-300">Qualité</span>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{getCurrentQualityLabel()}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Speed */}
              <button
                onClick={() => setCurrentView('speed')}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <span className="text-gray-300">Vitesse de lecture</span>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{playbackRate === 1 ? 'Normale' : `${playbackRate}x`}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Subtitles */}
              <button
                onClick={() => setCurrentView('subtitles')}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <span className="text-gray-300">Sous-titres</span>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{getCurrentSubtitleLabel()}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Screen Lock */}
              <button
                onClick={() => setIsScreenLocked(!isScreenLocked)}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Verrouiller l'écran</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  isScreenLocked ? 'bg-primary-500' : 'bg-gray-700'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                    isScreenLocked ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </button>

              {/* More Options */}
              <button
                onClick={onMoreClick}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Plus</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}

          {currentView === 'quality' && (
            <div className="divide-y divide-gray-800">
              {QUALITY_OPTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQualitySelect(q)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                >
                  <span className={`${
                    quality === q.toLowerCase() ? 'text-primary-400' : 'text-gray-300'
                  }`}>
                    {q}
                  </span>
                  {quality === q.toLowerCase() && (
                    <Check className="w-5 h-5 text-primary-400" />
                  )}
                </button>
              ))}
            </div>
          )}

          {currentView === 'speed' && (
            <div className="divide-y divide-gray-800">
              {SPEED_OPTIONS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedSelect(speed)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                >
                  <span className={`${
                    playbackRate === speed ? 'text-primary-400' : 'text-gray-300'
                  }`}>
                    {speed === 1 ? 'Normale' : `${speed}x`}
                  </span>
                  {playbackRate === speed && (
                    <Check className="w-5 h-5 text-primary-400" />
                  )}
                </button>
              ))}
            </div>
          )}

          {currentView === 'subtitles' && (
            <div className="divide-y divide-gray-800">
              {SUBTITLE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSubtitleSelect(lang.code)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                >
                  <span className={`${
                    (lang.code === 'off' && !subtitlesEnabled) ||
                    (lang.code === selectedSubtitleLanguage && subtitlesEnabled)
                      ? 'text-primary-400'
                      : 'text-gray-300'
                  }`}>
                    {lang.name}
                  </span>
                  {((lang.code === 'off' && !subtitlesEnabled) ||
                    (lang.code === selectedSubtitleLanguage && subtitlesEnabled)) && (
                    <Check className="w-5 h-5 text-primary-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
