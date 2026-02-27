import { useState, useEffect } from 'react';
import { Globe, Play, AlertCircle, CheckCircle, Loader, RefreshCw } from 'lucide-react';
import { replayDubbingService, ReplayStatus } from '../../../services/replayDubbingService';

interface ReplayDubPanelProps {
  liveId?: string;
  videoId?: string;
}

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
];

export default function ReplayDubPanel({ liveId, videoId }: ReplayDubPanelProps) {
  const [status, setStatus] = useState<ReplayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [dubEnabled, setDubEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 10000);
    return () => clearInterval(interval);
  }, [liveId, videoId]);

  const loadStatus = async () => {
    try {
      setLoading(true);
      let replayStatus: ReplayStatus | null = null;

      if (videoId) {
        replayStatus = await replayDubbingService.getReplayStatus(videoId);
      } else if (liveId) {
        replayStatus = await replayDubbingService.getReplayStatusByLiveId(liveId);
      }

      if (replayStatus) {
        setStatus(replayStatus);
        setDubEnabled(replayStatus.dub_status !== 'none');
        setSelectedLanguages(replayStatus.audio_tracks.map(t => t.language_code));
      }
    } catch (error) {
      console.error('Failed to load replay status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!status) return;

    try {
      setSaving(true);
      const result = await replayDubbingService.setDubOptions(status.video_id, {
        enabled: dubEnabled,
        languages: selectedLanguages,
        voice_type: 'standard',
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Dubbing settings saved' });
        setTimeout(() => setMessage(null), 3000);
        await loadStatus();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      const result = await replayDubbingService.retryFailedJob(jobId);
      if (result.success) {
        setMessage({ type: 'success', text: 'Job requeued' });
        await loadStatus();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to retry' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to retry job' });
    }
  };

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    );
  };

  if (loading && !status) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-center">
          <Loader className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="text-center text-gray-400">
          No replay available yet. End the live stream to create a replay.
        </div>
      </div>
    );
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'ready': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'queued': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Loader className="w-4 h-4 animate-spin" />;
      case 'queued': return <Loader className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-red-500" />
          <div>
            <h3 className="text-xl font-bold text-white">Replay & Dubbing</h3>
            <p className="text-sm text-gray-400">Multi-language audio and subtitles</p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <div className="text-white font-medium">Replay Status</div>
              <div className="text-sm text-gray-400 mt-1">
                {status.cloudflare_uid ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Replay ready
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-yellow-400" />
                    Processing replay...
                  </span>
                )}
              </div>
            </div>
            {status.playback_hls_url && (
              <a
                href={`#watch?v=${status.video_id}`}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Play className="w-4 h-4" />
                Watch Replay
              </a>
            )}
          </div>

          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-medium">Enable Auto-Dubbing</div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dubEnabled}
                  onChange={(e) => setDubEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {dubEnabled && (
              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-2">Select languages:</div>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                        selectedLanguages.includes(lang.code)
                          ? 'bg-red-600 border-red-500 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-650'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !status.cloudflare_uid}
              className="mt-4 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {(status.pending_jobs > 0 || status.failed_jobs > 0) && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-white font-medium mb-3">Processing Status</div>
              <div className="space-y-2 text-sm">
                {status.pending_jobs > 0 && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Loader className="w-4 h-4 animate-spin" />
                    {status.pending_jobs} job{status.pending_jobs !== 1 ? 's' : ''} in queue
                  </div>
                )}
                {status.failed_jobs > 0 && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {status.failed_jobs} failed job{status.failed_jobs !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )}

          {status.audio_tracks.length > 0 && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-white font-medium mb-3">Audio Tracks</div>
              <div className="space-y-2">
                {status.audio_tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-2 bg-gray-700 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(track.job_status)}>
                        {getStatusIcon(track.job_status)}
                      </span>
                      <span className="text-sm text-white">{track.language_code.toUpperCase()}</span>
                      <span className="text-xs text-gray-400">({track.voice_type})</span>
                    </div>
                    {track.job_status === 'failed' && track.error_message && (
                      <button
                        onClick={() => handleRetryJob(track.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {status.subtitles.length > 0 && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-white font-medium mb-3">Subtitles</div>
              <div className="space-y-2">
                {status.subtitles.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2 bg-gray-700 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className={getStatusColor(sub.job_status)}>
                        {getStatusIcon(sub.job_status)}
                      </span>
                      <span className="text-sm text-white">{sub.language_code.toUpperCase()}</span>
                    </div>
                    {sub.job_status === 'ready' && (
                      <span className="text-xs text-green-400">Ready</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
