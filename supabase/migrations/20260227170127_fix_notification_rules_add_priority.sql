/*
  # Fix notification_rules table structure
  
  Add missing priority column to notification_rules table
*/

ALTER TABLE notification_rules
ADD COLUMN IF NOT EXISTS priority integer DEFAULT 2 CHECK (priority BETWEEN 1 AND 5);
