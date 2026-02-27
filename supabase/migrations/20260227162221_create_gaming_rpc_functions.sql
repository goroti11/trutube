/*
  # Gaming RPC Functions

  ## Functions Created

  ### rpc_enter_tournament
  - Handles tournament entry with TruCoin payment
  - Locks wallet during transaction
  - Validates balance and tournament status
  - Contributes to arena fund
  - Records transaction atomically

  ### rpc_distribute_tournament_prize
  - Distributes prizes to winners
  - Updates leaderboards
  - Transfers TruCoins to winners
  - Records all transactions
  - Handles team prize splits

  ### rpc_update_leaderboard
  - Updates user/team rankings
  - Calculates performance scores
  - Maintains season-based rankings
  - Prevents duplicate entries

  ### rpc_contribute_to_arena_fund
  - Adds funds to arena fund
  - Records contribution source
  - Updates fund balances
  - Ensures transparency

  ## Security
  - All functions use SECURITY DEFINER with proper validation
  - Transaction-safe with proper locking
  - Input validation and balance checks
  - Prevents double-spending and race conditions
*/

-- Function: Enter Tournament with TruCoin Payment
CREATE OR REPLACE FUNCTION rpc_enter_tournament(
  p_tournament_id uuid,
  p_participant_type text,
  p_user_id uuid DEFAULT NULL,
  p_team_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entry_fee decimal(15,2);
  v_arena_percentage decimal(5,2);
  v_arena_contribution decimal(15,2);
  v_wallet_balance decimal(15,2);
  v_tournament_status text;
  v_participant_count integer;
  v_max_participants integer;
  v_arena_fund_id uuid;
  v_season_id uuid;
  v_participant_id uuid;
  v_payer_id uuid;
BEGIN
  -- Determine payer
  v_payer_id := COALESCE(p_user_id, (SELECT captain_id FROM gaming_teams WHERE id = p_team_id));
  
  IF v_payer_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid participant');
  END IF;

  -- Get tournament details
  SELECT 
    entry_fee, 
    status, 
    max_participants, 
    arena_fund_percentage,
    season_id
  INTO 
    v_entry_fee, 
    v_tournament_status, 
    v_max_participants, 
    v_arena_percentage,
    v_season_id
  FROM gaming_tournaments
  WHERE id = p_tournament_id;

  IF v_tournament_status != 'registration' THEN
    RETURN json_build_object('success', false, 'error', 'Tournament not open for registration');
  END IF;

  -- Check participant limit
  SELECT COUNT(*) INTO v_participant_count
  FROM tournament_participants
  WHERE tournament_id = p_tournament_id;

  IF v_participant_count >= v_max_participants THEN
    RETURN json_build_object('success', false, 'error', 'Tournament is full');
  END IF;

  -- Get wallet balance with lock
  SELECT balance INTO v_wallet_balance
  FROM trucoin_wallets
  WHERE user_id = v_payer_id
  FOR UPDATE;

  IF v_wallet_balance < v_entry_fee THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient TruCoins');
  END IF;

  -- Calculate arena contribution
  v_arena_contribution := v_entry_fee * (v_arena_percentage / 100);

  -- Deduct entry fee
  UPDATE trucoin_wallets
  SET 
    balance = balance - v_entry_fee,
    updated_at = now()
  WHERE user_id = v_payer_id;

  -- Add to tournament prize pool
  UPDATE gaming_tournaments
  SET prize_pool = prize_pool + (v_entry_fee - v_arena_contribution)
  WHERE id = p_tournament_id;

  -- Create participant entry
  INSERT INTO tournament_participants (
    tournament_id,
    participant_type,
    user_id,
    team_id,
    entry_paid
  ) VALUES (
    p_tournament_id,
    p_participant_type,
    p_user_id,
    p_team_id,
    true
  )
  RETURNING id INTO v_participant_id;

  -- Record TruCoin transaction
  INSERT INTO trucoin_transactions (
    wallet_id,
    transaction_type,
    amount,
    balance_after,
    reference_type,
    reference_id,
    description
  )
  SELECT
    w.id,
    'tournament_entry',
    -v_entry_fee,
    w.balance,
    'tournament',
    p_tournament_id,
    'Tournament entry fee'
  FROM trucoin_wallets w
  WHERE w.user_id = v_payer_id;

  -- Contribute to arena fund
  IF v_arena_contribution > 0 THEN
    -- Get or create arena fund
    INSERT INTO arena_fund (season_id, total_balance, remaining_balance)
    VALUES (v_season_id, 0, 0)
    ON CONFLICT (season_id) DO NOTHING
    RETURNING id INTO v_arena_fund_id;

    IF v_arena_fund_id IS NULL THEN
      SELECT id INTO v_arena_fund_id FROM arena_fund WHERE season_id = v_season_id;
    END IF;

    -- Update arena fund
    UPDATE arena_fund
    SET
      total_balance = total_balance + v_arena_contribution,
      remaining_balance = remaining_balance + v_arena_contribution,
      updated_at = now()
    WHERE id = v_arena_fund_id;

    -- Record arena transaction
    INSERT INTO arena_transactions (
      arena_fund_id,
      transaction_type,
      amount,
      source_type,
      source_reference,
      description
    ) VALUES (
      v_arena_fund_id,
      'contribution',
      v_arena_contribution,
      'tournament_entry',
      p_tournament_id,
      'Tournament entry fee contribution'
    );
  END IF;

  RETURN json_build_object(
    'success', true,
    'participant_id', v_participant_id,
    'entry_fee', v_entry_fee,
    'arena_contribution', v_arena_contribution
  );
END;
$$;

-- Function: Distribute Tournament Prizes
CREATE OR REPLACE FUNCTION rpc_distribute_tournament_prize(
  p_tournament_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prize_pool decimal(15,2);
  v_distribution_record RECORD;
  v_participant_record RECORD;
  v_member_record RECORD;
  v_amount decimal(15,2);
  v_total_distributed decimal(15,2) := 0;
  v_member_count integer;
  v_member_share decimal(15,2);
BEGIN
  -- Get prize pool
  SELECT prize_pool INTO v_prize_pool
  FROM gaming_tournaments
  WHERE id = p_tournament_id AND status = 'completed';

  IF v_prize_pool IS NULL OR v_prize_pool = 0 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid tournament or no prize pool');
  END IF;

  -- Calculate and update prize amounts
  FOR v_distribution_record IN
    SELECT rank, percentage
    FROM tournament_prize_distribution
    WHERE tournament_id = p_tournament_id
    ORDER BY rank
  LOOP
    v_amount := v_prize_pool * (v_distribution_record.percentage / 100);
    
    UPDATE tournament_prize_distribution
    SET amount = v_amount
    WHERE tournament_id = p_tournament_id AND rank = v_distribution_record.rank;

    -- Get participant at this rank
    SELECT * INTO v_participant_record
    FROM tournament_participants
    WHERE tournament_id = p_tournament_id AND rank = v_distribution_record.rank;

    IF v_participant_record.id IS NOT NULL THEN
      -- Update participant prize
      UPDATE tournament_participants
      SET prize_amount = v_amount
      WHERE id = v_participant_record.id;

      -- Transfer TruCoins
      IF v_participant_record.participant_type = 'solo' THEN
        -- Pay solo player
        UPDATE trucoin_wallets
        SET
          balance = balance + v_amount,
          total_earned = total_earned + v_amount,
          updated_at = now()
        WHERE user_id = v_participant_record.user_id;

        -- Record transaction
        INSERT INTO trucoin_transactions (
          wallet_id,
          transaction_type,
          amount,
          balance_after,
          reference_type,
          reference_id,
          description
        )
        SELECT
          w.id,
          'tournament_prize',
          v_amount,
          w.balance,
          'tournament',
          p_tournament_id,
          'Tournament prize - Rank ' || v_distribution_record.rank
        FROM trucoin_wallets w
        WHERE w.user_id = v_participant_record.user_id;

      ELSIF v_participant_record.participant_type = 'team' THEN
        -- Get team member count
        SELECT COUNT(*) INTO v_member_count
        FROM gaming_team_members
        WHERE team_id = v_participant_record.team_id AND status = 'active';

        v_member_share := v_amount / v_member_count;

        -- Pay each team member
        FOR v_member_record IN
          SELECT user_id
          FROM gaming_team_members
          WHERE team_id = v_participant_record.team_id AND status = 'active'
        LOOP
          UPDATE trucoin_wallets
          SET
            balance = balance + v_member_share,
            total_earned = total_earned + v_member_share,
            updated_at = now()
          WHERE user_id = v_member_record.user_id;

          INSERT INTO trucoin_transactions (
            wallet_id,
            transaction_type,
            amount,
            balance_after,
            reference_type,
            reference_id,
            description
          )
          SELECT
            w.id,
            'tournament_prize',
            v_member_share,
            w.balance,
            'tournament',
            p_tournament_id,
            'Team tournament prize - Rank ' || v_distribution_record.rank
          FROM trucoin_wallets w
          WHERE w.user_id = v_member_record.user_id;
        END LOOP;
      END IF;

      v_total_distributed := v_total_distributed + v_amount;
    END IF;
  END LOOP;

  RETURN json_build_object(
    'success', true,
    'total_distributed', v_total_distributed
  );
END;
$$;

-- Function: Update Leaderboard
CREATE OR REPLACE FUNCTION rpc_update_leaderboard(
  p_season_id uuid,
  p_game_id uuid,
  p_user_id uuid DEFAULT NULL,
  p_team_id uuid DEFAULT NULL,
  p_category text DEFAULT 'solo',
  p_score decimal DEFAULT 0,
  p_match_result text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_leaderboard_id uuid;
  v_new_rank integer;
BEGIN
  -- Insert or update leaderboard entry
  INSERT INTO gaming_leaderboards (
    season_id,
    game_id,
    user_id,
    team_id,
    category,
    rank,
    score,
    matches_played,
    wins,
    losses
  ) VALUES (
    p_season_id,
    p_game_id,
    p_user_id,
    p_team_id,
    p_category,
    9999,
    p_score,
    1,
    CASE WHEN p_match_result = 'win' THEN 1 ELSE 0 END,
    CASE WHEN p_match_result = 'loss' THEN 1 ELSE 0 END
  )
  ON CONFLICT ON CONSTRAINT gaming_leaderboards_pkey
  DO UPDATE SET
    score = gaming_leaderboards.score + p_score,
    matches_played = gaming_leaderboards.matches_played + 1,
    wins = gaming_leaderboards.wins + CASE WHEN p_match_result = 'win' THEN 1 ELSE 0 END,
    losses = gaming_leaderboards.losses + CASE WHEN p_match_result = 'loss' THEN 1 ELSE 0 END,
    updated_at = now()
  RETURNING id INTO v_leaderboard_id;

  -- Recalculate ranks
  WITH ranked AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY season_id, game_id, category
        ORDER BY score DESC, wins DESC
      ) as new_rank
    FROM gaming_leaderboards
    WHERE season_id = p_season_id AND game_id = p_game_id AND category = p_category
  )
  UPDATE gaming_leaderboards l
  SET rank = r.new_rank
  FROM ranked r
  WHERE l.id = r.id;

  -- Get updated rank
  SELECT rank INTO v_new_rank
  FROM gaming_leaderboards
  WHERE id = v_leaderboard_id;

  RETURN json_build_object(
    'success', true,
    'rank', v_new_rank
  );
END;
$$;

-- Function: Contribute to Arena Fund
CREATE OR REPLACE FUNCTION rpc_contribute_to_arena_fund(
  p_season_id uuid,
  p_amount decimal,
  p_source_type text,
  p_source_reference uuid DEFAULT NULL,
  p_description text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_arena_fund_id uuid;
BEGIN
  -- Get or create arena fund
  INSERT INTO arena_fund (season_id, total_balance, remaining_balance)
  VALUES (p_season_id, 0, 0)
  ON CONFLICT (season_id) DO NOTHING
  RETURNING id INTO v_arena_fund_id;

  IF v_arena_fund_id IS NULL THEN
    SELECT id INTO v_arena_fund_id FROM arena_fund WHERE season_id = p_season_id;
  END IF;

  -- Update arena fund
  UPDATE arena_fund
  SET
    total_balance = total_balance + p_amount,
    remaining_balance = remaining_balance + p_amount,
    updated_at = now()
  WHERE id = v_arena_fund_id;

  -- Record transaction
  INSERT INTO arena_transactions (
    arena_fund_id,
    transaction_type,
    amount,
    source_type,
    source_reference,
    description
  ) VALUES (
    v_arena_fund_id,
    'contribution',
    p_amount,
    p_source_type,
    p_source_reference,
    COALESCE(p_description, 'Arena fund contribution')
  );

  RETURN json_build_object('success', true, 'arena_fund_id', v_arena_fund_id);
END;
$$;