/*
  # Add Foreign Key Indexes - Part 2

  1. Performance Optimization
    - Add indexes on foreign key columns that lack covering indexes

  2. Tables Covered
    - digital_product_modules, digital_product_purchases, digital_products,
      marketplace_disputes, marketplace_order_messages, marketplace_orders,
      marketplace_reviews, marketplace_services, merchandise_order_items,
      merchandise_orders, merchandise_products, messages, moderation_votes,
      monetization_suspensions, music_albums, music_limited_editions,
      music_royalties, music_royalty_payments, music_royalty_splits,
      music_sale_preorders, music_sale_purchases, music_sale_releases,
      music_streams, music_tracks
*/

CREATE INDEX IF NOT EXISTS idx_fk_digital_product_modules_product_id ON public.digital_product_modules (product_id);
CREATE INDEX IF NOT EXISTS idx_fk_digital_product_purchases_customer_id ON public.digital_product_purchases (customer_id);
CREATE INDEX IF NOT EXISTS idx_fk_digital_products_creator_id ON public.digital_products (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_disputes_opened_by ON public.marketplace_disputes (opened_by);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_disputes_resolved_by ON public.marketplace_disputes (resolved_by);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_order_messages_order_id ON public.marketplace_order_messages (order_id);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_order_messages_sender_id ON public.marketplace_order_messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_orders_buyer_id ON public.marketplace_orders (buyer_id);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_orders_provider_id ON public.marketplace_orders (provider_id);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_orders_service_id ON public.marketplace_orders (service_id);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_reviews_reviewed_user_id ON public.marketplace_reviews (reviewed_user_id);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_reviews_reviewer_id ON public.marketplace_reviews (reviewer_id);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_reviews_service_id ON public.marketplace_reviews (service_id);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_services_provider_id ON public.marketplace_services (provider_id);
CREATE INDEX IF NOT EXISTS idx_fk_marketplace_services_user_id ON public.marketplace_services (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_merchandise_order_items_order_id ON public.merchandise_order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_fk_merchandise_order_items_product_id ON public.merchandise_order_items (product_id);
CREATE INDEX IF NOT EXISTS idx_fk_merchandise_orders_creator_id ON public.merchandise_orders (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_merchandise_orders_customer_id ON public.merchandise_orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_fk_merchandise_products_creator_id ON public.merchandise_products (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_messages_from_user_id ON public.messages (from_user_id);
CREATE INDEX IF NOT EXISTS idx_fk_messages_to_creator_id ON public.messages (to_creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_moderation_votes_voter_id ON public.moderation_votes (voter_id);
CREATE INDEX IF NOT EXISTS idx_fk_monetization_suspensions_user_id ON public.monetization_suspensions (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_albums_creator_id ON public.music_albums (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_limited_editions_owner_id ON public.music_limited_editions (owner_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_royalties_recipient_id ON public.music_royalties (recipient_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_royalties_track_id ON public.music_royalties (track_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_royalty_payments_purchase_id ON public.music_royalty_payments (purchase_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_royalty_payments_recipient_id ON public.music_royalty_payments (recipient_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_royalty_payments_release_id ON public.music_royalty_payments (release_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_royalty_payments_split_id ON public.music_royalty_payments (split_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_royalty_splits_recipient_user_id ON public.music_royalty_splits (recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_royalty_splits_release_id ON public.music_royalty_splits (release_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_sale_preorders_buyer_id ON public.music_sale_preorders (buyer_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_sale_preorders_purchase_id ON public.music_sale_preorders (purchase_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_sale_purchases_buyer_id ON public.music_sale_purchases (buyer_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_sale_releases_creator_id ON public.music_sale_releases (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_streams_listener_id ON public.music_streams (listener_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_streams_track_id ON public.music_streams (track_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_tracks_album_id ON public.music_tracks (album_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_tracks_creator_id ON public.music_tracks (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_music_tracks_primary_artist_id ON public.music_tracks (primary_artist_id);