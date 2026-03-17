import { supabase } from '../lib/supabase';

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface AudioTrack {
  id: string;
  video_id: string;
  language_code: string;
  voice_type: 'original' | 'standard' | 'premium' | 'clone';
  audio_url: string;
  hls_playlist_url?: string;
  duration_seconds?: number;
  is_default: boolean;
  is_generated: boolean;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface Subtitle {
  id: string;
  video_id: string;
  language_code: string;
  vtt_url: string;
  srt_url?: string;
  auto_generated: boolean;
  reviewed: boolean;
}

export interface GlobalSettings {
  id: string;
  creator_id: string;
  auto_subtitles_enabled: boolean;
  auto_dub_enabled: boolean;
  max_auto_languages: number;
  voice_default_type: 'standard' | 'premium' | 'clone';
  lip_sync_enabled: boolean;
  preferred_languages: string[];
  auto_publish_global: boolean;
  global_mode_active: boolean;
}

export const autoDubService = {
  async getVideoAudioTracks(videoId: string): Promise<AudioTrack[]> {
    const { data, error } = await supabase
      .from('video_audio_tracks')
      .select('*')
      .eq('video_id', videoId)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getVideoSubtitles(videoId: string): Promise<Subtitle[]> {
    const { data, error } = await supabase
      .from('video_subtitles')
      .select('*')
      .eq('video_id', videoId);

    if (error) throw error;
    return data || [];
  },

  async getCreatorGlobalSettings(creatorId: string): Promise<GlobalSettings | null> {
    const { data, error } = await supabase
      .from('creator_global_settings')
      .select('*')
      .eq('creator_id', creatorId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async upsertGlobalSettings(settings: Partial<GlobalSettings> & { creator_id: string }): Promise<GlobalSettings> {
    const { data, error } = await supabase
      .from('creator_global_settings')
      .upsert(settings, { onConflict: 'creator_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async requestVideoTranscription(videoId: string, languageOriginal: string): Promise<void> {
    const { error } = await supabase
      .from('video_transcripts')
      .insert({
        video_id: videoId,
        language_original: languageOriginal,
        segments: [],
        confidence_score: 0
      });

    if (error) throw error;
  },

  async requestVideoTranslation(videoId: string, transcriptId: string, targetLanguage: string): Promise<void> {
    const { error } = await supabase
      .from('video_translations')
      .insert({
        video_id: videoId,
        transcript_id: transcriptId,
        target_language: targetLanguage,
        translated_segments: [],
        quality_score: 0
      });

    if (error) throw error;
  },

  async requestAudioGeneration(
    videoId: string,
    languageCode: string,
    voiceType: 'standard' | 'premium' | 'clone'
  ): Promise<void> {
    const { error } = await supabase
      .from('video_audio_tracks')
      .insert({
        video_id: videoId,
        language_code: languageCode,
        voice_type: voiceType,
        audio_url: '',
        processing_status: 'pending'
      });

    if (error) throw error;
  },

  async calculateGlobalScore(videoId: string): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_global_reach_score', {
      p_video_id: videoId
    });

    if (error) throw error;
    return data || 0;
  },

  async getVoiceConsent(creatorId: string) {
    const { data, error } = await supabase
      .from('voice_consent')
      .select('*')
      .eq('creator_id', creatorId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async giveVoiceConsent(creatorId: string, signatureHash: string): Promise<void> {
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

    if (error) throw error;
  },

  async enableGlobalMode(creatorId: string, enabled: boolean): Promise<void> {
    await this.upsertGlobalSettings({
      creator_id: creatorId,
      global_mode_active: enabled
    });
  },

  async getAvailableLanguages(videoId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('available_languages')
      .eq('id', videoId)
      .single();

    if (error) throw error;
    return data?.available_languages || [];
  },

  async getVideoGlobalStats(videoId: string) {
    const { data, error } = await supabase
      .from('videos')
      .select('global_reach_score, available_languages, has_multi_audio, global_badge_enabled')
      .eq('id', videoId)
      .single();

    if (error) throw error;
    return data;
  }
};
