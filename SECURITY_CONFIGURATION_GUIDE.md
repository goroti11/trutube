# Security Configuration Guide

This guide contains security configurations that must be applied through the Supabase Dashboard.

## 1. Auth DB Connection Strategy Configuration

**Issue**: Your project's Auth server is configured to use at most 10 connections. Increasing the instance size without manually adjusting this number will not improve the performance of the Auth server.

**Solution**: Switch to a percentage-based connection allocation strategy.

### Steps to Fix:

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **Database**
3. Find the **Connection Pooling** section
4. Under **Auth Server Connections**, change from fixed number to percentage-based
5. Recommended setting: **10-15%** of total connections
6. Click **Save** to apply changes

**Why this matters**: Percentage-based allocation automatically scales with your database instance, ensuring optimal performance as your application grows.

---

## 2. Enable Leaked Password Protection

**Issue**: Supabase Auth prevents the use of compromised passwords by checking against HaveIBeenPwned.org. This feature is currently disabled.

**Solution**: Enable password breach detection.

### Steps to Fix:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Click on **Email** provider
4. Scroll down to **Security Settings**
5. Find the option **"Check passwords against HaveIBeenPwned"**
6. Toggle it **ON**
7. Click **Save** to apply changes

**Why this matters**: This feature automatically prevents users from setting passwords that have been exposed in data breaches, significantly improving account security.

---

## Summary of Security Fixes Applied via Migrations

The following security issues have been automatically fixed through database migrations:

1. ✅ **Added Missing Foreign Key Index**
   - Added index on `service_bookings.creator_id`
   - Improves query performance on foreign key lookups

2. ✅ **Removed 92 Unused Indexes**
   - Dropped all unused indexes across the database
   - Improves write performance and reduces storage overhead
   - Categories covered:
     - Ad campaigns and impressions (4 indexes)
     - Affiliate system (7 indexes)
     - Community system (9 indexes)
     - Creator monetization (9 indexes)
     - Digital products and merchandise (11 indexes)
     - Messages and revenue (6 indexes)
     - Music system (8 indexes)
     - Payments and posts (8 indexes)
     - Profiles and premium (6 indexes)
     - Subscriptions and support (5 indexes)
     - Tips and transactions (6 indexes)
     - User and video system (15 indexes)

---

## Manual Configuration Required

Please complete the two manual configurations above through the Supabase Dashboard to fully secure your application:

- [ ] Configure Auth DB Connection Strategy to percentage-based
- [ ] Enable Leaked Password Protection

Once completed, your application will have optimal security and performance configurations.
