/*
  # Fix Function Search Paths
  
  Set immutable search_path for functions to prevent security issues
*/

-- Fix update_notification_timestamp_unified
ALTER FUNCTION update_notification_timestamp_unified() SET search_path = public;