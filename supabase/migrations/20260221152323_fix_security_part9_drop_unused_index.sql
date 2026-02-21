/*
  # Security Fix Part 9: Drop Remaining Unused Index

  This migration drops the last unused index identified by Supabase security audit.

  ## Index Removed
  - idx_service_bookings_creator_id - Not used by any queries

  ## Impact
  - Reduces storage overhead
  - Improves write performance on service_bookings table
  - Note: We already have idx_service_bookings_service_id for foreign key optimization
*/

DROP INDEX IF EXISTS idx_service_bookings_creator_id;
