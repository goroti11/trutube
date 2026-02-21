/*
  # Add Missing Foreign Key Index

  1. Security Fix
    - Add missing index on `service_bookings.creator_id` foreign key
    - This improves query performance when filtering by creator_id

  2. Performance
    - Prevents suboptimal query performance on foreign key lookups
*/

-- Add missing foreign key index
CREATE INDEX IF NOT EXISTS idx_service_bookings_creator_id 
ON service_bookings(creator_id);