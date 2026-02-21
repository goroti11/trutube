/*
  # Add Language Preference to Profiles

  This migration adds the language_preference column to the profiles table
  to support user language settings persistence.

  ## Changes
  - Add `language_preference` column to profiles table
  - Set default value to 'en'
  - Allow NULL for existing users

  ## Impact
  - Users can now save their language preferences
  - Improves user experience across sessions
*/

-- Add language_preference column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS language_preference text DEFAULT 'en';

-- Add comment for documentation
COMMENT ON COLUMN profiles.language_preference IS 'User preferred language for the interface (ISO 639-1 code)';
