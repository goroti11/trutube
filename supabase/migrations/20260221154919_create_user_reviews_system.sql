/*
  # User Reviews System

  1. New Tables
    - `video_reviews` - Reviews for videos
      - `id` (uuid, primary key)
      - `video_id` (uuid, references videos)
      - `reviewer_id` (uuid, references profiles)
      - `rating` (integer, 1-5 stars)
      - `title` (text, review title)
      - `content` (text, review content)
      - `helpful_count` (integer, helpful votes)
      - `verified_purchase` (boolean, if user supported creator)
      - `status` (text, published/hidden/reported)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `creator_reviews` - Reviews for creators/channels
      - Similar structure to video_reviews
      - `creator_id` instead of video_id
    
    - `review_helpfulness` - Track who found reviews helpful
      - `review_id` (uuid)
      - `review_type` (text, video/creator)
      - `user_id` (uuid)
      - `is_helpful` (boolean)
    
    - `review_responses` - Creator responses to reviews
      - `id` (uuid, primary key)
      - `review_id` (uuid)
      - `review_type` (text)
      - `creator_id` (uuid)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can create/edit own reviews
    - Creators can respond to reviews on their content
    - Public can view published reviews
*/

-- Video Reviews Table
CREATE TABLE IF NOT EXISTS video_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  content text NOT NULL CHECK (char_length(content) >= 10 AND char_length(content) <= 5000),
  helpful_count integer DEFAULT 0 NOT NULL,
  verified_purchase boolean DEFAULT false NOT NULL,
  status text DEFAULT 'published' NOT NULL CHECK (status IN ('published', 'hidden', 'reported', 'removed')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(video_id, reviewer_id)
);

-- Creator Reviews Table
CREATE TABLE IF NOT EXISTS creator_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  content text NOT NULL CHECK (char_length(content) >= 10 AND char_length(content) <= 5000),
  helpful_count integer DEFAULT 0 NOT NULL,
  verified_supporter boolean DEFAULT false NOT NULL,
  status text DEFAULT 'published' NOT NULL CHECK (status IN ('published', 'hidden', 'reported', 'removed')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(creator_id, reviewer_id)
);

-- Review Helpfulness Tracking
CREATE TABLE IF NOT EXISTS review_helpfulness (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL,
  review_type text NOT NULL CHECK (review_type IN ('video', 'creator')),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_helpful boolean NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(review_id, review_type, user_id)
);

-- Creator Responses to Reviews
CREATE TABLE IF NOT EXISTS review_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL,
  review_type text NOT NULL CHECK (review_type IN ('video', 'creator')),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL CHECK (char_length(content) >= 10 AND char_length(content) <= 2000),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_reviews_video_id ON video_reviews(video_id) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_video_reviews_reviewer_id ON video_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_video_reviews_rating ON video_reviews(rating) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_creator_reviews_creator_id ON creator_reviews(creator_id) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_creator_reviews_reviewer_id ON creator_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_creator_reviews_rating ON creator_reviews(rating) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_review_helpfulness_review ON review_helpfulness(review_id, review_type);
CREATE INDEX IF NOT EXISTS idx_review_responses_review ON review_responses(review_id, review_type);

-- Enable RLS
ALTER TABLE video_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpfulness ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;

-- Video Reviews Policies
CREATE POLICY "Anyone can view published video reviews"
  ON video_reviews FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can create video reviews"
  ON video_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own video reviews"
  ON video_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own video reviews"
  ON video_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Creator Reviews Policies
CREATE POLICY "Anyone can view published creator reviews"
  ON creator_reviews FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can create creator reviews"
  ON creator_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own creator reviews"
  ON creator_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own creator reviews"
  ON creator_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Review Helpfulness Policies
CREATE POLICY "Anyone can view review helpfulness"
  ON review_helpfulness FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can mark reviews helpful"
  ON review_helpfulness FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own helpfulness votes"
  ON review_helpfulness FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own helpfulness votes"
  ON review_helpfulness FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Review Responses Policies
CREATE POLICY "Anyone can view review responses"
  ON review_responses FOR SELECT
  USING (true);

CREATE POLICY "Creators can respond to reviews on their content"
  ON review_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = creator_id AND
    (
      (review_type = 'video' AND EXISTS (
        SELECT 1 FROM video_reviews vr
        JOIN videos v ON vr.video_id = v.id
        WHERE vr.id = review_id AND v.creator_id = auth.uid()
      )) OR
      (review_type = 'creator' AND EXISTS (
        SELECT 1 FROM creator_reviews cr
        WHERE cr.id = review_id AND cr.creator_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Creators can update own responses"
  ON review_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own responses"
  ON review_responses FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Function to update helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_TABLE_NAME = 'review_helpfulness' THEN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
      IF NEW.review_type = 'video' THEN
        UPDATE video_reviews
        SET helpful_count = (
          SELECT COUNT(*) FROM review_helpfulness
          WHERE review_id = NEW.review_id
            AND review_type = 'video'
            AND is_helpful = true
        )
        WHERE id = NEW.review_id;
      ELSIF NEW.review_type = 'creator' THEN
        UPDATE creator_reviews
        SET helpful_count = (
          SELECT COUNT(*) FROM review_helpfulness
          WHERE review_id = NEW.review_id
            AND review_type = 'creator'
            AND is_helpful = true
        )
        WHERE id = NEW.review_id;
      END IF;
    ELSIF TG_OP = 'DELETE' THEN
      IF OLD.review_type = 'video' THEN
        UPDATE video_reviews
        SET helpful_count = (
          SELECT COUNT(*) FROM review_helpfulness
          WHERE review_id = OLD.review_id
            AND review_type = 'video'
            AND is_helpful = true
        )
        WHERE id = OLD.review_id;
      ELSIF OLD.review_type = 'creator' THEN
        UPDATE creator_reviews
        SET helpful_count = (
          SELECT COUNT(*) FROM review_helpfulness
          WHERE review_id = OLD.review_id
            AND review_type = 'creator'
            AND is_helpful = true
        )
        WHERE id = OLD.review_id;
      END IF;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger for helpful count updates
DROP TRIGGER IF EXISTS update_review_helpful_count_trigger ON review_helpfulness;
CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON review_helpfulness
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Function to update review timestamp
CREATE OR REPLACE FUNCTION update_review_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_video_reviews_updated_at ON video_reviews;
CREATE TRIGGER update_video_reviews_updated_at
  BEFORE UPDATE ON video_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_review_updated_at();

DROP TRIGGER IF EXISTS update_creator_reviews_updated_at ON creator_reviews;
CREATE TRIGGER update_creator_reviews_updated_at
  BEFORE UPDATE ON creator_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_review_updated_at();

DROP TRIGGER IF EXISTS update_review_responses_updated_at ON review_responses;
CREATE TRIGGER update_review_responses_updated_at
  BEFORE UPDATE ON review_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_review_updated_at();