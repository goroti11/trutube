/*
  # Fix Always True Policies
  
  Fix policies that have always true conditions
*/

-- Fix live_top_supporters policies
DROP POLICY IF EXISTS "System updates supporter rankings" ON live_top_supporters;
DROP POLICY IF EXISTS "System updates top supporters" ON live_top_supporters;

-- Replace with more restrictive policies
CREATE POLICY "Stream creators can update top supporters"
  ON live_top_supporters FOR UPDATE
  TO authenticated
  USING (
    stream_id IN (
      SELECT id FROM live_streams WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    stream_id IN (
      SELECT id FROM live_streams WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Stream creators can insert top supporters"
  ON live_top_supporters FOR INSERT
  TO authenticated
  WITH CHECK (
    stream_id IN (
      SELECT id FROM live_streams WHERE user_id = (select auth.uid())
    )
  );