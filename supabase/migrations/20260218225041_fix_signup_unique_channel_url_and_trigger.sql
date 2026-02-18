/*
  # Fix signup error: unique constraint violation on channel_url

  ## Problem
  The profiles table has a UNIQUE constraint on channel_url, but the trigger
  initializes it to '' (empty string) for all new users — causing a conflict
  for every user after the first.

  ## Changes
  1. Drop the UNIQUE constraint on channel_url (empty string is not a valid channel URL)
  2. Change channel_url default to NULL so it doesn't conflict
  3. Fix the handle_new_user() trigger to use NULL for optional unique fields
  4. Also fix username uniqueness by appending a suffix on conflict
*/

-- 1. Drop the problematic UNIQUE constraint on channel_url
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_channel_url_key;

-- 2. Change default for channel_url to NULL
ALTER TABLE public.profiles 
  ALTER COLUMN channel_url SET DEFAULT NULL;

-- 3. Update existing empty channel_url to NULL to avoid issues
UPDATE public.profiles 
SET channel_url = NULL 
WHERE channel_url = '';

-- 4. Update existing empty banner_url to NULL
UPDATE public.profiles 
SET banner_url = NULL 
WHERE banner_url = '';

-- 5. Replace the trigger function with a robust version
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text;
  v_display_name text;
  v_suffix int := 0;
  v_final_username text;
BEGIN
  -- Extract username from metadata or generate from email
  v_username := COALESCE(
    NULLIF(trim(new.raw_user_meta_data->>'username'), ''),
    split_part(new.email, '@', 1)
  );

  -- Sanitize: keep only alphanumeric and underscores, lowercase
  v_username := lower(regexp_replace(v_username, '[^a-zA-Z0-9_]', '', 'g'));
  -- Ensure min length
  IF length(v_username) < 3 THEN
    v_username := 'user_' || left(replace(new.id::text, '-', ''), 8);
  END IF;

  -- Use full_name or username as display_name
  v_display_name := COALESCE(
    NULLIF(trim(new.raw_user_meta_data->>'full_name'), ''),
    NULLIF(trim(new.raw_user_meta_data->>'display_name'), ''),
    v_username
  );

  -- Handle username uniqueness by appending suffix if needed
  v_final_username := v_username;
  LOOP
    BEGIN
      INSERT INTO public.profiles (
        id,
        display_name,
        username,
        avatar_url,
        bio,
        banner_url,
        channel_url,
        about,
        user_status,
        trust_score,
        support_enabled,
        minimum_support_amount,
        total_support_received
      )
      VALUES (
        new.id,
        v_display_name,
        v_final_username,
        NULLIF(trim(COALESCE(new.raw_user_meta_data->>'avatar_url', '')), ''),
        '',
        NULL,
        NULL,
        '',
        'viewer',
        0.5,
        true,
        5.00,
        0
      );
      EXIT; -- success, exit loop
    EXCEPTION
      WHEN unique_violation THEN
        v_suffix := v_suffix + 1;
        v_final_username := v_username || '_' || v_suffix;
        IF v_suffix > 100 THEN
          v_final_username := 'user_' || left(replace(new.id::text, '-', ''), 12);
          INSERT INTO public.profiles (
            id, display_name, username, bio, user_status, trust_score,
            support_enabled, minimum_support_amount, total_support_received
          )
          VALUES (
            new.id, v_display_name, v_final_username, '', 'viewer', 0.5, true, 5.00, 0
          )
          ON CONFLICT (id) DO NOTHING;
          EXIT;
        END IF;
    END;
  END LOOP;

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

-- Re-create the trigger (drop first to ensure clean state)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
