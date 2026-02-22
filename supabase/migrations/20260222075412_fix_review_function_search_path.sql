/*
  # Fix Review Function Search Path

  1. Security Fix
    - Add SECURITY DEFINER and SET search_path to update_review_updated_at function
    - This prevents potential security issues with mutable search paths
*/

-- Fix the update_review_updated_at function with proper security settings
CREATE OR REPLACE FUNCTION update_review_updated_at()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
