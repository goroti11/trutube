/*
  # Drop Unused Indexes - Batch 5/10
  
  Tables: affiliate_links, merchandise, brand_deals, music
*/

DROP INDEX IF EXISTS idx_affiliate_links_creator;
DROP INDEX IF EXISTS idx_affiliate_clicks_link;
DROP INDEX IF EXISTS idx_affiliate_conversions_link;
DROP INDEX IF EXISTS idx_merchandise_products_creator;
DROP INDEX IF EXISTS idx_merchandise_orders_creator;
DROP INDEX IF EXISTS idx_merchandise_orders_customer;
DROP INDEX IF EXISTS idx_merchandise_order_items_order;
DROP INDEX IF EXISTS idx_brand_deals_creator;
DROP INDEX IF EXISTS idx_video_sponsorships_video;
DROP INDEX IF EXISTS idx_video_sponsorships_deal;
DROP INDEX IF EXISTS idx_music_albums_creator;
DROP INDEX IF EXISTS idx_music_tracks_creator;
DROP INDEX IF EXISTS idx_music_tracks_album;
DROP INDEX IF EXISTS idx_music_streams_track;
DROP INDEX IF EXISTS idx_music_royalties_recipient;
DROP INDEX IF EXISTS idx_digital_products_creator;
DROP INDEX IF EXISTS idx_digital_product_modules_product;
DROP INDEX IF EXISTS idx_digital_product_purchases_product;
DROP INDEX IF EXISTS idx_digital_product_purchases_customer;
DROP INDEX IF EXISTS idx_services_creator;
