/*
  # Goroti Communauté - Tables de base

  1. Tables principales
    - communities (communautés)
    - community_members (membres)
    - community_posts (publications)
    - post_comments (commentaires)
    - post_reactions (réactions)

  2. Sécurité
    - RLS activé
    - Politiques selon type et visibilité
*/

-- Types ENUM
DO $$ BEGIN
  CREATE TYPE community_type AS ENUM ('universe', 'creator', 'premium', 'private');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE post_type AS ENUM ('text', 'image', 'video', 'poll', 'thread', 'qa');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE post_visibility AS ENUM ('public', 'members', 'premium', 'private');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'flagged', 'removed', 'banned');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- COMMUNAUTÉS
CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  type community_type NOT NULL DEFAULT 'universe',
  
  universe_id text,
  sub_universe_id text,
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  is_premium boolean DEFAULT false,
  premium_price numeric DEFAULT 0,
  
  member_count integer DEFAULT 0,
  post_count integer DEFAULT 0,
  
  avatar_url text,
  banner_url text,
  
  rules jsonb DEFAULT '[]'::jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_communities_type ON communities(type);
CREATE INDEX IF NOT EXISTS idx_communities_universe ON communities(universe_id);
CREATE INDEX IF NOT EXISTS idx_communities_creator ON communities(creator_id);
CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public communities" ON communities;
CREATE POLICY "Anyone can view public communities"
  ON communities FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Creators can manage own communities" ON communities;
CREATE POLICY "Creators can manage own communities"
  ON communities FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- MEMBRES
CREATE TABLE IF NOT EXISTS community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  
  reputation_score integer DEFAULT 0,
  post_count integer DEFAULT 0,
  helpful_count integer DEFAULT 0,
  
  joined_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now(),
  
  UNIQUE(community_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_community_members_community ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_role ON community_members(role);

ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view own membership" ON community_members;
CREATE POLICY "Members can view own membership"
  ON community_members FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view community members" ON community_members;
CREATE POLICY "Anyone can view community members"
  ON community_members FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can join communities" ON community_members;
CREATE POLICY "Users can join communities"
  ON community_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- PUBLICATIONS
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  title text,
  content text NOT NULL,
  post_type post_type NOT NULL DEFAULT 'text',
  visibility post_visibility NOT NULL DEFAULT 'public',
  
  media_urls jsonb DEFAULT '[]'::jsonb,
  
  engagement_score integer DEFAULT 0,
  view_count integer DEFAULT 0,
  reaction_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  
  is_pinned boolean DEFAULT false,
  is_announcement boolean DEFAULT false,
  
  moderation_status moderation_status DEFAULT 'approved',
  moderated_at timestamptz,
  moderated_by uuid REFERENCES auth.users(id),
  moderation_reason text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_posts_community ON community_posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_engagement ON community_posts(engagement_score DESC);
CREATE INDEX IF NOT EXISTS idx_posts_moderation ON community_posts(moderation_status);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved public posts" ON community_posts;
CREATE POLICY "Anyone can view approved public posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (
    moderation_status = 'approved' 
    AND deleted_at IS NULL
    AND (visibility = 'public' OR auth.uid() = author_id)
  );

DROP POLICY IF EXISTS "Users can create posts" ON community_posts;
CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update own posts" ON community_posts;
CREATE POLICY "Authors can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- COMMENTAIRES
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  
  content text NOT NULL,
  
  reaction_count integer DEFAULT 0,
  is_helpful boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  
  moderation_status moderation_status DEFAULT 'approved',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON post_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON post_comments(parent_comment_id);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved comments" ON post_comments;
CREATE POLICY "Anyone can view approved comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (moderation_status = 'approved' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can create comments" ON post_comments;
CREATE POLICY "Users can create comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update own comments" ON post_comments;
CREATE POLICY "Authors can update own comments"
  ON post_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- RÉACTIONS
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'love', 'insightful', 'helpful', 'funny')),
  
  created_at timestamptz DEFAULT now(),
  
  CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reactions_post_user ON post_reactions(post_id, user_id, reaction_type) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reactions_comment_user ON post_reactions(comment_id, user_id, reaction_type) WHERE comment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reactions_user ON post_reactions(user_id);

ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reactions" ON post_reactions;
CREATE POLICY "Anyone can view reactions"
  ON post_reactions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can add reactions" ON post_reactions;
CREATE POLICY "Users can add reactions"
  ON post_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove own reactions" ON post_reactions;
CREATE POLICY "Users can remove own reactions"
  ON post_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
