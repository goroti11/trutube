/*
  # GOROTI AUTO DUB SYSTEM - Multi-Language Video System

  1. New Tables
    - `video_transcripts` - Original video transcriptions with timestamps
    - `video_translations` - Translated text segments by language
    - `video_audio_tracks` - Multi-audio tracks per video (HLS/DASH)
    - `video_subtitles` - Multi-language subtitle files
    - `creator_global_settings` - Creator preferences for auto-dub
    - `voice_consent` - Voice cloning consent and model storage

  2. Features
    - Automatic transcription (STT)
    - AI translation to multiple languages
    - Text-to-speech audio generation
    - Multi-audio HLS streaming support
    - Voice cloning with consent
    - Global reach scoring

  3. Security
    - RLS enabled on all tables
    - Voice models encrypted and non-exportable
    - Consent verification required for voice cloning
*/

-- Video transcripts (STT results)
CREATE TABLE IF NOT EXISTS video_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  language_original text NOT NULL,
  segments jsonb NOT NULL,
  confidence_score decimal(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  processing_time_seconds int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_video_transcripts_video_id ON video_transcripts(video_id);
CREATE INDEX IF NOT EXISTS idx_video_transcripts_language ON video_transcripts(language_original);

-- Video translations
CREATE TABLE IF NOT EXISTS video_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  transcript_id uuid REFERENCES video_transcripts(id) ON DELETE CASCADE NOT NULL,
  target_language text NOT NULL,
  translated_segments jsonb NOT NULL,
  quality_score decimal(3,2) CHECK (quality_score >= 0 AND quality_score <= 1),
  auto_generated boolean DEFAULT true,
  reviewed boolean DEFAULT false,
  cost_credits decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(video_id, target_language)
);

CREATE INDEX IF NOT EXISTS idx_video_translations_video_id ON video_translations(video_id);
CREATE INDEX IF NOT EXISTS idx_video_translations_language ON video_translations(target_language);
CREATE INDEX IF NOT EXISTS idx_video_translations_transcript_id ON video_translations(transcript_id);

-- Video audio tracks (multi-audio HLS/DASH)
CREATE TABLE IF NOT EXISTS video_audio_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  language_code text NOT NULL,
  voice_type text CHECK (voice_type IN ('original', 'standard', 'premium', 'clone')) DEFAULT 'standard',
  audio_url text NOT NULL,
  hls_playlist_url text,
  duration_seconds int,
  is_default boolean DEFAULT false,
  is_generated boolean DEFAULT true,
  processing_status text CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  cost_credits decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(video_id, language_code, voice_type)
);

CREATE INDEX IF NOT EXISTS idx_audio_tracks_video_id ON video_audio_tracks(video_id);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_language ON video_audio_tracks(language_code);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_status ON video_audio_tracks(processing_status);

-- Video subtitles
CREATE TABLE IF NOT EXISTS video_subtitles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  language_code text NOT NULL,
  vtt_url text NOT NULL,
  srt_url text,
  auto_generated boolean DEFAULT true,
  reviewed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(video_id, language_code)
);

CREATE INDEX IF NOT EXISTS idx_video_subtitles_video_id ON video_subtitles(video_id);
CREATE INDEX IF NOT EXISTS idx_video_subtitles_language ON video_subtitles(language_code);

-- Creator global settings
CREATE TABLE IF NOT EXISTS creator_global_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  auto_subtitles_enabled boolean DEFAULT true,
  auto_dub_enabled boolean DEFAULT false,
  max_auto_languages int DEFAULT 2 CHECK (max_auto_languages >= 0 AND max_auto_languages <= 50),
  voice_default_type text CHECK (voice_default_type IN ('standard', 'premium', 'clone')) DEFAULT 'standard',
  lip_sync_enabled boolean DEFAULT false,
  preferred_languages text[] DEFAULT ARRAY['en', 'fr'],
  auto_publish_global boolean DEFAULT false,
  global_mode_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_global_settings_creator_id ON creator_global_settings(creator_id);

-- Voice consent and model storage
CREATE TABLE IF NOT EXISTS voice_consent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  consent_given boolean DEFAULT false,
  consent_date timestamptz,
  creator_signature_hash text,
  voice_model_id text UNIQUE,
  voice_model_url text,
  voice_samples_count int DEFAULT 0,
  is_encrypted boolean DEFAULT true,
  exportable boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voice_consent_creator_id ON voice_consent(creator_id);
CREATE INDEX IF NOT EXISTS idx_voice_consent_model_id ON voice_consent(voice_model_id);

-- Add global reach score to videos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'global_reach_score'
  ) THEN
    ALTER TABLE videos ADD COLUMN global_reach_score decimal(5,2) DEFAULT 0 CHECK (global_reach_score >= 0 AND global_reach_score <= 100);
    ALTER TABLE videos ADD COLUMN available_languages text[] DEFAULT ARRAY[]::text[];
    ALTER TABLE videos ADD COLUMN has_multi_audio boolean DEFAULT false;
    ALTER TABLE videos ADD COLUMN global_badge_enabled boolean DEFAULT false;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_videos_global_score ON videos(global_reach_score DESC);
CREATE INDEX IF NOT EXISTS idx_videos_multi_audio ON videos(has_multi_audio) WHERE has_multi_audio = true;

-- Enable RLS
ALTER TABLE video_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_subtitles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_consent ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_transcripts
CREATE POLICY "Anyone can view transcripts of published videos"
  ON video_transcripts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_transcripts.video_id
      AND videos.processing_status = 'completed'
    )
  );

CREATE POLICY "Creators can manage their video transcripts"
  ON video_transcripts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_transcripts.video_id
      AND videos.creator_id = auth.uid()
    )
  );

-- RLS Policies for video_translations
CREATE POLICY "Anyone can view translations of published videos"
  ON video_translations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_translations.video_id
      AND videos.processing_status = 'completed'
    )
  );

CREATE POLICY "Creators can manage their video translations"
  ON video_translations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_translations.video_id
      AND videos.creator_id = auth.uid()
    )
  );

-- RLS Policies for video_audio_tracks
CREATE POLICY "Anyone can view audio tracks of published videos"
  ON video_audio_tracks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_audio_tracks.video_id
      AND videos.processing_status = 'completed'
    )
  );

CREATE POLICY "Creators can manage their video audio tracks"
  ON video_audio_tracks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_audio_tracks.video_id
      AND videos.creator_id = auth.uid()
    )
  );

-- RLS Policies for video_subtitles
CREATE POLICY "Anyone can view subtitles of published videos"
  ON video_subtitles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_subtitles.video_id
      AND videos.processing_status = 'completed'
    )
  );

CREATE POLICY "Creators can manage their video subtitles"
  ON video_subtitles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_subtitles.video_id
      AND videos.creator_id = auth.uid()
    )
  );

-- RLS Policies for creator_global_settings
CREATE POLICY "Creators can view own global settings"
  ON creator_global_settings FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can update own global settings"
  ON creator_global_settings FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can insert own global settings"
  ON creator_global_settings FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

-- RLS Policies for voice_consent
CREATE POLICY "Creators can view own voice consent"
  ON voice_consent FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can manage own voice consent"
  ON voice_consent FOR ALL
  TO authenticated
  USING (creator_id = auth.uid());

-- Function to calculate global reach score
CREATE OR REPLACE FUNCTION calculate_global_reach_score(p_video_id uuid)
RETURNS decimal AS $$
DECLARE
  v_score decimal := 0;
  v_lang_count int;
  v_audio_tracks_count int;
  v_has_premium_voice boolean;
BEGIN
  SELECT COUNT(DISTINCT language_code) INTO v_lang_count
  FROM video_subtitles
  WHERE video_id = p_video_id;

  SELECT COUNT(*), MAX(CASE WHEN voice_type IN ('premium', 'clone') THEN true ELSE false END)
  INTO v_audio_tracks_count, v_has_premium_voice
  FROM video_audio_tracks
  WHERE video_id = p_video_id
  AND processing_status = 'completed';

  v_score := (v_lang_count * 5) + (v_audio_tracks_count * 10);
  IF v_has_premium_voice THEN
    v_score := v_score + 20;
  END IF;

  v_score := LEAST(v_score, 100);

  UPDATE videos
  SET global_reach_score = v_score,
      available_languages = ARRAY(
        SELECT DISTINCT language_code
        FROM video_audio_tracks
        WHERE video_id = p_video_id
        AND processing_status = 'completed'
      ),
      has_multi_audio = (v_audio_tracks_count > 1),
      global_badge_enabled = (v_audio_tracks_count >= 3)
  WHERE id = p_video_id;

  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Trigger to update global score when audio tracks change
CREATE OR REPLACE FUNCTION update_global_score_trigger()
RETURNS trigger AS $$
BEGIN
  PERFORM calculate_global_reach_score(NEW.video_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audio_tracks_global_score_trigger
  AFTER INSERT OR UPDATE ON video_audio_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_global_score_trigger();