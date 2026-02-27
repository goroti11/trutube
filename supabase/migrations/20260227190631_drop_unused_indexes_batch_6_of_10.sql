/*
  # Drop Unused Indexes - Batch 6/10
  
  Tables: services, polls, revenue, monetization, communities
*/

DROP INDEX IF EXISTS idx_service_bookings_service;
DROP INDEX IF EXISTS idx_service_bookings_customer;
DROP INDEX IF EXISTS idx_poll_votes_poll;
DROP INDEX IF EXISTS idx_poll_votes_user;
DROP INDEX IF EXISTS idx_revenue_transactions_user_id;
DROP INDEX IF EXISTS idx_revenue_transactions_created_at;
DROP INDEX IF EXISTS idx_revenue_transactions_status;
DROP INDEX IF EXISTS idx_kyc_verifications_user_id;
DROP INDEX IF EXISTS idx_creator_monetization_status_user_id;
DROP INDEX IF EXISTS idx_communities_type;
DROP INDEX IF EXISTS idx_communities_universe;
DROP INDEX IF EXISTS idx_communities_creator;
DROP INDEX IF EXISTS idx_partner_acceptances_user_id;
DROP INDEX IF EXISTS idx_monetization_suspensions_user_id;
DROP INDEX IF EXISTS idx_monetization_suspensions_active;
DROP INDEX IF EXISTS idx_revenue_holds_user_id;
DROP INDEX IF EXISTS idx_revenue_holds_active;
DROP INDEX IF EXISTS idx_communities_slug;
DROP INDEX IF EXISTS idx_community_members_community;
DROP INDEX IF EXISTS idx_community_members_user;
