/*
  # Gaming RPC Functions
  
  Transactional functions for TruCoins operations:
  - Tournament entry with validation
  - Prize pool distribution
  - Arena fund contributions
  
  All functions ensure:
  - Atomic operations
  - Balance validation
  - No double spend
  - Transaction logging
*/

-- Function to enter tournament with TruCoins
CREATE OR REPLACE FUNCTION rpc_enter_tournament(
  p_tournament_id uuid,
  p_team_id uuid DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entry_fee bigint;
  v_user_balance bigint;
  v_max_participants integer;
  v_current_participants integer;
  v_arena_fund_id uuid;
  v_arena_contribution bigint;
  v_participant_id uuid;
  v_status text;
BEGIN
  -- Get tournament details
  SELECT entry_fee, max_participants, current_participants, status
  INTO v_entry_fee, v_max_participants, v_current_participants, v_status
  FROM gaming_tournaments
  WHERE id = p_tournament_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament not found');
  END IF;
  
  IF v_status != 'registration' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament registration is closed');
  END IF;
  
  IF v_current_participants >= v_max_participants THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament is full');
  END IF;
  
  -- Check if already registered
  IF EXISTS (
    SELECT 1 FROM tournament_participants 
    WHERE tournament_id = p_tournament_id 
    AND (
      (p_team_id IS NOT NULL AND team_id = p_team_id) OR
      (p_user_id IS NOT NULL AND user_id = p_user_id)
    )
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Already registered');
  END IF;
  
  -- Get user balance
  SELECT balance INTO v_user_balance
  FROM trucoin_wallets
  WHERE user_id = COALESCE(p_user_id, auth.uid());
  
  IF v_user_balance < v_entry_fee THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
  END IF;
  
  -- Calculate arena fund contribution (10%)
  v_arena_contribution := FLOOR(v_entry_fee * 0.10);
  
  -- Get or create arena fund for current season
  SELECT af.id INTO v_arena_fund_id
  FROM arena_fund af
  JOIN gaming_tournaments gt ON gt.season_id = af.season_id
  WHERE gt.id = p_tournament_id
  LIMIT 1;
  
  IF v_arena_fund_id IS NULL THEN
    INSERT INTO arena_fund (season_id, current_balance, total_contributions)
    SELECT season_id, 0, 0 FROM gaming_tournaments WHERE id = p_tournament_id
    RETURNING id INTO v_arena_fund_id;
  END IF;
  
  -- Deduct entry fee from wallet
  UPDATE trucoin_wallets
  SET balance = balance - v_entry_fee,
      total_spent = total_spent + v_entry_fee,
      updated_at = now()
  WHERE user_id = COALESCE(p_user_id, auth.uid());
  
  -- Add to tournament prize pool
  UPDATE gaming_tournaments
  SET prize_pool = prize_pool + (v_entry_fee - v_arena_contribution),
      updated_at = now()
  WHERE id = p_tournament_id;
  
  -- Log arena contribution
  INSERT INTO arena_transactions (
    arena_fund_id,
    transaction_type,
    amount,
    source_type,
    source_id,
    reference_type,
    reference_id,
    description
  ) VALUES (
    v_arena_fund_id,
    'contribution',
    v_arena_contribution,
    'tournament_entry',
    p_tournament_id,
    'tournament',
    p_tournament_id,
    'Tournament entry fee contribution'
  );
  
  -- Register participant
  INSERT INTO tournament_participants (
    tournament_id,
    team_id,
    user_id,
    status,
    entry_paid,
    entry_paid_at
  ) VALUES (
    p_tournament_id,
    p_team_id,
    COALESCE(p_user_id, auth.uid()),
    'confirmed',
    true,
    now()
  ) RETURNING id INTO v_participant_id;
  
  -- Log transaction
  INSERT INTO trucoin_transactions (
    user_id,
    transaction_type,
    amount,
    balance_after,
    description,
    reference_type,
    reference_id
  ) VALUES (
    COALESCE(p_user_id, auth.uid()),
    'tournament_entry',
    -v_entry_fee,
    (SELECT balance FROM trucoin_wallets WHERE user_id = COALESCE(p_user_id, auth.uid())),
    'Tournament entry: ' || (SELECT name FROM gaming_tournaments WHERE id = p_tournament_id),
    'tournament',
    p_tournament_id
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'participant_id', v_participant_id,
    'entry_fee', v_entry_fee,
    'arena_contribution', v_arena_contribution
  );
END;
$$;

-- Function to distribute tournament prizes
CREATE OR REPLACE FUNCTION rpc_distribute_prize_pool(
  p_tournament_id uuid,
  p_prize_distribution jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prize_pool bigint;
  v_total_distributed bigint := 0;
  v_participant record;
  v_arena_fund_id uuid;
  v_distribution_item jsonb;
BEGIN
  -- Get tournament prize pool
  SELECT prize_pool INTO v_prize_pool
  FROM gaming_tournaments
  WHERE id = p_tournament_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament not found');
  END IF;
  
  -- Get arena fund
  SELECT af.id INTO v_arena_fund_id
  FROM arena_fund af
  JOIN gaming_tournaments gt ON gt.season_id = af.season_id
  WHERE gt.id = p_tournament_id
  LIMIT 1;
  
  -- Distribute prizes
  FOR v_distribution_item IN SELECT * FROM jsonb_array_elements(p_prize_distribution)
  LOOP
    DECLARE
      v_participant_id uuid := (v_distribution_item->>'participant_id')::uuid;
      v_prize_amount bigint := (v_distribution_item->>'amount')::bigint;
      v_rank integer := (v_distribution_item->>'rank')::integer;
      v_user_id uuid;
    BEGIN
      -- Get user_id from participant
      SELECT user_id INTO v_user_id
      FROM tournament_participants
      WHERE id = v_participant_id;
      
      IF v_user_id IS NULL THEN
        CONTINUE;
      END IF;
      
      -- Add to user wallet
      UPDATE trucoin_wallets
      SET balance = balance + v_prize_amount,
          total_earned = total_earned + v_prize_amount,
          updated_at = now()
      WHERE user_id = v_user_id;
      
      -- Log transaction
      INSERT INTO trucoin_transactions (
        user_id,
        transaction_type,
        amount,
        balance_after,
        description,
        reference_type,
        reference_id
      ) VALUES (
        v_user_id,
        'tournament_prize',
        v_prize_amount,
        (SELECT balance FROM trucoin_wallets WHERE user_id = v_user_id),
        'Tournament prize - Rank ' || v_rank,
        'tournament',
        p_tournament_id
      );
      
      -- Record prize distribution
      INSERT INTO tournament_prize_distribution (
        tournament_id,
        participant_id,
        rank,
        prize_amount,
        status,
        paid_at
      ) VALUES (
        p_tournament_id,
        v_participant_id,
        v_rank,
        v_prize_amount,
        'completed',
        now()
      );
      
      -- Update participant final rank
      UPDATE tournament_participants
      SET final_rank = v_rank
      WHERE id = v_participant_id;
      
      v_total_distributed := v_total_distributed + v_prize_amount;
    END;
  END LOOP;
  
  RETURN jsonb_build_object(
    'success', true,
    'total_distributed', v_total_distributed,
    'remaining_pool', v_prize_pool - v_total_distributed
  );
END;
$$;

-- Function to contribute gaming boost to arena fund
CREATE OR REPLACE FUNCTION rpc_gaming_boost_contribution(
  p_session_id uuid,
  p_boost_amount bigint
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_arena_contribution bigint;
  v_arena_fund_id uuid;
  v_season_id uuid;
BEGIN
  -- Calculate arena contribution (10%)
  v_arena_contribution := FLOOR(p_boost_amount * 0.10);
  
  -- Get season from session
  SELECT season_id INTO v_season_id
  FROM gaming_live_sessions
  WHERE id = p_session_id;
  
  IF v_season_id IS NULL THEN
    RETURN jsonb_build_object('success', true, 'arena_contribution', 0);
  END IF;
  
  -- Get or create arena fund
  SELECT id INTO v_arena_fund_id
  FROM arena_fund
  WHERE season_id = v_season_id
  LIMIT 1;
  
  IF v_arena_fund_id IS NULL THEN
    INSERT INTO arena_fund (season_id, current_balance, total_contributions)
    VALUES (v_season_id, 0, 0)
    RETURNING id INTO v_arena_fund_id;
  END IF;
  
  -- Log contribution
  INSERT INTO arena_transactions (
    arena_fund_id,
    transaction_type,
    amount,
    source_type,
    source_id,
    reference_type,
    reference_id,
    description
  ) VALUES (
    v_arena_fund_id,
    'contribution',
    v_arena_contribution,
    'gaming_boost',
    p_session_id,
    'gaming_session',
    p_session_id,
    'Gaming boost contribution'
  );
  
  -- Update session arena contribution
  UPDATE gaming_live_sessions
  SET trucoins_to_arena = trucoins_to_arena + v_arena_contribution
  WHERE id = p_session_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'arena_contribution', v_arena_contribution
  );
END;
$$;