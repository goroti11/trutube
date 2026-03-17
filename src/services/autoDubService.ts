import { dubService, AudioTrack, Subtitle, GlobalSettings } from './dubService';

export type { AudioTrack, Subtitle, GlobalSettings };

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
  confidence?: number;
}

export const autoDubService = {
  async getVideoAudioTracks(videoId: string): Promise<AudioTrack[]> {
    return dubService.getAvailableAudioTracks(videoId);
  },

  async getVideoSubtitles(videoId: string): Promise<Subtitle[]> {
    return dubService.getAvailableSubtitles(videoId);
  },

  async getCreatorGlobalSettings(creatorId: string): Promise<GlobalSettings | null> {
    return dubService.getGlobalSettings(creatorId);
  },

  async upsertGlobalSettings(settings: Partial<GlobalSettings> & { creator_id: string }): Promise<GlobalSettings | null> {
    return dubService.updateGlobalSettings(settings);
  },

  async getVoiceConsent(creatorId: string) {
    return dubService.getVoiceConsent(creatorId);
  },

  async giveVoiceConsent(creatorId: string, signatureHash: string): Promise<void> {
    await dubService.giveVoiceConsent(creatorId, signatureHash);
  },

  async enableGlobalMode(creatorId: string, enabled: boolean): Promise<void> {
    await dubService.updateGlobalSettings({
      creator_id: creatorId,
      global_mode_active: enabled
    });
  },

  async getAvailableLanguages(videoId: string): Promise<string[]> {
    return dubService.getAvailableLanguages(videoId);
  },

  async getVideoGlobalStats(videoId: string) {
    const status = await dubService.getDubStatus(videoId);
    if (!status) return null;

    return {
      available_languages: await dubService.getAvailableLanguages(videoId),
      has_multi_audio: status.audio_tracks.length > 1,
      global_badge_enabled: status.dub_status === 'ready'
    };
  }
};
