/*
  # Fix Missing Foreign Key Indexes - Batch 2
  
  Add indexes for foreign keys on tables D-L
*/

-- digital_product_modules
CREATE INDEX IF NOT EXISTS idx_digital_product_modules_product_id ON digital_product_modules(product_id);

-- digital_product_purchases
CREATE INDEX IF NOT EXISTS idx_digital_product_purchases_customer_id ON digital_product_purchases(customer_id);

-- digital_products
CREATE INDEX IF NOT EXISTS idx_digital_products_creator_id ON digital_products(creator_id);

-- game_interactions
CREATE INDEX IF NOT EXISTS idx_game_interactions_user_id ON game_interactions(user_id);

-- game_tournaments
CREATE INDEX IF NOT EXISTS idx_game_tournaments_created_by ON game_tournaments(created_by);

-- gaming_leaderboards
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_season_id ON gaming_leaderboards(season_id);

-- gaming_tournaments
CREATE INDEX IF NOT EXISTS idx_gaming_tournaments_created_by ON gaming_tournaments(created_by);

-- live_chat_messages
CREATE INDEX IF NOT EXISTS idx_live_chat_messages_deleted_by ON live_chat_messages(deleted_by);
CREATE INDEX IF NOT EXISTS idx_live_chat_messages_user_id ON live_chat_messages(user_id);

-- live_effects_history
CREATE INDEX IF NOT EXISTS idx_live_effects_history_triggered_by_user ON live_effects_history(triggered_by_user);

-- live_game_rewards
CREATE INDEX IF NOT EXISTS idx_live_game_rewards_session_id ON live_game_rewards(session_id);

-- live_game_sessions
CREATE INDEX IF NOT EXISTS idx_live_game_sessions_template_id ON live_game_sessions(template_id);

-- live_gift_pack_purchases
CREATE INDEX IF NOT EXISTS idx_live_gift_pack_purchases_pack_id ON live_gift_pack_purchases(pack_id);
CREATE INDEX IF NOT EXISTS idx_live_gift_pack_purchases_stream_id ON live_gift_pack_purchases(stream_id);

-- live_gift_transactions
CREATE INDEX IF NOT EXISTS idx_live_gift_transactions_transaction_id ON live_gift_transactions(transaction_id);

-- live_leaderboard_entries
CREATE INDEX IF NOT EXISTS idx_live_leaderboard_entries_user_id ON live_leaderboard_entries(user_id);