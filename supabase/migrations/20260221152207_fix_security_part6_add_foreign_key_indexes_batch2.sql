/*
  # Security Fix Part 6: Add Foreign Key Indexes (Batch 2)

  This migration continues adding indexes for unindexed foreign keys.

  ## Indexes Added (Batch 2 of 3)
  - Digital products and modules
  - Merchandise (products, orders, items)
  - Messages
  - Monetization and revenue
  - Music system (albums, tracks, streams, royalties)

  ## Performance Impact
  - Optimizes creator dashboard queries
  - Improves monetization analytics
  - Speeds up music streaming queries
*/

-- Digital Products
CREATE INDEX IF NOT EXISTS idx_digital_products_creator_id ON digital_products(creator_id);
CREATE INDEX IF NOT EXISTS idx_digital_product_modules_product_id ON digital_product_modules(product_id);
CREATE INDEX IF NOT EXISTS idx_digital_product_purchases_customer_id ON digital_product_purchases(customer_id);

-- Merchandise
CREATE INDEX IF NOT EXISTS idx_merchandise_products_creator_id ON merchandise_products(creator_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_orders_creator_id ON merchandise_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_orders_customer_id ON merchandise_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_order_items_order_id ON merchandise_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_order_items_product_id ON merchandise_order_items(product_id);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_from_user_id ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_creator_id ON messages(to_creator_id);

-- Monetization & Revenue
CREATE INDEX IF NOT EXISTS idx_monetization_suspensions_user_id ON monetization_suspensions(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_holds_user_id ON revenue_holds(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_holds_investigation_id ON revenue_holds(investigation_id);
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_user_id ON revenue_transactions(user_id);

-- Music System
CREATE INDEX IF NOT EXISTS idx_music_albums_creator_id ON music_albums(creator_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_creator_id ON music_tracks(creator_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_album_id ON music_tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_primary_artist_id ON music_tracks(primary_artist_id);
CREATE INDEX IF NOT EXISTS idx_music_streams_track_id ON music_streams(track_id);
CREATE INDEX IF NOT EXISTS idx_music_streams_listener_id ON music_streams(listener_id);
CREATE INDEX IF NOT EXISTS idx_music_royalties_track_id ON music_royalties(track_id);
CREATE INDEX IF NOT EXISTS idx_music_royalties_recipient_id ON music_royalties(recipient_id);
