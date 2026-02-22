/*
  # RPC Functions for Advanced Games & Operations
  
  1. Game Operations
    - Start game session
    - Join game
    - Submit game action
    - Finalize game and distribute rewards
  
  2. Gift Pack Operations
    - Purchase gift pack
    - Apply pack bonuses
  
  3. Community Challenges
    - Create challenge
    - Contribute to challenge
    - Complete challenge
  
  4. Leaderboard Operations
    - Update rankings
    - Get top players
  
  5. Premiere Operations
    - Register for premiere
    - Grant VIP access
*/

-- Start Game Session
CREATE OR REPLACE FUNCTION rpc_start_game_session(
  p_stream_id uuid,
  p_game_type text,
  p_title text,
  p_config jsonb DEFAULT '{}'
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_creator_id uuid;
  v_session_id uuid;
BEGIN
  -- Verify stream ownership
  SELECT creator_id INTO v_creator_id
  FROM live_streams
  WHERE id = p_stream_id AND status = 'live';
  
  IF v_creator_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'STREAM_NOT_LIVE');
  END IF;
  
  IF v_creator_id != auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_AUTHORIZED');
  END IF;
  
  -- Create game session
  INSERT INTO live_game_sessions (
    stream_id,
    game_type,
    title,
    config,
    status
  ) VALUES (
    p_stream_id,
    p_game_type::live_game_type,
    p_title,
    p_config,
    'waiting'
  )
  RETURNING id INTO v_session_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'session_id', v_session_id
  );
END;
$$;

-- Join Game
CREATE OR REPLACE FUNCTION rpc_join_game(
  p_session_id uuid,
  p_bet_amount numeric DEFAULT 10
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id uuid;
  v_wallet_balance numeric;
  v_game_status text;
  v_current_participants integer;
  v_max_participants integer;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_AUTHENTICATED');
  END IF;
  
  -- Get game info
  SELECT status, current_participants, max_participants
  INTO v_game_status, v_current_participants, v_max_participants
  FROM live_game_sessions
  WHERE id = p_session_id;
  
  IF v_game_status != 'waiting' THEN
    RETURN jsonb_build_object('success', false, 'error', 'GAME_NOT_OPEN');
  END IF;
  
  IF v_current_participants >= v_max_participants THEN
    RETURN jsonb_build_object('success', false, 'error', 'GAME_FULL');
  END IF;
  
  -- Check wallet balance
  SELECT balance INTO v_wallet_balance
  FROM user_wallets
  WHERE user_id = v_user_id
  FOR UPDATE;
  
  IF v_wallet_balance < p_bet_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS');
  END IF;
  
  -- Deduct bet from wallet
  UPDATE user_wallets
  SET balance = balance - p_bet_amount,
      updated_at = now()
  WHERE user_id = v_user_id;
  
  -- Add to prize pool
  UPDATE live_game_sessions
  SET prize_pool = prize_pool + p_bet_amount,
      current_participants = current_participants + 1
  WHERE id = p_session_id;
  
  -- Record transaction
  INSERT INTO trucoin_transactions (
    user_id,
    amount,
    transaction_type,
    description
  ) VALUES (
    v_user_id,
    -p_bet_amount,
    'game_bet',
    'Bet on game ' || p_session_id
  );
  
  -- Add participant
  INSERT INTO live_game_participants (
    game_id,
    user_id,
    bet_amount
  ) VALUES (
    p_session_id,
    v_user_id,
    p_bet_amount
  );
  
  RETURN jsonb_build_object('success', true, 'bet_placed', p_bet_amount);
END;
$$;

-- Submit Game Action
CREATE OR REPLACE FUNCTION rpc_submit_game_action(
  p_session_id uuid,
  p_action_type text,
  p_action_data jsonb
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id uuid;
  v_game_status text;
  v_points numeric;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_AUTHENTICATED');
  END IF;
  
  -- Verify game is active
  SELECT status INTO v_game_status
  FROM live_game_sessions
  WHERE id = p_session_id;
  
  IF v_game_status != 'active' THEN
    RETURN jsonb_build_object('success', false, 'error', 'GAME_NOT_ACTIVE');
  END IF;
  
  -- Verify user is participant
  IF NOT EXISTS (
    SELECT 1 FROM live_game_participants
    WHERE game_id = p_session_id AND user_id = v_user_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_PARTICIPANT');
  END IF;
  
  -- Calculate points based on action
  v_points := COALESCE((p_action_data->>'points')::numeric, 0);
  
  -- Record action
  INSERT INTO live_game_actions (
    session_id,
    user_id,
    action_type,
    action_data,
    points_earned
  ) VALUES (
    p_session_id,
    v_user_id,
    p_action_type,
    p_action_data,
    v_points
  );
  
  -- Update participant score
  UPDATE live_game_participants
  SET score = score + v_points
  WHERE game_id = p_session_id AND user_id = v_user_id;
  
  RETURN jsonb_build_object('success', true, 'points_earned', v_points);
END;
$$;

-- Purchase Gift Pack
CREATE OR REPLACE FUNCTION rpc_purchase_gift_pack(
  p_pack_id uuid,
  p_stream_id uuid DEFAULT NULL
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id uuid;
  v_pack_price numeric;
  v_wallet_balance numeric;
  v_pack_contents jsonb;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_AUTHENTICATED');
  END IF;
  
  -- Get pack details
  SELECT final_price, contents INTO v_pack_price, v_pack_contents
  FROM live_gift_packs
  WHERE id = p_pack_id AND is_active = true;
  
  IF v_pack_price IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'PACK_NOT_FOUND');
  END IF;
  
  -- Check wallet
  SELECT balance INTO v_wallet_balance
  FROM user_wallets
  WHERE user_id = v_user_id
  FOR UPDATE;
  
  IF v_wallet_balance < v_pack_price THEN
    RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_FUNDS');
  END IF;
  
  -- Deduct from wallet
  UPDATE user_wallets
  SET balance = balance - v_pack_price,
      updated_at = now()
  WHERE user_id = v_user_id;
  
  -- Record purchase
  INSERT INTO live_gift_pack_purchases (
    user_id,
    pack_id,
    stream_id,
    price_paid
  ) VALUES (
    v_user_id,
    p_pack_id,
    p_stream_id,
    v_pack_price
  );
  
  -- Record transaction
  INSERT INTO trucoin_transactions (
    user_id,
    amount,
    transaction_type,
    description
  ) VALUES (
    v_user_id,
    -v_pack_price,
    'gift_pack_purchase',
    'Purchased gift pack'
  );
  
  -- Update pack sold count
  UPDATE live_gift_packs
  SET sold_count = sold_count + 1
  WHERE id = p_pack_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'contents', v_pack_contents
  );
END;
$$;

-- Create Community Challenge
CREATE OR REPLACE FUNCTION rpc_create_community_challenge(
  p_stream_id uuid,
  p_title text,
  p_description text,
  p_challenge_type text,
  p_goal_type text,
  p_goal_amount numeric
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_creator_id uuid;
  v_challenge_id uuid;
BEGIN
  -- Verify stream ownership
  SELECT creator_id INTO v_creator_id
  FROM live_streams
  WHERE id = p_stream_id AND status = 'live';
  
  IF v_creator_id != auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_AUTHORIZED');
  END IF;
  
  -- Create challenge
  INSERT INTO live_community_challenges (
    stream_id,
    title,
    description,
    challenge_type,
    goal_type,
    goal_amount,
    status
  ) VALUES (
    p_stream_id,
    p_title,
    p_description,
    p_challenge_type,
    p_goal_type,
    p_goal_amount,
    'active'
  )
  RETURNING id INTO v_challenge_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'challenge_id', v_challenge_id
  );
END;
$$;

-- Contribute to Challenge
CREATE OR REPLACE FUNCTION rpc_contribute_to_challenge(
  p_challenge_id uuid,
  p_contribution_amount numeric
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_amount numeric;
  v_goal_amount numeric;
  v_is_completed boolean;
BEGIN
  -- Update challenge progress
  UPDATE live_community_challenges
  SET current_amount = current_amount + p_contribution_amount
  WHERE id = p_challenge_id AND status = 'active'
  RETURNING current_amount, goal_amount INTO v_new_amount, v_goal_amount;
  
  v_is_completed := v_new_amount >= v_goal_amount;
  
  IF v_is_completed THEN
    UPDATE live_community_challenges
    SET status = 'completed',
        completed_at = now()
    WHERE id = p_challenge_id;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'current_amount', v_new_amount,
    'goal_amount', v_goal_amount,
    'is_completed', v_is_completed
  );
END;
$$;

-- Update Leaderboard
CREATE OR REPLACE FUNCTION rpc_update_leaderboard(
  p_stream_id uuid,
  p_category text,
  p_user_id uuid,
  p_score numeric
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_leaderboard_id uuid;
  v_new_rank integer;
BEGIN
  -- Get or create leaderboard
  SELECT id INTO v_leaderboard_id
  FROM live_leaderboards
  WHERE stream_id = p_stream_id
  AND category = p_category::leaderboard_category
  AND period = 'stream'
  AND is_active = true;
  
  IF v_leaderboard_id IS NULL THEN
    INSERT INTO live_leaderboards (
      stream_id,
      category,
      period,
      period_start,
      period_end
    ) VALUES (
      p_stream_id,
      p_category::leaderboard_category,
      'stream',
      now(),
      now() + interval '24 hours'
    )
    RETURNING id INTO v_leaderboard_id;
  END IF;
  
  -- Upsert entry
  INSERT INTO live_leaderboard_entries (
    leaderboard_id,
    user_id,
    score,
    rank
  ) VALUES (
    v_leaderboard_id,
    p_user_id,
    p_score,
    1
  )
  ON CONFLICT (leaderboard_id, user_id) DO UPDATE
  SET score = GREATEST(live_leaderboard_entries.score, p_score),
      last_updated = now();
  
  -- Recalculate ranks
  WITH ranked_entries AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
    FROM live_leaderboard_entries
    WHERE leaderboard_id = v_leaderboard_id
  )
  UPDATE live_leaderboard_entries le
  SET rank = re.new_rank
  FROM ranked_entries re
  WHERE le.id = re.id;
  
  -- Get user's new rank
  SELECT rank INTO v_new_rank
  FROM live_leaderboard_entries
  WHERE leaderboard_id = v_leaderboard_id AND user_id = p_user_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'rank', v_new_rank,
    'score', p_score
  );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION rpc_start_game_session TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_join_game TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_submit_game_action TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_purchase_gift_pack TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_create_community_challenge TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_contribute_to_challenge TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_update_leaderboard TO authenticated;
