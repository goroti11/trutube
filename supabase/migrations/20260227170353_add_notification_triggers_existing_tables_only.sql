/*
  # Add Notification Triggers for Existing Tables

  Add triggers only for tables that exist in the database
*/

-- Function to queue notification
CREATE OR REPLACE FUNCTION queue_notification(
  p_user_id uuid,
  p_actor_id uuid,
  p_entity_type text,
  p_entity_id uuid,
  p_notification_type text,
  p_data jsonb DEFAULT '{}',
  p_priority integer DEFAULT 2
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO notification_queue (
    user_id,
    actor_id,
    entity_type,
    entity_id,
    notification_type,
    data,
    priority
  ) VALUES (
    p_user_id,
    p_actor_id,
    p_entity_type,
    p_entity_id,
    p_notification_type,
    p_data,
    p_priority
  );
END;
$$;

-- Trigger: New subscriber
CREATE OR REPLACE FUNCTION notify_new_subscriber()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM queue_notification(
    NEW.channel_id,
    NEW.user_id,
    'subscription',
    NEW.id,
    'community_new_follower',
    jsonb_build_object('count', 1),
    2
  );
  
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions') THEN
    DROP TRIGGER IF EXISTS trigger_notify_new_subscriber ON subscriptions;
    CREATE TRIGGER trigger_notify_new_subscriber
      AFTER INSERT ON subscriptions
      FOR EACH ROW EXECUTE FUNCTION notify_new_subscriber();
  END IF;
END $$;

-- Trigger: Live gift received
CREATE OR REPLACE FUNCTION notify_live_gift_received()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recipient_id uuid;
  v_gift_name text;
BEGIN
  SELECT streamer_id INTO v_recipient_id
  FROM live_streams
  WHERE id = NEW.stream_id;
  
  SELECT name INTO v_gift_name
  FROM live_gifts
  WHERE id = NEW.gift_id;
  
  PERFORM queue_notification(
    v_recipient_id,
    NEW.sender_id,
    'gift',
    NEW.id,
    'gift_received',
    jsonb_build_object('gift', v_gift_name, 'amount', NEW.trucoin_amount, 'count', 1),
    3
  );
  
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'live_gift_transactions') THEN
    DROP TRIGGER IF EXISTS trigger_notify_live_gift_received ON live_gift_transactions;
    CREATE TRIGGER trigger_notify_live_gift_received
      AFTER INSERT ON live_gift_transactions
      FOR EACH ROW EXECUTE FUNCTION notify_live_gift_received();
  END IF;
END $$;

-- Trigger: TruCoin earnings
CREATE OR REPLACE FUNCTION notify_trucoin_earnings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.transaction_type IN ('earnings', 'gift_received', 'revenue') AND NEW.amount > 0 THEN
    PERFORM queue_notification(
      NEW.user_id,
      NULL,
      'trucoin',
      NEW.id,
      'trucoin_earnings',
      jsonb_build_object('amount', NEW.amount),
      3
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wallet_transactions') THEN
    DROP TRIGGER IF EXISTS trigger_notify_trucoin_earnings ON wallet_transactions;
    CREATE TRIGGER trigger_notify_trucoin_earnings
      AFTER INSERT ON wallet_transactions
      FOR EACH ROW EXECUTE FUNCTION notify_trucoin_earnings();
  END IF;
END $$;

-- Trigger: Gaming duel launched
CREATE OR REPLACE FUNCTION notify_gaming_duel()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.player2_id IS NOT NULL THEN
    PERFORM queue_notification(
      NEW.player2_id,
      NEW.player1_id,
      'gaming',
      NEW.id,
      'gaming_duel_launched',
      jsonb_build_object(),
      3
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gaming_matches') THEN
    DROP TRIGGER IF EXISTS trigger_notify_gaming_duel ON gaming_matches;
    CREATE TRIGGER trigger_notify_gaming_duel
      AFTER INSERT ON gaming_matches
      FOR EACH ROW EXECUTE FUNCTION notify_gaming_duel();
  END IF;
END $$;

-- Trigger: Gaming victory
CREATE OR REPLACE FUNCTION notify_gaming_victory()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_loser_id uuid;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    IF NEW.winner_id = NEW.player1_id THEN
      v_loser_id := NEW.player2_id;
    ELSE
      v_loser_id := NEW.player1_id;
    END IF;
    
    PERFORM queue_notification(
      NEW.winner_id,
      v_loser_id,
      'gaming',
      NEW.id,
      'gaming_victory',
      jsonb_build_object(),
      3
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gaming_matches') THEN
    DROP TRIGGER IF EXISTS trigger_notify_gaming_victory ON gaming_matches;
    CREATE TRIGGER trigger_notify_gaming_victory
      AFTER UPDATE ON gaming_matches
      FOR EACH ROW EXECUTE FUNCTION notify_gaming_victory();
  END IF;
END $$;

-- Trigger: Community post liked
CREATE OR REPLACE FUNCTION notify_post_liked()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_owner uuid;
BEGIN
  SELECT user_id INTO v_post_owner
  FROM community_posts
  WHERE id = NEW.post_id;
  
  IF v_post_owner != NEW.user_id THEN
    PERFORM queue_notification(
      v_post_owner,
      NEW.user_id,
      'community',
      NEW.post_id,
      'community_post_liked',
      jsonb_build_object('count', 1),
      2
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'post_likes') THEN
    DROP TRIGGER IF EXISTS trigger_notify_post_liked ON post_likes;
    CREATE TRIGGER trigger_notify_post_liked
      AFTER INSERT ON post_likes
      FOR EACH ROW EXECUTE FUNCTION notify_post_liked();
  END IF;
END $$;

-- Trigger: Community post comment
CREATE OR REPLACE FUNCTION notify_post_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_owner uuid;
BEGIN
  SELECT user_id INTO v_post_owner
  FROM community_posts
  WHERE id = NEW.post_id;
  
  IF v_post_owner != NEW.user_id THEN
    PERFORM queue_notification(
      v_post_owner,
      NEW.user_id,
      'community',
      NEW.post_id,
      'community_post_comment',
      jsonb_build_object('count', 1),
      2
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'post_comments') THEN
    DROP TRIGGER IF EXISTS trigger_notify_post_comment ON post_comments;
    CREATE TRIGGER trigger_notify_post_comment
      AFTER INSERT ON post_comments
      FOR EACH ROW EXECUTE FUNCTION notify_post_comment();
  END IF;
END $$;
