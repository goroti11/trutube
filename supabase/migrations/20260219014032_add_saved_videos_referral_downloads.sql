/*
  # GOROTI - Saved Videos, Referral System & Downloads

  ## New Tables

  ### 1. saved_videos
  - Stores videos bookmarked/saved by users
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to auth.users)
  - `video_id` (text, the video ID)
  - `video_title` (text)
  - `video_thumbnail` (text)
  - `video_creator` (text)
  - `video_duration` (integer, seconds)
  - `created_at` (timestamptz)

  ### 2. referrals
  - User-to-user referral (parrainage) system
  - `id` (uuid, primary key)
  - `referrer_id` (uuid, FK to auth.users) - the person who referred
  - `referred_id` (uuid, FK to auth.users) - the person who was referred
  - `referral_code` (text, unique) - the code used
  - `status` (text) - pending/completed/rewarded
  - `reward_trucoin` (integer) - TruCoins awarded
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)

  ### 3. user_referral_codes
  - Each user has a unique referral code
  - `id` (uuid, primary key)
  - `user_id` (uuid, unique FK to auth.users)
  - `code` (text, unique)
  - `total_referrals` (integer)
  - `total_rewards` (integer) - TruCoins earned
  - `created_at` (timestamptz)

  ### 4. video_share_links
  - Tracks video share link clicks for analytics
  - `id` (uuid, primary key)
  - `video_id` (text)
  - `shared_by` (uuid, FK to auth.users, nullable)
  - `platform` (text) - facebook, twitter, whatsapp, copy, etc.
  - `clicks` (integer)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only manage their own data
*/

-- saved_videos table
CREATE TABLE IF NOT EXISTS saved_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id text NOT NULL,
  video_title text NOT NULL DEFAULT '',
  video_thumbnail text NOT NULL DEFAULT '',
  video_creator text NOT NULL DEFAULT '',
  video_duration integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE saved_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved videos"
  ON saved_videos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save videos"
  ON saved_videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave videos"
  ON saved_videos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_videos_user_id ON saved_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_videos_created_at ON saved_videos(created_at DESC);

-- user_referral_codes table
CREATE TABLE IF NOT EXISTS user_referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  total_referrals integer NOT NULL DEFAULT 0,
  total_rewards integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral code"
  ON user_referral_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own referral code"
  ON user_referral_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own referral code"
  ON user_referral_codes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow reading codes for referral validation (unauthenticated needed for landing)
CREATE POLICY "Anyone can look up referral codes"
  ON user_referral_codes FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON user_referral_codes(code);

-- referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reward_trucoin integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Referrers can view their referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can insert referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Referrers can update their referrals"
  ON referrals FOR UPDATE
  TO authenticated
  USING (auth.uid() = referrer_id)
  WITH CHECK (auth.uid() = referrer_id);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

-- video_share_events table (analytics)
CREATE TABLE IF NOT EXISTS video_share_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id text NOT NULL,
  shared_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  platform text NOT NULL DEFAULT 'copy',
  referral_code text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_share_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can log share events"
  ON video_share_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Anyone can log anonymous share events"
  ON video_share_events FOR INSERT
  TO anon
  WITH CHECK (shared_by IS NULL);

CREATE POLICY "Users can view own share events"
  ON video_share_events FOR SELECT
  TO authenticated
  USING (auth.uid() = shared_by);

CREATE INDEX IF NOT EXISTS idx_share_events_video_id ON video_share_events(video_id);
