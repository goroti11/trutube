/*
  # Create Resources & Community System

  1. New Tables
    - `resource_categories` - Categories for resources (guides, tutorials, docs)
    - `resources` - Individual resource items (guides, videos, PDFs)
    - `resource_views` - Track resource views
    - `resource_bookmarks` - User bookmarks on resources
    - `community_announcements` - Official announcements
    - `community_feedback` - User feedback on features
    - `knowledge_base` - Searchable knowledge base articles

  2. Security
    - Enable RLS on all tables
    - Public can view published resources
    - Only admins can create/edit resources
    - Authenticated users can bookmark and provide feedback

  3. Features
    - Full-text search on resources
    - View tracking
    - Bookmark system
    - Rating system
    - Feedback collection
*/

-- Resource Categories
CREATE TABLE IF NOT EXISTS resource_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  color text DEFAULT '#3b82f6',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Resources
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES resource_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  content text,
  type text NOT NULL CHECK (type IN ('guide', 'tutorial', 'documentation', 'video', 'pdf', 'link')),
  url text,
  thumbnail_url text,
  tags text[] DEFAULT '{}',
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_time integer,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  views bigint DEFAULT 0,
  helpful_count bigint DEFAULT 0,
  not_helpful_count bigint DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resource Views
CREATE TABLE IF NOT EXISTS resource_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resource_id, user_id, created_at::date)
);

-- Resource Bookmarks
CREATE TABLE IF NOT EXISTS resource_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resource_id, user_id)
);

-- Community Announcements
CREATE TABLE IF NOT EXISTS community_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL CHECK (type IN ('feature', 'maintenance', 'incident', 'update', 'general')),
  severity text DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at timestamptz,
  expires_at timestamptz,
  is_pinned boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  views bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community Feedback
CREATE TABLE IF NOT EXISTS community_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('feature_request', 'bug_report', 'improvement', 'question', 'praise')),
  title text NOT NULL,
  description text NOT NULL,
  category text,
  priority text DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'planned', 'in_progress', 'completed', 'declined')),
  votes bigint DEFAULT 0,
  admin_response text,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Knowledge Base
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  keywords text[] DEFAULT '{}',
  helpful_count bigint DEFAULT 0,
  not_helpful_count bigint DEFAULT 0,
  order_index integer DEFAULT 0,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Feedback Votes
CREATE TABLE IF NOT EXISTS feedback_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES community_feedback(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(feedback_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_resource_views_resource ON resource_views(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_bookmarks_user ON resource_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON community_announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON community_announcements(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON community_feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_votes ON community_feedback(votes DESC);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_resources_search ON resources 
  USING gin(to_tsvector('english', title || ' ' || description || ' ' || coalesce(content, '')));

CREATE INDEX IF NOT EXISTS idx_knowledge_search ON knowledge_base 
  USING gin(to_tsvector('english', question || ' ' || answer));

-- Enable RLS
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resource_categories
CREATE POLICY "Anyone can view categories"
  ON resource_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON resource_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for resources
CREATE POLICY "Anyone can view published resources"
  ON resources FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Admins can manage resources"
  ON resources FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for resource_views
CREATE POLICY "Anyone can create views"
  ON resource_views FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own views"
  ON resource_views FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for resource_bookmarks
CREATE POLICY "Users can manage their bookmarks"
  ON resource_bookmarks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for community_announcements
CREATE POLICY "Anyone can view active announcements"
  ON community_announcements FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Admins can manage announcements"
  ON community_announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for community_feedback
CREATE POLICY "Users can view all feedback"
  ON community_feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create feedback"
  ON community_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON community_feedback FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all feedback"
  ON community_feedback FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for knowledge_base
CREATE POLICY "Anyone can view published knowledge"
  ON knowledge_base FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Admins can manage knowledge base"
  ON knowledge_base FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for feedback_votes
CREATE POLICY "Users can manage their votes"
  ON feedback_votes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION increment_resource_views(resource_slug text)
RETURNS void AS $$
BEGIN
  UPDATE resources
  SET views = views + 1
  WHERE slug = resource_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_announcement_views(announcement_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE community_announcements
  SET views = views + 1
  WHERE id = announcement_id AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION vote_feedback(feedback_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO feedback_votes (feedback_id, user_id)
  VALUES (feedback_id, auth.uid())
  ON CONFLICT (feedback_id, user_id) DO NOTHING;
  
  UPDATE community_feedback
  SET votes = (SELECT COUNT(*) FROM feedback_votes WHERE feedback_votes.feedback_id = vote_feedback.feedback_id)
  WHERE id = feedback_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION unvote_feedback(feedback_id uuid)
RETURNS void AS $$
BEGIN
  DELETE FROM feedback_votes
  WHERE feedback_votes.feedback_id = unvote_feedback.feedback_id
  AND user_id = auth.uid();
  
  UPDATE community_feedback
  SET votes = (SELECT COUNT(*) FROM feedback_votes WHERE feedback_votes.feedback_id = unvote_feedback.feedback_id)
  WHERE id = feedback_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON community_announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON community_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
