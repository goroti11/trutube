# GOROTI Platform - Enterprise Gaming Division & Live Studio

Enterprise-grade platform integrating Live Streaming, Gaming Division, TruCoins wallet system, and platform-wide compliance.

## Architecture

### Database (Supabase)
- **Compliance System**: legal_documents, legal_acceptances
- **Audit & Security**: system_audit_logs, gaming_risk_scores, match_integrity_logs, gaming_sanctions
- **Live Streaming**: live_streams, live_settings, live_gifts, live_gift_transactions
- **Gaming Division**: games, gaming_seasons, gaming_teams, gaming_tournaments, tournament_matches, gaming_leaderboards
- **Arena Fund**: arena_fund, arena_transactions
- **TruCoins Wallet**: trucoin_wallets, trucoin_transactions
- **Notifications**: notifications, notification_preferences, notification_rules

### Edge Functions (Deployed)
- `legal-accept` - Accept legal documents with audit trail
- `legal-check` - Check user compliance status
- `gaming-report-cheat` - Report suspicious gaming activity
- `gaming-apply-sanction` - Admin sanctions (requires auth check)
- `gaming-tournament-enter` - Enter tournaments with TruCoins
- `send-live-gift` - Send gifts during live streams

### Frontend Modules
- **Gaming Division** (`/gaming`): Hub, Tournaments, Teams, Leaderboards, Seasons, Arena Fund, Studio
- **Live Studio** (integrated in existing Studio area)
- **Platform Notifications** (NotificationBell, NotificationCenter)
- **Legal Compliance Gates** (LegalAcceptanceGate component)

## Setup

### 1. Environment Variables

Create `.env` file:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Migrations

All migrations have been applied:
- Enterprise compliance system
- Audit & security system
- Enhanced RPC functions with audit trail
- Default legal documents seeded

### 3. Install & Run

```bash
npm install
npm run dev
```

## Key Features

### Compliance & Legal System
- Domain-specific terms: global, live, gaming, wallet, premium, community
- Legal acceptance gates block access until terms accepted
- IP and device fingerprint tracking
- Audit trail for all acceptances

### Gaming Division
- **Seasons**: Active season tracking with prize pools
- **Tournaments**: Entry fees, prize pools, bracket system
- **Teams**: Season-based team management
- **Leaderboards**: Cached for performance
- **Arena Fund**: Community prize pool from tournament contributions
- **Anti-cheat**: Risk scoring, integrity logs, sanctions

### Live Studio (TruCoins-only)
- Gift system with tiered pricing
- Real-time gift animations
- Revenue sharing with commission
- No Stripe integration during live
- Moderation tools

### Platform Notifications
- Real-time notifications via Supabase Realtime
- Priority levels: low, medium, high, urgent
- Notification preferences per domain
- Cooldown and grouping rules
- Unread count tracking

### TruCoins Wallet
- Virtual currency system
- Transactional RPCs with idempotency
- Locked balance support
- Transaction ledger (append-only)

## RPC Functions

### Compliance
- `rpc_accept_legal_document(p_document_id, p_ip_address, p_device_fingerprint)` - Accept terms
- `check_legal_acceptance(p_user_id, p_domain)` - Check if user accepted required docs

### Gaming
- `rpc_enter_tournament_v2(p_tournament_id, p_team_id, p_idempotency_key)` - Enter tournament with sanction check
- `rpc_report_cheat(p_match_id, p_reported_user_id, p_pattern, p_details)` - Report cheating
- `rpc_apply_sanction(p_user_id, p_type, p_reason, p_expires_at, p_metadata)` - Admin sanction
- `has_active_sanction(p_user_id)` - Check if user is banned

### Notifications
- `rpc_get_unread_notification_count()` - Get unread count
- `rpc_mark_notification_read(p_notification_id)` - Mark as read
- `rpc_mark_all_notifications_read()` - Mark all as read
- `rpc_update_notification_preferences(p_domain, p_enabled, p_push_enabled, p_email_enabled)` - Update preferences

### Live Gifts
- `rpc_send_live_gift(p_live_id, p_gift_id, p_idempotency_key)` - Send gift (transactional)

### Audit
- `write_audit_log(p_action_type, p_entity_type, p_entity_id, p_before_state, p_after_state, p_metadata)` - Write audit entry

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Admin operations require privileged access
- Audit logs are append-only

### Transactional Safety
- All money operations use database transactions
- Row-level locking prevents double-spend
- Idempotency keys prevent duplicate operations
- Audit trail for all critical actions

### Anti-Cheat
- Risk scoring system (0-100)
- Pattern detection in matches
- Automated and manual sanctions
- Temporary and permanent bans

## Gating Rules

### Live Studio Access
User must accept `domain='live'` legal documents

### Gaming Division Access
User must accept `domain='gaming'` legal documents

### Wallet Operations
User must accept `domain='wallet'` legal documents (if required by policy)

## Admin Operations

Admin roles should be assigned via Supabase custom claims or profiles table. Currently implemented functions:
- Apply sanctions
- Distribute tournament prizes
- Create/manage tournaments
- Review audit logs

## Performance Optimizations

- **Leaderboard Caching**: Use `gaming_leaderboard_cache` for fast queries
- **Notification Batching**: Batch inserts for high-volume notifications
- **Indexes**: All foreign keys and frequently queried columns indexed
- **Real-time Subscriptions**: Supabase Realtime for live updates

## Development Notes

- No demo data in production
- All operations are production-grade
- Strict TypeScript typing throughout
- No placeholders or TODOs in code
- Services layer abstracts API calls
- Hooks manage state and side effects

## Build

```bash
npm run build
```

Production build output in `dist/`
