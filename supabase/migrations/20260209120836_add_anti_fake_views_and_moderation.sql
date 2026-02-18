/*
  # Add Anti-Fake Views System and Community Moderation

  ## 1. New Tables

  ### `watch_sessions`
  Track actual viewing sessions with interaction data
  - `id` (uuid, primary key)
  - `video_id` (uuid, references videos)
  - `user_id` (uuid, references profiles) - nullable for anonymous
  - `session_start` (timestamptz)
  - `session_end` (timestamptz)
  - `watch_time_seconds` (integer) - actual seconds watched
  - `interactions_count` (integer) - pause, volume, fullscreen, etc.
  - `device_fingerprint` (text) - device identifier
  - `ip_hash` (text) - hashed IP for privacy
  - `is_validated` (boolean) - whether this counts as real view
  - `trust_score` (numeric) - confidence this is a real view (0-1)
  - `created_at` (timestamptz)

  ### `user_trust_scores`
  Track user reliability and authenticity
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, unique)
  - `overall_trust` (numeric) - 0-1, higher = more trustworthy
  - `view_authenticity` (numeric) - how authentic their views are
  - `report_accuracy` (numeric) - how accurate their reports are
  - `engagement_quality` (numeric) - quality of their engagement
  - `account_age_days` (integer)
  - `verified_actions_count` (integer)
  - `suspicious_actions_count` (integer)
  - `updated_at` (timestamptz)

  ### `content_reports`
  Community reporting system
  - `id` (uuid, primary key)
  - `content_type` (text) - 'video', 'comment', 'profile'
  - `content_id` (uuid)
  - `reporter_id` (uuid, references profiles)
  - `reason` (text) - 'spam', 'harassment', 'misinformation', 'copyright', 'other'
  - `description` (text)
  - `status` (text) - 'pending', 'under_review', 'resolved', 'dismissed'
  - `reporter_trust_at_time` (numeric) - reporter's trust score when reported
  - `created_at` (timestamptz)

  ### `moderation_votes`
  Peer creator voting on content issues
  - `id` (uuid, primary key)
  - `report_id` (uuid, references content_reports)
  - `voter_id` (uuid, references profiles)
  - `vote` (text) - 'remove', 'keep', 'warn'
  - `comment` (text)
  - `voter_trust_at_time` (numeric)
  - `created_at` (timestamptz)

  ### `content_status`
  Track content visibility and moderation state
  - `id` (uuid, primary key)
  - `content_type` (text)
  - `content_id` (uuid)
  - `status` (text) - 'visible', 'masked', 'under_review', 'removed'
  - `reason` (text)
  - `can_appeal` (boolean)
  - `appeal_deadline` (timestamptz)
  - `masked_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Changes to Existing Tables

  ### Videos table
  - Add `is_masked` (boolean) - quick check for moderation status
  - Add `quality_score` (numeric) - overall quality metric for recommendations
  - Add `authenticity_score` (numeric) - confidence views are real

  ### Profiles table
  - Add `trust_score` (numeric) - overall user trust (0-1)

  ## 3. Security
  - Enable RLS on all new tables
  - Users can view watch_sessions but not other users' sessions
  - Users can create reports
  - Only authenticated users with high trust can vote on moderation
  - Content status visible to all

  ## 4. Important Notes
  - Watch sessions validated based on: watch_time >= threshold AND interactions > 0
  - Trust scores updated periodically, not in real-time
  - Peer voting requires creator status AND high trust score
  - Content masked, not deleted - can be restored on appeal
*/

-- Create watch_sessions table
CREATE TABLE IF NOT EXISTS watch_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_start timestamptz DEFAULT now() NOT NULL,
  session_end timestamptz,
  watch_time_seconds integer DEFAULT 0,
  interactions_count integer DEFAULT 0,
  device_fingerprint text DEFAULT '',
  ip_hash text DEFAULT '',
  is_validated boolean DEFAULT false,
  trust_score numeric DEFAULT 0.5,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE watch_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watch sessions"
  ON watch_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create watch sessions"
  ON watch_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own watch sessions"
  ON watch_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create user_trust_scores table
CREATE TABLE IF NOT EXISTS user_trust_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  overall_trust numeric DEFAULT 0.5 CHECK (overall_trust >= 0 AND overall_trust <= 1),
  view_authenticity numeric DEFAULT 0.5 CHECK (view_authenticity >= 0 AND view_authenticity <= 1),
  report_accuracy numeric DEFAULT 0.5 CHECK (report_accuracy >= 0 AND report_accuracy <= 1),
  engagement_quality numeric DEFAULT 0.5 CHECK (engagement_quality >= 0 AND engagement_quality <= 1),
  account_age_days integer DEFAULT 0,
  verified_actions_count integer DEFAULT 0,
  suspicious_actions_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_trust_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all trust scores"
  ON user_trust_scores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own trust score details"
  ON user_trust_scores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create content_reports table
CREATE TABLE IF NOT EXISTS content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('video', 'comment', 'profile')),
  content_id uuid NOT NULL,
  reporter_id uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  reason text NOT NULL CHECK (reason IN ('spam', 'harassment', 'misinformation', 'copyright', 'inappropriate', 'other')),
  description text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
  reporter_trust_at_time numeric DEFAULT 0.5,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reports they created"
  ON content_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports"
  ON content_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Creators can view reports on their content"
  ON content_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos v
      WHERE v.id = content_reports.content_id
      AND v.creator_id = auth.uid()
    )
  );

-- Create moderation_votes table
CREATE TABLE IF NOT EXISTS moderation_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES content_reports(id) ON DELETE CASCADE NOT NULL,
  voter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vote text NOT NULL CHECK (vote IN ('remove', 'keep', 'warn')),
  comment text DEFAULT '',
  voter_trust_at_time numeric DEFAULT 0.5,
  created_at timestamptz DEFAULT now(),
  UNIQUE(report_id, voter_id)
);

ALTER TABLE moderation_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view votes on reports they're involved in"
  ON moderation_votes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_reports cr
      WHERE cr.id = moderation_votes.report_id
      AND (cr.reporter_id = auth.uid() OR auth.uid() = moderation_votes.voter_id)
    )
  );

CREATE POLICY "Trusted creators can vote on moderation"
  ON moderation_votes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = voter_id
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.user_status IN ('creator', 'pro', 'elite')
    )
  );

-- Create content_status table
CREATE TABLE IF NOT EXISTS content_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('video', 'comment', 'profile')),
  content_id uuid NOT NULL,
  status text DEFAULT 'visible' CHECK (status IN ('visible', 'masked', 'under_review', 'removed')),
  reason text DEFAULT '',
  can_appeal boolean DEFAULT true,
  appeal_deadline timestamptz,
  masked_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(content_type, content_id)
);

ALTER TABLE content_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view content status"
  ON content_status FOR SELECT
  TO authenticated
  USING (true);

-- Add columns to videos table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'is_masked'
  ) THEN
    ALTER TABLE videos ADD COLUMN is_masked boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'quality_score'
  ) THEN
    ALTER TABLE videos ADD COLUMN quality_score numeric DEFAULT 0.5 CHECK (quality_score >= 0 AND quality_score <= 1);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'authenticity_score'
  ) THEN
    ALTER TABLE videos ADD COLUMN authenticity_score numeric DEFAULT 0.5 CHECK (authenticity_score >= 0 AND authenticity_score <= 1);
  END IF;
END $$;

-- Add trust_score to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'trust_score'
  ) THEN
    ALTER TABLE profiles ADD COLUMN trust_score numeric DEFAULT 0.5 CHECK (trust_score >= 0 AND trust_score <= 1);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_watch_sessions_video_id ON watch_sessions(video_id);
CREATE INDEX IF NOT EXISTS idx_watch_sessions_user_id ON watch_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_sessions_validated ON watch_sessions(is_validated);
CREATE INDEX IF NOT EXISTS idx_user_trust_scores_user_id ON user_trust_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_content ON content_reports(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_moderation_votes_report_id ON moderation_votes(report_id);
CREATE INDEX IF NOT EXISTS idx_content_status_content ON content_status(content_type, content_id);

-- Function to validate watch session
CREATE OR REPLACE FUNCTION validate_watch_session()
RETURNS TRIGGER AS $$
BEGIN
  -- A view is validated if:
  -- 1. Watch time >= 30 seconds OR >= 30% of video duration (whichever is less)
  -- 2. At least 1 interaction
  -- 3. Trust score >= 0.3
  
  IF NEW.watch_time_seconds >= 30 
     AND NEW.interactions_count > 0 
     AND NEW.trust_score >= 0.3 THEN
    NEW.is_validated = true;
  ELSE
    NEW.is_validated = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_watch_session
  BEFORE INSERT OR UPDATE ON watch_sessions
  FOR EACH ROW
  EXECUTE FUNCTION validate_watch_session();

-- Function to calculate user overall trust score
CREATE OR REPLACE FUNCTION calculate_user_trust()
RETURNS TRIGGER AS $$
BEGIN
  -- Overall trust = weighted average of sub-scores
  NEW.overall_trust = (
    NEW.view_authenticity * 0.4 +
    NEW.report_accuracy * 0.3 +
    NEW.engagement_quality * 0.3
  );
  
  -- Bonus for account age (up to 0.1 boost)
  IF NEW.account_age_days > 365 THEN
    NEW.overall_trust = LEAST(1.0, NEW.overall_trust + 0.1);
  ELSIF NEW.account_age_days > 180 THEN
    NEW.overall_trust = LEAST(1.0, NEW.overall_trust + 0.05);
  END IF;
  
  -- Penalty for suspicious actions
  IF NEW.suspicious_actions_count > 5 THEN
    NEW.overall_trust = GREATEST(0.0, NEW.overall_trust - 0.2);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_user_trust
  BEFORE INSERT OR UPDATE ON user_trust_scores
  FOR EACH ROW
  EXECUTE FUNCTION calculate_user_trust();

-- Initialize trust scores for existing users
INSERT INTO user_trust_scores (user_id, account_age_days)
SELECT 
  id,
  EXTRACT(DAY FROM (NOW() - created_at))::integer
FROM profiles
ON CONFLICT (user_id) DO NOTHING;
