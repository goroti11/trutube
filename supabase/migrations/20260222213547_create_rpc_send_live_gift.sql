/*
  # RPC Function: Send Live Gift
  
  1. Purpose
    - Atomic transaction to send a live gift using TruCoins
    - Prevents double-spend with row-level locking
    - Updates sender and recipient wallets
    - Records transaction in ledger
    
  2. Parameters
    - p_gift_id (uuid): ID of the gift to send
    - p_recipient_id (uuid): ID of the creator receiving the gift
    - p_stream_id (uuid): ID of the live stream
    - p_message (text): Optional message with gift
    - p_is_anonymous (boolean): Hide sender identity
    
  3. Returns
    - JSON object with success status and transaction details
    
  4. Security
    - SECURITY DEFINER to access all tables
    - Validates authenticated user
    - Checks gift exists and is active
    - Verifies sufficient balance
    - Prevents sending to self
    - Uses FOR UPDATE to lock wallet rows
    
  5. Transaction Flow
    1. Lock sender wallet (FOR UPDATE)
    2. Verify balance >= gift price
    3. Lock recipient wallet (FOR UPDATE)
    4. Calculate commission (20%) and net amount
    5. Debit sender wallet
    6. Credit recipient wallet
    7. Insert trucoin_transaction record
    8. Insert live_gift_transaction record
    9. Return success response
*/

CREATE OR REPLACE FUNCTION rpc_send_live_gift(
  p_gift_id uuid,
  p_recipient_id uuid,
  p_stream_id uuid,
  p_message text DEFAULT NULL,
  p_is_anonymous boolean DEFAULT false
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_sender_id uuid;
  v_gift_price numeric(10,2);
  v_gift_name text;
  v_sender_balance numeric(10,2);
  v_commission_rate numeric := 0.20; -- 20% platform commission
  v_commission_amount numeric(10,2);
  v_net_amount numeric(10,2);
  v_transaction_id uuid;
  v_gift_transaction_id uuid;
  v_sender_version bigint;
  v_recipient_version bigint;
BEGIN
  -- Get authenticated user
  v_sender_id := auth.uid();
  
  IF v_sender_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'NOT_AUTHENTICATED',
      'message', 'User must be authenticated'
    );
  END IF;
  
  -- Validate not sending to self
  IF v_sender_id = p_recipient_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'INVALID_RECIPIENT',
      'message', 'Cannot send gift to yourself'
    );
  END IF;
  
  -- Get and validate gift (must be active)
  SELECT trucoin_price, name INTO v_gift_price, v_gift_name
  FROM live_gifts
  WHERE id = p_gift_id AND is_active = true;
  
  IF v_gift_price IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'GIFT_NOT_FOUND',
      'message', 'Gift not found or inactive'
    );
  END IF;
  
  -- Validate recipient exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_recipient_id) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'RECIPIENT_NOT_FOUND',
      'message', 'Recipient does not exist'
    );
  END IF;
  
  -- Lock sender wallet and check balance (CRITICAL: prevents double-spend)
  SELECT balance, version INTO v_sender_balance, v_sender_version
  FROM user_wallets
  WHERE user_id = v_sender_id
  FOR UPDATE;
  
  -- Create wallet if doesn't exist
  IF v_sender_balance IS NULL THEN
    INSERT INTO user_wallets (user_id, balance, total_earned, total_spent)
    VALUES (v_sender_id, 0, 0, 0)
    RETURNING balance, version INTO v_sender_balance, v_sender_version;
  END IF;
  
  -- Verify sufficient balance
  IF v_sender_balance < v_gift_price THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'INSUFFICIENT_BALANCE',
      'message', 'Insufficient TruCoins balance',
      'required', v_gift_price,
      'available', v_sender_balance
    );
  END IF;
  
  -- Calculate amounts
  v_commission_amount := ROUND(v_gift_price * v_commission_rate, 2);
  v_net_amount := v_gift_price - v_commission_amount;
  
  -- Lock recipient wallet (create if doesn't exist)
  SELECT version INTO v_recipient_version
  FROM user_wallets
  WHERE user_id = p_recipient_id
  FOR UPDATE;
  
  IF v_recipient_version IS NULL THEN
    INSERT INTO user_wallets (user_id, balance, total_earned, total_spent)
    VALUES (p_recipient_id, 0, 0, 0);
  END IF;
  
  -- Debit sender wallet
  UPDATE user_wallets
  SET 
    balance = balance - v_gift_price,
    total_spent = total_spent + v_gift_price,
    version = version + 1,
    updated_at = now()
  WHERE user_id = v_sender_id;
  
  -- Credit recipient wallet (net amount after commission)
  UPDATE user_wallets
  SET 
    balance = balance + v_net_amount,
    total_earned = total_earned + v_net_amount,
    version = version + 1,
    updated_at = now()
  WHERE user_id = p_recipient_id;
  
  -- Insert trucoin transaction (ledger entry)
  INSERT INTO trucoin_transactions (
    from_user_id,
    to_user_id,
    amount,
    transaction_type,
    reference_id,
    description,
    metadata
  ) VALUES (
    v_sender_id,
    p_recipient_id,
    v_gift_price,
    'live_gift',
    p_stream_id,
    'Live gift: ' || v_gift_name,
    jsonb_build_object(
      'gift_id', p_gift_id,
      'gift_name', v_gift_name,
      'commission', v_commission_amount,
      'net_amount', v_net_amount,
      'is_anonymous', p_is_anonymous
    )
  )
  RETURNING id INTO v_transaction_id;
  
  -- Insert live gift transaction
  INSERT INTO live_gift_transactions (
    gift_id,
    sender_id,
    recipient_id,
    stream_id,
    trucoin_amount,
    commission_amount,
    net_amount,
    transaction_id,
    message,
    is_anonymous
  ) VALUES (
    p_gift_id,
    v_sender_id,
    p_recipient_id,
    p_stream_id,
    v_gift_price,
    v_commission_amount,
    v_net_amount,
    v_transaction_id,
    p_message,
    p_is_anonymous
  )
  RETURNING id INTO v_gift_transaction_id;
  
  -- Return success response
  RETURN jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'transaction_id', v_transaction_id,
      'gift_transaction_id', v_gift_transaction_id,
      'gift_name', v_gift_name,
      'amount', v_gift_price,
      'commission', v_commission_amount,
      'net_amount', v_net_amount,
      'new_balance', v_sender_balance - v_gift_price
    )
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback happens automatically
    RETURN jsonb_build_object(
      'success', false,
      'error', 'TRANSACTION_FAILED',
      'message', 'Transaction failed: ' || SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION rpc_send_live_gift TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION rpc_send_live_gift IS 'Atomically send a live gift using TruCoins. Handles wallet locking, balance verification, and transaction recording.';
