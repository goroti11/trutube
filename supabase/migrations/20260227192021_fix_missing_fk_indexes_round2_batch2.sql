/*
  # Fix Missing Foreign Key Indexes - Round 2 Batch 2

  1. New Indexes Added (20 indexes)
    - creator_universes.main_universe_id
    - digital_product_modules.product_id
    - digital_products.creator_id
    - dm_messages.conversation_id, sender_id
    - forum_posts.author_id, parent_post_id, thread_id
    - forum_threads.author_id, forum_id
    - forums.universe_id
    - fraud_detection_logs.user_id
    - games.publisher_id
    - gaming_leaderboards.season_id, team_id, user_id
    - gaming_live_sessions.game_id, streamer_id
    - gaming_reports.reported_user_id
    - gaming_sanctions.user_id
    - gaming_stream_stats.session_id

  2. Performance Impact
    - Continues improving query performance across all system modules
*/

CREATE INDEX IF NOT EXISTS idx_creator_universes_main_universe_id_fk ON creator_universes(main_universe_id);
CREATE INDEX IF NOT EXISTS idx_digital_product_modules_product_id_fk ON digital_product_modules(product_id);
CREATE INDEX IF NOT EXISTS idx_digital_products_creator_id_fk ON digital_products(creator_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_conversation_id_fk ON dm_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_sender_id_fk ON dm_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id_fk ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent_post_id_fk ON forum_posts(parent_post_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_thread_id_fk ON forum_posts(thread_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_author_id_fk ON forum_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_forum_id_fk ON forum_threads(forum_id);
CREATE INDEX IF NOT EXISTS idx_forums_universe_id_fk ON forums(universe_id);
CREATE INDEX IF NOT EXISTS idx_fraud_detection_logs_user_id_fk ON fraud_detection_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_games_publisher_id_fk ON games(publisher_id);
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_season_id_fk ON gaming_leaderboards(season_id);
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_team_id_fk ON gaming_leaderboards(team_id);
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_user_id_fk ON gaming_leaderboards(user_id);
CREATE INDEX IF NOT EXISTS idx_gaming_live_sessions_game_id_fk ON gaming_live_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_gaming_live_sessions_streamer_id_fk ON gaming_live_sessions(streamer_id);
CREATE INDEX IF NOT EXISTS idx_gaming_reports_reported_user_id_fk ON gaming_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_gaming_sanctions_user_id_fk ON gaming_sanctions(user_id);
CREATE INDEX IF NOT EXISTS idx_gaming_stream_stats_session_id_fk ON gaming_stream_stats(session_id);
