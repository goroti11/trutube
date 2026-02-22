/*
  # Fix RLS Auth UID Optimization - Batch 1
  
  Optimize RLS policies by using (select auth.uid()) instead of auth.uid()
  to prevent re-evaluation for each row
*/

-- video_reviews
DROP POLICY IF EXISTS "Authenticated users can create video reviews" ON video_reviews;
CREATE POLICY "Authenticated users can create video reviews"
  ON video_reviews FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own video reviews" ON video_reviews;
CREATE POLICY "Users can delete own video reviews"
  ON video_reviews FOR DELETE
  TO authenticated
  USING (reviewer_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own video reviews" ON video_reviews;
CREATE POLICY "Users can update own video reviews"
  ON video_reviews FOR UPDATE
  TO authenticated
  USING (reviewer_id = (select auth.uid()))
  WITH CHECK (reviewer_id = (select auth.uid()));

-- creator_reviews
DROP POLICY IF EXISTS "Authenticated users can create creator reviews" ON creator_reviews;
CREATE POLICY "Authenticated users can create creator reviews"
  ON creator_reviews FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own creator reviews" ON creator_reviews;
CREATE POLICY "Users can delete own creator reviews"
  ON creator_reviews FOR DELETE
  TO authenticated
  USING (reviewer_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own creator reviews" ON creator_reviews;
CREATE POLICY "Users can update own creator reviews"
  ON creator_reviews FOR UPDATE
  TO authenticated
  USING (reviewer_id = (select auth.uid()))
  WITH CHECK (reviewer_id = (select auth.uid()));

-- review_helpfulness
DROP POLICY IF EXISTS "Authenticated users can mark reviews helpful" ON review_helpfulness;
CREATE POLICY "Authenticated users can mark reviews helpful"
  ON review_helpfulness FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own helpfulness votes" ON review_helpfulness;
CREATE POLICY "Users can delete own helpfulness votes"
  ON review_helpfulness FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own helpfulness votes" ON review_helpfulness;
CREATE POLICY "Users can update own helpfulness votes"
  ON review_helpfulness FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- review_responses
DROP POLICY IF EXISTS "Creators can delete own responses" ON review_responses;
CREATE POLICY "Creators can delete own responses"
  ON review_responses FOR DELETE
  TO authenticated
  USING (creator_id = (select auth.uid()));

DROP POLICY IF EXISTS "Creators can respond to reviews on their content" ON review_responses;
CREATE POLICY "Creators can respond to reviews on their content"
  ON review_responses FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (select auth.uid()));

DROP POLICY IF EXISTS "Creators can update own responses" ON review_responses;
CREATE POLICY "Creators can update own responses"
  ON review_responses FOR UPDATE
  TO authenticated
  USING (creator_id = (select auth.uid()))
  WITH CHECK (creator_id = (select auth.uid()));