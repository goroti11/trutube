/*
  # Security Fix Part 5: Fix Security Definer Views

  This migration fixes views defined with SECURITY DEFINER property, which can
  be a security risk if not properly constrained.

  ## Views Fixed
  1. premium_plans_comparison - Remove SECURITY DEFINER
  2. premium_subscription_stats - Remove SECURITY DEFINER

  ## Strategy
  - Drop and recreate views without SECURITY DEFINER
  - Use SECURITY INVOKER (default) instead
  - Rely on proper RLS policies for security
  - Maintain exact same functionality and columns
*/

-- 1. Fix premium_plans_comparison view
DROP VIEW IF EXISTS premium_plans_comparison;

CREATE VIEW premium_plans_comparison
WITH (security_invoker = true)
AS
SELECT 
  tier,
  billing_period,
  price,
  discount_percentage,
  features,
  CASE
    WHEN billing_period = 'annual' THEN ROUND(price / 12, 2)
    ELSE price
  END AS monthly_equivalent,
  CASE
    WHEN billing_period = 'annual' THEN (
      SELECT p2.price
      FROM premium_pricing p2
      WHERE p2.tier = premium_pricing.tier 
      AND p2.billing_period = 'monthly'
    ) * 12 - price
    ELSE 0
  END AS annual_savings
FROM premium_pricing
WHERE is_active = true
ORDER BY 
  CASE tier
    WHEN 'premium' THEN 1
    WHEN 'platine' THEN 2
    WHEN 'gold' THEN 3
  END,
  CASE billing_period
    WHEN 'monthly' THEN 1
    WHEN 'annual' THEN 2
  END;

-- 2. Fix premium_subscription_stats view
DROP VIEW IF EXISTS premium_subscription_stats;

CREATE VIEW premium_subscription_stats
WITH (security_invoker = true)
AS
SELECT 
  tier,
  COUNT(*) AS total_subscriptions,
  COUNT(*) FILTER (WHERE status = 'active') AS active_subscriptions,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_subscriptions,
  COUNT(*) FILTER (WHERE status = 'expired') AS expired_subscriptions,
  SUM(price) FILTER (WHERE status = 'active') AS monthly_revenue,
  AVG(price) FILTER (WHERE status = 'active') AS avg_price
FROM premium_subscriptions
GROUP BY tier;
