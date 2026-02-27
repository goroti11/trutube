/*
  # GOROTI LIVE STREAMS & REPLAY VOD SYSTEM

  1. Clean up existing conflicting tables
  2. Create live_streams table
  3. Create proper video_transcripts, video_translations, video_audio_tracks, video_subtitles
  4. Create media_jobs queue
  5. Extend videos table for Cloudflare Stream

  Pipeline: Live ends → replay_finalize → STT → translate → TTS → attach to Cloudflare Stream
*/

-- Drop existing conflicting tables (created earlier with wrong schema)
DROP TABLE IF EXISTS video_audio_tracks CASCADE;
DROP TABLE IF EXISTS video_translations CASCADE;
DROP TABLE IF EXISTS video_transcripts CASCADE;
DROP TABLE IF EXISTS video_subtitles CASCADE;

-- Create live_streams table if not exists
CREATE TABLE IF NOT EXISTS live_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  stream_key text UNIQUE NOT NULL,
  rtmp_url text,
  playback_url text,
  stream_status text CHECK (stream_status IN ('scheduled', 'live', 'ended', 'archived')) DEFAULT 'scheduled',
  started_at timestamptz,
  ended_at timestamptz,
  viewer_count int DEFAULT 0,
  peak_viewers int DEFAULT 0,
  replay_video_id uuid,
  replay_ready boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_live_streams_creator_id ON live_streams(creator_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_stream_status ON live_streams(stream_status);
CREATE INDEX IF NOT EXISTS idx_live_streams_started_at ON live_streams(started_at DESC) WHERE started_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_live_streams_replay_video ON live_streams(replay_video_id) WHERE replay_video_id IS NOT NULL;

-- Extend videos table for Cloudflare Stream VOD
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'cloudflare_uid'
  ) THEN
    ALTER TABLE videos ADD COLUMN cloudflare_uid text UNIQUE;
    ALTER TABLE videos ADD COLUMN playback_hls_url text;
    ALTER TABLE videos ADD COLUMN is_replay boolean DEFAULT false;
    ALTER TABLE videos ADD COLUMN source_live_id uuid;
    ALTER TABLE videos ADD COLUMN dub_status text CHECK (dub_status IN ('none', 'queued', 'processing', 'ready', 'failed')) DEFAULT 'none';
  END IF;
END $$;

-- Add foreign key after both tables exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'videos_source_live_id_fkey'
  ) THEN
    ALTER TABLE videos ADD CONSTRAINT videos_source_live_id_fkey 
      FOREIGN KEY (source_live_id) REFERENCES live_streams(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'live_streams_replay_video_id_fkey'
  ) THEN
    ALTER TABLE live_streams ADD CONSTRAINT live_streams_replay_video_id_fkey
      FOREIGN KEY (replay_video_id) REFERENCES videos(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_videos_is_replay ON videos(is_replay) WHERE is_replay = true;
CREATE INDEX IF NOT EXISTS idx_videos_source_live ON videos(source_live_id) WHERE source_live_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_videos_cloudflare_uid ON videos(cloudflare_uid) WHERE cloudflare_uid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_videos_dub_status ON videos(dub_status) WHERE dub_status != 'none';

-- Video transcripts (STT results)
CREATE TABLE video_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  language_original text NOT NULL,
  segments jsonb NOT NULL DEFAULT '[]'::jsonb,
  job_status text CHECK (job_status IN ('queued', 'processing', 'ready', 'failed')) DEFAULT 'queued',
  error_message text,
  processing_time_seconds int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_video_transcripts_video_id ON video_transcripts(video_id);
CREATE INDEX idx_video_transcripts_job_status ON video_transcripts(job_status);
CREATE UNIQUE INDEX idx_video_transcripts_video_lang ON video_transcripts(video_id, language_original);

-- Video translations
CREATE TABLE video_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  transcript_id uuid REFERENCES video_transcripts(id) ON DELETE CASCADE NOT NULL,
  target_language text NOT NULL,
  translated_segments jsonb NOT NULL DEFAULT '[]'::jsonb,
  job_status text CHECK (job_status IN ('queued', 'processing', 'ready', 'failed')) DEFAULT 'queued',
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(video_id, target_language)
);

CREATE INDEX idx_video_translations_video_id ON video_translations(video_id);
CREATE INDEX idx_video_translations_transcript_id ON video_translations(transcript_id);
CREATE INDEX idx_video_translations_job_status ON video_translations(job_status);

-- Video audio tracks (TTS generated + Cloudflare Stream attached)
CREATE TABLE video_audio_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  language_code text NOT NULL,
  voice_type text CHECK (voice_type IN ('original', 'standard', 'premium', 'clone')) DEFAULT 'standard',
  audio_url text,
  cloudflare_track_id text,
  job_status text CHECK (job_status IN ('queued', 'processing', 'ready', 'failed')) DEFAULT 'queued',
  error_message text,
  duration_seconds int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(video_id, language_code, voice_type)
);

CREATE INDEX idx_video_audio_tracks_video_id ON video_audio_tracks(video_id);
CREATE INDEX idx_video_audio_tracks_job_status ON video_audio_tracks(job_status);
CREATE INDEX idx_video_audio_tracks_cloudflare ON video_audio_tracks(cloudflare_track_id) WHERE cloudflare_track_id IS NOT NULL;

-- Video subtitles (captions + Cloudflare Stream attached)
CREATE TABLE video_subtitles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  language_code text NOT NULL,
  vtt_url text NOT NULL,
  cloudflare_caption_id text,
  job_status text CHECK (job_status IN ('queued', 'processing', 'ready', 'failed')) DEFAULT 'queued',
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(video_id, language_code)
);

CREATE INDEX idx_video_subtitles_video_id ON video_subtitles(video_id);
CREATE INDEX idx_video_subtitles_job_status ON video_subtitles(job_status);

-- Media jobs queue (for async pipeline processing)
CREATE TABLE IF NOT EXISTS media_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text CHECK (job_type IN ('replay_finalize', 'stt', 'translate', 'tts', 'attach_audio', 'attach_captions')) NOT NULL,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  live_id uuid REFERENCES live_streams(id) ON DELETE CASCADE,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  job_status text CHECK (job_status IN ('queued', 'processing', 'done', 'failed')) DEFAULT 'queued',
  attempts int DEFAULT 0,
  max_attempts int DEFAULT 3,
  locked_at timestamptz,
  locked_by text,
  last_error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_jobs_status_type ON media_jobs(job_status, job_type, created_at) WHERE job_status IN ('queued', 'processing');
CREATE INDEX IF NOT EXISTS idx_media_jobs_video_id ON media_jobs(video_id);
CREATE INDEX IF NOT EXISTS idx_media_jobs_live_id ON media_jobs(live_id) WHERE live_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_media_jobs_locked ON media_jobs(locked_at) WHERE locked_at IS NOT NULL;

-- Enable RLS
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_subtitles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_jobs ENABLE ROW LEVEL SECURITY;

-- RLS for live_streams
CREATE POLICY "Anyone can view live streams"
  ON live_streams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can manage their live streams"
  ON live_streams FOR ALL
  TO authenticated
  USING (creator_id = auth.uid());

-- RLS Policies for video_transcripts
CREATE POLICY "Anyone can view transcripts of completed videos"
  ON video_transcripts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_transcripts.video_id
      AND videos.processing_status = 'completed'
    )
  );

CREATE POLICY "Creators can view their video transcripts"
  ON video_transcripts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_transcripts.video_id
      AND videos.creator_id = auth.uid()
    )
  );

-- RLS Policies for video_translations
CREATE POLICY "Anyone can view translations of completed videos"
  ON video_translations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_translations.video_id
      AND videos.processing_status = 'completed'
    )
  );

CREATE POLICY "Creators can view their video translations"
  ON video_translations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_translations.video_id
      AND videos.creator_id = auth.uid()
    )
  );

-- RLS Policies for video_audio_tracks
CREATE POLICY "Anyone can view audio tracks of completed videos"
  ON video_audio_tracks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_audio_tracks.video_id
      AND videos.processing_status = 'completed'
      AND video_audio_tracks.job_status = 'ready'
    )
  );

CREATE POLICY "Creators can view their video audio tracks"
  ON video_audio_tracks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_audio_tracks.video_id
      AND videos.creator_id = auth.uid()
    )
  );

-- RLS Policies for video_subtitles
CREATE POLICY "Anyone can view subtitles of completed videos"
  ON video_subtitles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_subtitles.video_id
      AND videos.processing_status = 'completed'
      AND video_subtitles.job_status = 'ready'
    )
  );

CREATE POLICY "Creators can view their video subtitles"
  ON video_subtitles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_subtitles.video_id
      AND videos.creator_id = auth.uid()
    )
  );

-- RLS Policies for media_jobs
CREATE POLICY "Creators can view jobs for their videos"
  ON media_jobs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = media_jobs.video_id
      AND videos.creator_id = auth.uid()
    )
  );

-- Helper function to enqueue media job (idempotent)
CREATE OR REPLACE FUNCTION enqueue_media_job(
  p_job_type text,
  p_video_id uuid,
  p_live_id uuid DEFAULT NULL,
  p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
  v_job_id uuid;
BEGIN
  INSERT INTO media_jobs (job_type, video_id, live_id, payload, job_status)
  VALUES (p_job_type, p_video_id, p_live_id, p_payload, 'queued')
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_job_id;
  
  RETURN v_job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Helper function to lock and get next job (FOR UPDATE SKIP LOCKED pattern)
CREATE OR REPLACE FUNCTION lock_next_media_job(
  p_job_types text[],
  p_worker_id text
)
RETURNS SETOF media_jobs AS $$
BEGIN
  RETURN QUERY
  UPDATE media_jobs
  SET 
    job_status = 'processing',
    locked_at = now(),
    locked_by = p_worker_id,
    updated_at = now()
  WHERE id = (
    SELECT id FROM media_jobs
    WHERE job_status = 'queued'
    AND job_type = ANY(p_job_types)
    AND attempts < max_attempts
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Helper function to update job status
CREATE OR REPLACE FUNCTION update_job_status(
  p_job_id uuid,
  p_status text,
  p_error text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE media_jobs
  SET 
    job_status = p_status,
    last_error = p_error,
    attempts = CASE WHEN p_status = 'failed' THEN attempts + 1 ELSE attempts END,
    locked_at = CASE WHEN p_status IN ('done', 'failed') THEN NULL ELSE locked_at END,
    locked_by = CASE WHEN p_status IN ('done', 'failed') THEN NULL ELSE locked_by END,
    updated_at = now()
  WHERE id = p_job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;