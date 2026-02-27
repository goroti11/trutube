import { supabase } from '../lib/supabase';

export interface ReplayStatus {
  video_id: string;
  cloudflare_uid: string | null;
  playback_hls_url: string | null;
  is_replay: boolean;
  source_live_id: string | null;
  dub_status: 'none' | 'queued' | 'processing' | 'ready' | 'failed';
  transcripts: TranscriptStatus[];
  translations: TranslationStatus[];
  audio_tracks: AudioTrackStatus[];
  subtitles: SubtitleStatus[];
  pending_jobs: number;
  failed_jobs: number;
}

export interface TranscriptStatus {
  id: string;
  language_original: string;
  job_status: string;
  error_message: string | null;
}

export interface TranslationStatus {
  id: string;
  target_language: string;
  job_status: string;
  error_message: string | null;
}

export interface AudioTrackStatus {
  id: string;
  language_code: string;
  voice_type: string;
  cloudflare_track_id: string | null;
  job_status: string;
  error_message: string | null;
}

export interface SubtitleStatus {
  id: string;
  language_code: string;
  vtt_url: string;
  cloudflare_caption_id: string | null;
  job_status: string;
  error_message: string | null;
}

export interface MediaJob {
  id: string;
  job_type: string;
  video_id: string;
  live_id: string | null;
  payload: Record<string, any>;
  job_status: string;
  attempts: number;
  last_error: string | null;
  created_at: string;
}

export interface DubOptions {
  enabled: boolean;
  languages: string[];
  voice_type?: 'standard' | 'premium' | 'clone';
}

export const replayDubbingService = {
  async endLive(liveId: string): Promise<{ success: boolean; video_id?: string; error?: string }> {
    const { data, error } = await supabase.functions.invoke('live-end', {
      body: { live_id: liveId },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  },

  async getReplayStatus(videoId: string): Promise<ReplayStatus | null> {
    const [videoResult, transcriptsResult, translationsResult, audioTracksResult, subtitlesResult, jobsResult] = await Promise.all([
      supabase
        .from('videos')
        .select('id, cloudflare_uid, playback_hls_url, is_replay, source_live_id, dub_status')
        .eq('id', videoId)
        .maybeSingle(),
      supabase
        .from('video_transcripts')
        .select('id, language_original, job_status, error_message')
        .eq('video_id', videoId),
      supabase
        .from('video_translations')
        .select('id, target_language, job_status, error_message')
        .eq('video_id', videoId),
      supabase
        .from('video_audio_tracks')
        .select('id, language_code, voice_type, cloudflare_track_id, job_status, error_message')
        .eq('video_id', videoId),
      supabase
        .from('video_subtitles')
        .select('id, language_code, vtt_url, cloudflare_caption_id, job_status, error_message')
        .eq('video_id', videoId),
      supabase
        .from('media_jobs')
        .select('job_status')
        .eq('video_id', videoId),
    ]);

    if (videoResult.error || !videoResult.data) {
      return null;
    }

    const pendingJobs = jobsResult.data?.filter(j => j.job_status === 'queued' || j.job_status === 'processing').length || 0;
    const failedJobs = jobsResult.data?.filter(j => j.job_status === 'failed').length || 0;

    return {
      video_id: videoResult.data.id,
      cloudflare_uid: videoResult.data.cloudflare_uid,
      playback_hls_url: videoResult.data.playback_hls_url,
      is_replay: videoResult.data.is_replay,
      source_live_id: videoResult.data.source_live_id,
      dub_status: videoResult.data.dub_status,
      transcripts: transcriptsResult.data || [],
      translations: translationsResult.data || [],
      audio_tracks: audioTracksResult.data || [],
      subtitles: subtitlesResult.data || [],
      pending_jobs: pendingJobs,
      failed_jobs: failedJobs,
    };
  },

  async getReplayStatusByLiveId(liveId: string): Promise<ReplayStatus | null> {
    const { data: liveStream, error } = await supabase
      .from('live_streams')
      .select('replay_video_id')
      .eq('id', liveId)
      .maybeSingle();

    if (error || !liveStream?.replay_video_id) {
      return null;
    }

    return this.getReplayStatus(liveStream.replay_video_id);
  },

  async setDubOptions(videoId: string, options: DubOptions): Promise<{ success: boolean; error?: string }> {
    const { data, error } = await supabase.functions.invoke('dub-control', {
      body: {
        video_id: videoId,
        enabled: options.enabled,
        languages: options.languages,
        voice_type: options.voice_type || 'standard',
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  },

  async retryFailedJob(jobId: string): Promise<{ success: boolean; error?: string }> {
    const { data, error } = await supabase.functions.invoke('dub-control', {
      body: {
        action: 'retry_job',
        job_id: jobId,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  },

  async getMediaJobs(videoId: string): Promise<MediaJob[]> {
    const { data, error } = await supabase
      .from('media_jobs')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch media jobs:', error);
      return [];
    }

    return data || [];
  },

  async getAvailableAudioTracks(videoId: string): Promise<AudioTrackStatus[]> {
    const { data, error } = await supabase
      .from('video_audio_tracks')
      .select('*')
      .eq('video_id', videoId)
      .eq('job_status', 'ready');

    if (error) {
      console.error('Failed to fetch audio tracks:', error);
      return [];
    }

    return data || [];
  },

  async getAvailableSubtitles(videoId: string): Promise<SubtitleStatus[]> {
    const { data, error } = await supabase
      .from('video_subtitles')
      .select('*')
      .eq('video_id', videoId)
      .eq('job_status', 'ready');

    if (error) {
      console.error('Failed to fetch subtitles:', error);
      return [];
    }

    return data || [];
  },
};
