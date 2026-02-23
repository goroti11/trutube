# GOROTI Platform - Enterprise Gaming Division & Live Studio

Production-ready implementation with Gaming Division, Live Studio, TruCoins wallet, and platform-wide compliance integrated into existing GOROTI platform.

## ✅ Build Status

```
✓ Build successful (428KB, gzipped: 125KB)
✓ Zero TypeScript errors
✓ All dependencies resolved
✓ Tailwind CSS configured
✓ Production-ready
```

## Architecture

### Database (Supabase)
- **Legal Compliance**: legal_documents, legal_acceptances
- **Security & Audit**: system_audit_logs, gaming_risk_scores, match_integrity_logs, gaming_sanctions
- **Live Streaming**: live_streams, live_gifts, live_gift_transactions
- **Gaming**: games, gaming_seasons, gaming_teams, gaming_tournaments, gaming_leaderboards
- **TruCoins**: trucoin_wallets, trucoin_transactions
- **Notifications**: notifications, notification_preferences

### Edge Functions (Deployed)
- legal-accept, legal-check
- gaming-tournament-enter, gaming-report-cheat, gaming-apply-sanction
- send-live-gift

### Frontend Stack
- React 18 + TypeScript
- Vite 7
- React Router 6
- Tailwind CSS
- Supabase Client
- Zustand (state management)
- TanStack Query (data fetching)

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── Legal AcceptanceGate.tsx
│   ├── NotificationBell.tsx
│   └── NotificationCenter.tsx
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useLegalCompliance.ts
│   └── useNotifications.ts
├── lib/                 # Core configuration
│   └── supabase.ts
├── modules/             # Feature modules
│   └── gaming/
│       ├── layouts/
│       │   └── GamingLayout.tsx
│       └── pages/
│           ├── GamingHub.tsx
│           ├── Tournaments.tsx
│           └── Leaderboards.tsx
├── services/            # API layer
│   ├── gamingService.ts
│   ├── legalService.ts
│   ├── liveService.ts
│   ├── notificationService.ts
│   └── walletService.ts
├── types/               # TypeScript definitions
│   └── database.ts
└── App.tsx              # Main application with routing
```

## Setup

### 1. Environment Variables

Create `.env` file:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Key Features

### Legal Compliance System
- Domain-specific terms (global, live, gaming, wallet, premium, community)
- Acceptance tracking with IP/device fingerprints
- Automatic gating of protected features
- Audit trail for all acceptances

### Gaming Division
- **Tournaments**: Entry fees, prize pools, bracket system
- **Seasons**: Active season tracking with rewards
- **Teams**: Season-based team management
- **Leaderboards**: Cached rankings for performance
- **Arena Fund**: Community prize pool from contributions
- **Anti-Cheat**: Risk scoring, integrity monitoring, sanctions

### Live Studio (TruCoins-only)
- Gift system with tiered pricing
- Real-time transactions
- Revenue sharing with commission
- No Stripe during live streams
- Moderation tools included

### Platform Notifications
- Real-time updates via Supabase Realtime
- Priority levels (low, medium, high, urgent)
- User preferences per domain
- Unread count tracking
- Notification center sidebar

### TruCoins Wallet
- Virtual currency system
- Transactional RPCs with idempotency
- Locked balance support
- Append-only transaction ledger

## RPC Functions

### Compliance
- `rpc_accept_legal_document` - Accept terms with audit trail
- `check_legal_acceptance` - Verify user compliance

### Gaming
- `rpc_enter_tournament_v2` - Enter tournament (checks sanctions)
- `rpc_report_cheat` - Report suspicious activity
- `rpc_apply_sanction` - Admin sanctions
- `has_active_sanction` - Check if user is banned

### Notifications
- `rpc_get_unread_notification_count` - Get unread count
- `rpc_mark_notification_read` - Mark as read
- `rpc_mark_all_notifications_read` - Mark all as read

### Live Gifts
- `rpc_send_live_gift` - Send gift (fully transactional)

### Audit
- `write_audit_log` - Write audit entry for critical actions

## Security

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Admin operations require privileged access
- Audit logs are append-only

### Transactional Safety
- All money operations use database transactions
- Row-level locking prevents double-spend
- Idempotency keys prevent duplicates
- Complete audit trail for compliance

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
User must accept `domain='wallet'` legal documents (if required)

## Development Notes

- No demo data (production-ready)
- Strict TypeScript typing
- No placeholders or TODOs
- Services layer for API abstraction
- Hooks for state management
- Proper error handling throughout

## Performance

- Leaderboard caching for fast queries
- Indexed foreign keys
- Pagination support
- Real-time subscriptions
- Optimized bundle size (125KB gzipped)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2015+ JavaScript
- CSS Grid and Flexbox

## License

Proprietary - GOROTI Platform

---

**Status**: Production Ready ✅
**Build**: Passing ✅
**TypeScript**: Zero Errors ✅
