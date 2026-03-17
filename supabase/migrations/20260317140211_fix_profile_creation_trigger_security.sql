/*
  # Fix Profile Creation Trigger Security

  1. Changes
    - Update handle_new_user function to use SECURITY DEFINER
    - This allows the trigger to bypass RLS when creating profiles
    - Ensures profiles are always created on signup
  
  2. Security
    - Function runs with elevated privileges only for profile creation
    - Still maintains RLS for all user operations
*/

-- Drop and recreate the function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- This allows bypassing RLS during trigger execution
SET search_path = public
LANGUAGE plpgsql
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
