/*
  # Fix User Profile Creation Trigger

  1. Changes
    - Drop old incorrect trigger that references non-existent columns
    - Create new trigger that matches actual profiles table schema
    - Ensure username is extracted from metadata or email

  2. Security
    - RLS already in place on profiles table
    - Trigger runs with SECURITY DEFINER for proper permissions
*/

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop old function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create new function that matches actual profiles table schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_username text;
  v_display_name text;
BEGIN
  -- Extract username from metadata or generate from email
  v_username := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );
  
  -- Use username as display_name if not provided
  v_display_name := COALESCE(
    new.raw_user_meta_data->>'display_name',
    v_username,
    split_part(new.email, '@', 1)
  );

  -- Insert profile with correct schema
  INSERT INTO public.profiles (
    id,
    display_name,
    username,
    avatar_url,
    bio,
    user_status,
    trust_score,
    support_enabled,
    minimum_support_amount,
    total_support_received
  )
  VALUES (
    new.id,
    v_display_name,
    v_username,
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    '',
    'viewer',
    0.5,
    true,
    5.00,
    0
  )
  ON CONFLICT (id) DO NOTHING;

  -- Also create trust score record
  INSERT INTO public.user_trust_scores (
    user_id,
    overall_trust,
    view_authenticity,
    report_accuracy,
    engagement_quality
  )
  VALUES (
    new.id,
    0.5,
    0.5,
    0.5,
    0.5
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS policies allow profile insertion
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
  
  -- Create policy that allows authenticated users to insert their own profile
  CREATE POLICY "Users can insert their own profile"
    ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;
