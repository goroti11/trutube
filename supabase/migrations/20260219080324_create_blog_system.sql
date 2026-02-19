/*
  # Create TruTube Official Blog System

  1. New Tables
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `icon` (text)
      - `color` (text)
      - `created_at` (timestamp)

    - `blog_articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `cover_image` (text)
      - `category_id` (uuid, foreign key)
      - `author_id` (uuid, foreign key)
      - `status` (enum: draft, published, archived)
      - `published_at` (timestamp)
      - `views` (bigint)
      - `reading_time` (integer, in minutes)
      - `tags` (text array)
      - `seo_title` (text)
      - `seo_description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `blog_comments`
      - `id` (uuid, primary key)
      - `article_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `parent_id` (uuid, nullable, for replies)
      - `content` (text)
      - `likes` (bigint)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `blog_reactions`
      - `id` (uuid, primary key)
      - `article_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `reaction_type` (text: like, love, insightful, bookmark)
      - `created_at` (timestamp)
      - UNIQUE(article_id, user_id, reaction_type)

  2. Security
    - Enable RLS on all tables
    - Public can read published articles
    - Only authenticated users can comment
    - Only admins can create/edit articles

  3. Indexes
    - Index on slug for fast lookup
    - Index on category_id and status
    - Full-text search on title and content
*/

-- Create blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

-- Create blog articles table
CREATE TABLE IF NOT EXISTS blog_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image text,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  views bigint DEFAULT 0,
  reading_time integer DEFAULT 5,
  tags text[] DEFAULT '{}',
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES blog_articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES blog_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog reactions table
CREATE TABLE IF NOT EXISTS blog_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES blog_articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'love', 'insightful', 'bookmark')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, user_id, reaction_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON blog_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_articles_status ON blog_articles(status);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON blog_articles(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_comments_article ON blog_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_blog_reactions_article ON blog_reactions(article_id);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_blog_articles_search ON blog_articles 
  USING gin(to_tsvector('english', title || ' ' || excerpt || ' ' || content));

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_categories
CREATE POLICY "Anyone can view categories"
  ON blog_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for blog_articles
CREATE POLICY "Anyone can view published articles"
  ON blog_articles FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authors can view their own drafts"
  ON blog_articles FOR SELECT
  TO authenticated
  USING (
    author_id = auth.uid() OR
    status = 'published' OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can create articles"
  ON blog_articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Authors and admins can update articles"
  ON blog_articles FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete articles"
  ON blog_articles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can view comments"
  ON blog_comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON blog_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON blog_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON blog_comments FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for blog_reactions
CREATE POLICY "Anyone can view reactions"
  ON blog_reactions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage their reactions"
  ON blog_reactions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update article views
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void AS $$
BEGIN
  UPDATE blog_articles
  SET views = views + 1
  WHERE slug = article_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate reading time
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text text)
RETURNS integer AS $$
DECLARE
  word_count integer;
  reading_time integer;
BEGIN
  word_count := array_length(regexp_split_to_array(content_text, '\s+'), 1);
  reading_time := GREATEST(1, ROUND(word_count / 200.0));
  RETURN reading_time;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-update reading_time
CREATE OR REPLACE FUNCTION update_article_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reading_time := calculate_reading_time(NEW.content);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_article_reading_time
  BEFORE INSERT OR UPDATE ON blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_article_reading_time();
