/*
  # Fix Profile Columns and Signup Flow

  1. Changes
    - Add missing columns to profiles table: display_name, banner_url, about
    - Update the handle_new_user() function to use correct column names
    - Ensure create_default_creator_channel() works with updated profile structure
    - Fix any conflicts between column names

  2. New Columns
    - `display_name` (text) - Public display name (defaults to username if not set)
    - `banner_url` (text) - Profile banner image URL
    - `about` (text) - Extended bio/about section

  3. Notes
    - Ensures smooth signup flow
    - Compatible with existing data
    - Maintains backward compatibility
*/

-- Add missing columns to profiles table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN display_name TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'banner_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN banner_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'about'
  ) THEN
    ALTER TABLE profiles ADD COLUMN about TEXT;
  END IF;
END $$;

-- Update existing rows to have display_name from username if null
UPDATE profiles
SET display_name = username
WHERE display_name IS NULL;

-- Update the handle_new_user() function to properly handle all fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    full_name,
    avatar_url,
    banner_url,
    bio,
    about
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'banner_url', ''),
    COALESCE(new.raw_user_meta_data->>'bio', ''),
    COALESCE(new.raw_user_meta_data->>'about', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    username = COALESCE(EXCLUDED.username, profiles.username),
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    banner_url = COALESCE(EXCLUDED.banner_url, profiles.banner_url),
    updated_at = now();
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update create_default_creator_channel to handle null values better
CREATE OR REPLACE FUNCTION create_default_creator_channel()
RETURNS TRIGGER AS $$
DECLARE
  v_channel_url TEXT;
  v_display_name TEXT;
  v_username TEXT;
BEGIN
  -- Generate unique URL based on user_id (always unique)
  v_channel_url := 'channel-' || NEW.id;

  -- Use username, display_name, or generate a name
  v_username := COALESCE(NEW.username, 'user' || substring(NEW.id::text from 1 for 8));
  v_display_name := COALESCE(NEW.display_name, NEW.username, NEW.full_name, 'Créateur ' || substring(NEW.id::text from 1 for 8));

  -- Create default channel
  INSERT INTO creator_channels (
    user_id,
    channel_url,
    display_name,
    channel_type,
    description,
    avatar_url,
    banner_url,
    category,
    is_verified,
    visibility,
    allow_comments,
    allow_video_uploads,
    monetization_enabled,
    premium_sales_enabled,
    marketplace_enabled,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    v_channel_url,
    v_display_name,
    'individual',
    'Bienvenue sur ma chaîne Goroti!',
    COALESCE(NULLIF(NEW.avatar_url, ''), 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'),
    COALESCE(NULLIF(NEW.banner_url, ''), 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg'),
    'general',
    false,
    'public',
    true,
    true,
    false,
    false,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id, channel_url) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS trigger_create_default_channel ON profiles;
CREATE TRIGGER trigger_create_default_channel
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_creator_channel();

-- Add comment
COMMENT ON FUNCTION public.handle_new_user() IS
'Creates user profile with all necessary fields from auth metadata on signup';