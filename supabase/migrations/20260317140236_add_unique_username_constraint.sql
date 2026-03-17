/*
  # Add Unique Username Constraint

  1. Changes
    - Add unique constraint on profiles.username
    - Ensures no duplicate usernames in the system
  
  2. Security
    - Prevents username conflicts
    - Better user experience with unique identifiers
*/

-- Add unique constraint on username if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_username_key' 
    AND conrelid = 'profiles'::regclass
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
END $$;

-- Also add an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
