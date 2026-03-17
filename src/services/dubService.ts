import { supabase } from '../lib/supabase';

export type DubStatus = 'none' | 'queued' | 'processing' | 'ready' | 'failed';
export type JobStatus = 'queued' | 'processing' | 'ready' | 'failed';
export type VoiceType = 'original' | 'standard' | 'premium' | 'clone';

export interface AudioTrack {
  id: string;
  video_id: string;
  language_code: string;
  voice_type: VoiceType;
  audio_url: string;
  hls_playlist_url?: string;
  cloudflare_track_id: string | null;
  duration_seconds?: number;
  is_default: boolean;
  is_generated: boolean;
  job_status: JobStatus;
  error_message: string | null;
  created_at: string;
}

export interface Subtitle {
  id: string;
  video_id: string;
  language_code: string;
  vtt_url: string;
  srt_url?: string;
  cloudflare_caption_id: string | null;
  auto_generated: boolean;
  reviewed: boolean;
  job_status: JobStatus;
  error_message: string | null;
  created_at: string;
}

export interface VideoTranscript {
  id: string;
  video_id: string;
  language_original: string;
  segments: any[];
  confidence_score: number;
  job_status: JobStatus;
  error_message: string | null;
  created_at: string;
}

export interface VideoTranslation {
  id: string;
  video_id: string;
  transcript_id: string;
  target_language: string;
  translated_segments: any[];
  quality_score: number;
  job_status: JobStatus;
  error_message: string | null;
  created_at: string;
}

export interface DubOptions {
  enabled: boolean;
  languages: string[];
  voice_type?: VoiceType;
}

export interface GlobalSettings {
  id: string;
  creator_id: string;
  auto_subtitles_enabled: boolean;
  auto_dub_enabled: boolean;
  max_auto_languages: number;
  voice_default_type: VoiceType;
  lip_sync_enabled: boolean;
  preferred_languages: string[];
  auto_publish_global: boolean;
  global_mode_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReplayDubStatus {
  video_id: string;
  cloudflare_uid: string | null;
  playback_hls_url: string | null;
  is_replay: boolean;
  source_live_id: string | null;
  dub_status: DubStatus;
  transcripts: VideoTranscript[];
  translations: VideoTranslation[];
  audio_tracks: AudioTrack[];
  subtitles: Subtitle[];
  pending_jobs: number;
  failed_jobs: number;
}

export interface MediaJob {
  id: string;
  job_type: string;
  video_id: string;
  live_id: string | null;
  payload: Record<string, any>;
  job_status: JobStatus;
  attempts: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

class DubService {
  async getDubStatus(videoId: string): Promise<ReplayDubStatus | null> {
    try {
      const [
        videoResult,
        transcriptsResult,
        translationsResult,
        audioTracksResult,
        subtitlesResult,
        jobsResult
      ] = await Promise.all([
        supabase
          .from('videos')
          .select('id, cloudflare_uid, playback_hls_url, is_replay, source_live_id, dub_status')
          .eq('id', videoId)
          .maybeSingle(),
        supabase
          .from('video_transcripts')
          .select('*')
          .eq('video_id', videoId),
        supabase
          .from('video_translations')
          .select('*')
          .eq('video_id', videoId),
        supabase
          .from('video_audio_tracks')
          .select('*')
          .eq('video_id', videoId),
        supabase
          .from('video_subtitles')
          .select('*')
          .eq('video_id', videoId),
        supabase
          .from('media_jobs')
          .select('job_status')
          .eq('video_id', videoId)
      ]);

      if (videoResult.error || !videoResult.data) {
        return null;
      }

      const pendingJobs = jobsResult.data?.filter(
        j => j.job_status === 'queued' || j.job_status === 'processing'
      ).length || 0;

      const failedJobs = jobsResult.data?.filter(
        j => j.job_status === 'failed'
      ).length || 0;

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
        failed_jobs: failedJobs
      };
    } catch (error) {
      console.error('Error fetching dub status:', error);
      return null;
    }
  }

  async enableAutoDub(videoId: string, options: DubOptions): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('dub-control', {
        body: {
          video_id: videoId,
          enabled: options.enabled,
          languages: options.languages,
          voice_type: options.voice_type || 'standard'
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return data || { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async enqueueReplayDub(videoOrLiveId: string, isLiveId: boolean = false): Promise<{ success: boolean; error?: string }> {
    try {
      let videoId = videoOrLiveId;

      if (isLiveId) {
        const { data: liveStream } = await supabase
          .from('live_streams')
          .select('replay_video_id')
          .eq('id', videoOrLiveId)
          .maybeSingle();

        if (!liveStream?.replay_video_id) {
          return { success: false, error: 'Replay video not found' };
        }

        videoId = liveStream.replay_video_id;
      }

      const { error } = await supabase
        .from('media_jobs')
        .insert({
          job_type: 'replay_finalize',
          video_id: videoId,
          job_status: 'queued',
          payload: {}
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async retryDubJob(jobId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('dub-control', {
        body: {
          action: 'retry_job',
          job_id: jobId
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return data || { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAvailableAudioTracks(videoId: string): Promise<AudioTrack[]> {
    try {
      const { data, error } = await supabase
        .from('video_audio_tracks')
        .select('*')
        .eq('video_id', videoId)
        .eq('job_status', 'ready')
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching audio tracks:', error);
      return [];
    }
  }

  async getAvailableSubtitles(videoId: string): Promise<Subtitle[]> {
    try {
      const { data, error } = await supabase
        .from('video_subtitles')
        .select('*')
        .eq('video_id', videoId)
        .eq('job_status', 'ready')
        .order('language_code');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subtitles:', error);
      return [];
    }
  }

  async getGlobalSettings(creatorId: string): Promise<GlobalSettings | null> {
    try {
      const { data, error } = await supabase
        .from('creator_global_settings')
        .select('*')
        .eq('creator_id', creatorId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching global settings:', error);
      return null;
    }
  }

  async updateGlobalSettings(settings: Partial<GlobalSettings> & { creator_id: string }): Promise<GlobalSettings | null> {
    try {
      const { data, error } = await supabase
        .from('creator_global_settings')
        .upsert(settings, { onConflict: 'creator_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating global settings:', error);
      return null;
    }
  }

  async getMediaJobs(videoId: string): Promise<MediaJob[]> {
    try {
      const { data, error } = await supabase
        .from('media_jobs')
        .select('*')
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching media jobs:', error);
      return [];
    }
  }

  async getVoiceConsent(creatorId: string) {
    try {
      const { data, error } = await supabase
        .from('voice_consent')
        .select('*')
        .eq('creator_id', creatorId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching voice consent:', error);
      return null;
    }
  }

  async giveVoiceConsent(creatorId: string, signatureHash: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('voice_consent')
        .upsert({
          creator_id: creatorId,
          consent_given: true,
          consent_date: new Date().toISOString(),
          creator_signature_hash: signatureHash,
          is_encrypted: true,
          exportable: false
        }, { onConflict: 'creator_id' });

      return !error;
    } catch (error) {
      console.error('Error giving voice consent:', error);
      return false;
    }
  }

  async getAvailableLanguages(videoId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('available_languages')
        .eq('id', videoId)
        .single();

      if (error) throw error;
      return data?.available_languages || [];
    } catch (error) {
      console.error('Error fetching available languages:', error);
      return [];
    }
  }

  async endLiveWithReplayDub(liveId: string): Promise<{ success: boolean; video_id?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('live-end', {
        body: { live_id: liveId }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return data || { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const dubService = new DubService();
