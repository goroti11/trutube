import { dubService, ReplayDubStatus, MediaJob, AudioTrack, Subtitle, DubOptions } from './dubService';

export type { ReplayDubStatus, MediaJob, AudioTrack, Subtitle, DubOptions };

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

export interface AudioTrackStatus extends AudioTrack {}
export interface SubtitleStatus extends Subtitle {}

export const replayDubbingService = {
  async endLive(liveId: string): Promise<{ success: boolean; video_id?: string; error?: string }> {
    return dubService.endLiveWithReplayDub(liveId);
  },

  async getReplayStatus(videoId: string): Promise<ReplayDubStatus | null> {
    return dubService.getDubStatus(videoId);
  },

  async getReplayStatusByLiveId(liveId: string): Promise<ReplayDubStatus | null> {
    const status = await dubService.getDubStatus(liveId);
    return status;
  },

  async setDubOptions(videoId: string, options: DubOptions): Promise<{ success: boolean; error?: string }> {
    return dubService.enableAutoDub(videoId, options);
  },

  async retryFailedJob(jobId: string): Promise<{ success: boolean; error?: string }> {
    return dubService.retryDubJob(jobId);
  },

  async getMediaJobs(videoId: string): Promise<MediaJob[]> {
    return dubService.getMediaJobs(videoId);
  },

  async getAvailableAudioTracks(videoId: string): Promise<AudioTrackStatus[]> {
    return dubService.getAvailableAudioTracks(videoId);
  },

  async getAvailableSubtitles(videoId: string): Promise<SubtitleStatus[]> {
    return dubService.getAvailableSubtitles(videoId);
  }
};
