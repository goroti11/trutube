import { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { autoDubService, AudioTrack, Subtitle } from '../../services/autoDubService';

interface MultiAudioPlayerProps {
  videoId: string;
  onLanguageChange?: (languageCode: string) => void;
}

const LANGUAGE_NAMES: Record<string, string> = {
  'en': 'English',
  'fr': 'Français',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português',
  'ru': 'Русский',
  'ar': 'العربية',
  'zh': '中文',
  'ja': '日本語',
  'ko': '한국어',
  'hi': 'हिन्दी'
};

const VOICE_TYPE_LABELS: Record<string, string> = {
  'original': 'Original',
  'standard': 'Standard AI',
  'premium': 'Premium AI',
  'clone': 'Voice Clone'
};

export default function MultiAudioPlayer({ videoId, onLanguageChange }: MultiAudioPlayerProps) {
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('');
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracks();
  }, [videoId]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const [tracks, subs] = await Promise.all([
        autoDubService.getVideoAudioTracks(videoId),
        autoDubService.getVideoSubtitles(videoId)
      ]);

      const completedTracks = tracks.filter(t => t.processing_status === 'completed');
      setAudioTracks(completedTracks);
      setSubtitles(subs);

      const defaultTrack = completedTracks.find(t => t.is_default);
      if (defaultTrack) {
        setSelectedAudio(defaultTrack.language_code);
      } else if (completedTracks.length > 0) {
        setSelectedAudio(completedTracks[0].language_code);
      }
    } catch (error) {
      console.error('Failed to load audio tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioChange = (languageCode: string) => {
    setSelectedAudio(languageCode);
    setShowAudioMenu(false);
    onLanguageChange?.(languageCode);
  };

  const handleSubtitleChange = (languageCode: string) => {
    setSelectedSubtitle(selectedSubtitle === languageCode ? '' : languageCode);
    setShowSubtitleMenu(false);
  };

  if (loading || audioTracks.length === 0) {
    return null;
  }

  const currentAudio = audioTracks.find(t => t.language_code === selectedAudio);

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setShowAudioMenu(!showAudioMenu)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">
            {LANGUAGE_NAMES[selectedAudio] || selectedAudio}
          </span>
          {currentAudio && currentAudio.voice_type !== 'original' && (
            <span className="text-xs text-red-400">AI</span>
          )}
        </button>

        {showAudioMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowAudioMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white">Audio Language</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {audioTracks.length} language{audioTracks.length !== 1 ? 's' : ''} available
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {audioTracks.map((track) => (
                  <button
                    key={`${track.language_code}-${track.voice_type}`}
                    onClick={() => handleAudioChange(track.language_code)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-700 flex items-center justify-between transition-colors ${
                      selectedAudio === track.language_code ? 'bg-gray-700/50' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {LANGUAGE_NAMES[track.language_code] || track.language_code}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {VOICE_TYPE_LABELS[track.voice_type]}
                        {track.is_default && ' • Default'}
                      </div>
                    </div>
                    {selectedAudio === track.language_code && (
                      <Check className="w-4 h-4 text-red-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {subtitles.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
          >
            <span className="text-xs">CC</span>
            {selectedSubtitle && (
              <span className="hidden sm:inline text-xs">
                {LANGUAGE_NAMES[selectedSubtitle] || selectedSubtitle}
              </span>
            )}
          </button>

          {showSubtitleMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSubtitleMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-white">Subtitles</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <button
                    onClick={() => handleSubtitleChange('')}
                    className={`w-full text-left px-4 py-2.5 hover:bg-gray-700 flex items-center justify-between ${
                      !selectedSubtitle ? 'bg-gray-700/50' : ''
                    }`}
                  >
                    <span className="text-sm text-white">Off</span>
                    {!selectedSubtitle && <Check className="w-4 h-4 text-red-500" />}
                  </button>
                  {subtitles.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubtitleChange(sub.language_code)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-700 flex items-center justify-between ${
                        selectedSubtitle === sub.language_code ? 'bg-gray-700/50' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="text-sm text-white">
                          {LANGUAGE_NAMES[sub.language_code] || sub.language_code}
                        </div>
                        {sub.auto_generated && (
                          <div className="text-xs text-gray-400">Auto-generated</div>
                        )}
                      </div>
                      {selectedSubtitle === sub.language_code && (
                        <Check className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
