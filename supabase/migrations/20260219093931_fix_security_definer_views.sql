/*
  # Fix Security Definer Views

  1. Security Fix
    - Recreate views with SECURITY INVOKER instead of SECURITY DEFINER
    - Views: premium_plans_comparison, premium_subscription_stats
    - This ensures views respect the calling user's permissions
*/

CREATE OR REPLACE VIEW public.premium_plans_comparison
WITH (security_invoker = true)
AS
SELECT tier,
    billing_period,
    price,
    discount_percentage,
    features,
    CASE
        WHEN (billing_period = 'annual'::text) THEN round((price / (12)::numeric), 2)
        ELSE price
    END AS monthly_equivalent,
    CASE
        WHEN (billing_period = 'annual'::text) THEN ((( SELECT p2.price
           FROM premium_pricing p2
          WHERE ((p2.tier = premium_pricing.tier) AND (p2.billing_period = 'monthly'::text))) * (12)::numeric) - price)
        ELSE (0)::numeric
    END AS annual_savings
FROM premium_pricing
WHERE (is_active = true)
ORDER BY
    CASE tier
        WHEN 'premium'::text THEN 1
        WHEN 'platine'::text THEN 2
        WHEN 'gold'::text THEN 3
        ELSE NULL::integer
    END,
    CASE billing_period
        WHEN 'monthly'::text THEN 1
        WHEN 'annual'::text THEN 2
        ELSE NULL::integer
    END;

CREATE OR REPLACE VIEW public.premium_subscription_stats
WITH (security_invoker = true)
AS
SELECT tier,
    count(*) AS total_subscriptions,
    count(*) FILTER (WHERE (status = 'active'::text)) AS active_subscriptions,
    count(*) FILTER (WHERE (status = 'cancelled'::text)) AS cancelled_subscriptions,
    count(*) FILTER (WHERE (status = 'expired'::text)) AS expired_subscriptions,
    sum(price) FILTER (WHERE (status = 'active'::text)) AS monthly_revenue,
    avg(price) FILTER (WHERE (status = 'active'::text)) AS avg_price
FROM premium_subscriptions
GROUP BY tier;