# GOROTI Gaming Division

Production-grade competitive gaming module integrated into GOROTI platform.

## Overview

GOROTI Gaming is a complete esports and competitive gaming division with:
- Tournament system with TruCoins integration
- Team management and verification
- Seasonal competitive ladder
- Real-time leaderboards
- Arena Fund sponsorship system
- Gaming live streams with competitive mode
- Anti-cheat compliance layer

## Architecture

### Module Structure

```
src/modules/gaming/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── layouts/         # Gaming-specific layouts
│   └── GamingLayout.tsx
├── pages/           # Main gaming pages
│   ├── GamingHubPage.tsx
│   ├── GamingTournamentsPage.tsx
│   ├── GamingTeamsPage.tsx
│   ├── GamingLeaderboardsPage.tsx
│   ├── GamingSeasonsPage.tsx
│   └── GamingArenaFundPage.tsx
├── services/        # API service layer
│   └── gamingService.ts
└── types/           # TypeScript definitions
    └── index.ts
```

### Database Schema

#### Core Tables

1. **game_publishers** - Game publishers and developers
2. **games** - Enhanced game catalog with competitive features
3. **gaming_rules_acceptance** - User policy acceptance tracking
4. **gaming_seasons** - Seasonal competition system
5. **gaming_teams** - Team management
6. **gaming_team_members** - Team membership and roles

#### Tournament System

7. **gaming_tournaments** - Tournament management
8. **tournament_participants** - Player/team registration
9. **tournament_matches** - Match scheduling and results
10. **tournament_prize_distribution** - Prize pool management

#### Leaderboards & Sessions

11. **gaming_live_sessions** - Live gaming streams
12. **gaming_stream_stats** - Real-time stream statistics
13. **gaming_leaderboards** - Optimized ranking system

#### Arena Fund

14. **arena_fund** - Sponsor pool management
15. **arena_transactions** - Transaction logging

### RPC Functions

#### Tournament Entry
```typescript
rpc_enter_tournament(
  p_tournament_id: uuid,
  p_team_id?: uuid,
  p_user_id?: uuid
): jsonb
```

Atomic transaction that:
- Validates balance and tournament status
- Deducts entry fee from wallet
- Contributes 10% to Arena Fund
- Adds to prize pool
- Registers participant
- Logs all transactions

#### Prize Distribution
```typescript
rpc_distribute_prize_pool(
  p_tournament_id: uuid,
  p_prize_distribution: jsonb
): jsonb
```

Distributes prizes to winners:
- Validates tournament completion
- Credits winner wallets
- Updates leaderboards
- Logs transactions

#### Arena Contribution
```typescript
rpc_gaming_boost_contribution(
  p_session_id: uuid,
  p_boost_amount: bigint
): jsonb
```

Auto-contributes 10% of gaming boosts to Arena Fund.

## Features

### 1. Tournament System

- **Formats:** Single elimination, double elimination, round-robin, swiss, battle royale
- **Entry Fees:** TruCoins-based with auto-contribution to Arena Fund
- **Prize Pools:** Transparent distribution with anti-fraud measures
- **Brackets:** Dynamic generation and real-time updates
- **Status Tracking:** Registration, ongoing, finished, cancelled

### 2. Team System

- **Team Creation:** User-created teams with captain role
- **Verification:** Optional official verification
- **Seasonal Tracking:** Stats per season
- **Roles:** Captain, Co-captain, Member
- **Membership:** Invitation system with accept/decline

### 3. Seasonal System

- **Lifecycle:** Upcoming → Active → Ended
- **Rewards:** Automated distribution at season end
- **Rankings:** Persistent historical data
- **Badges:** Season achievement system

### 4. Leaderboards

- **Types:**
  - Individual player rankings
  - Team rankings
  - Seasonal rankings
- **Metrics:**
  - Win/Loss/Draw records
  - Performance score
  - TruCoins earned/spent
  - Match history
- **Optimization:** Indexed queries for fast loading

### 5. Arena Fund

- **Purpose:** Community sponsorship pool
- **Sources:**
  - 10% of tournament entry fees
  - 10% of gaming stream boosts
  - Direct sponsorships
- **Transparency:** Public balance and transaction history
- **Distribution:** Admin-controlled payouts for community events

### 6. Gaming Live

- **Modes:**
  - Casual: No ranking impact
  - Competitive: Affects leaderboards
  - Tournament: Linked to tournament matches
- **Features:**
  - Anti-cheat reporting
  - TruCoins boost integration
  - Real-time stats tracking
  - Viewer engagement metrics

### 7. Compliance Layer

Users must accept:
- **Anti-Cheat Policy:** Fair play commitment
- **Fair Play Charter:** Sportsmanship rules
- **Prize Transparency:** Understanding payout system
- **License Compliance:** Game publisher agreements

Blocking: Gaming features disabled until all rules accepted.

## Integration with Existing Systems

### TruCoins Wallet

- **Reuses:** Existing wallet infrastructure
- **Transactions:** All gaming transactions use standard wallet
- **Balance:** Real-time validation
- **History:** Unified transaction log

### Notifications

Gaming events trigger notifications:
- Tournament starting
- Match scheduled
- Team invitation
- Prize won
- Ranking updated
- Season ending

### Live Streaming

Gaming extends existing live system:
- Same infrastructure
- Additional gaming metadata
- Competitive mode toggle
- Tournament linking

## Security Features

### Rate Limiting

- **Tournament Entry:** Prevents spam registrations
- **Team Creation:** Limits per user per season
- **Match Reporting:** Anti-manipulation

### Validation

- **Balance Checks:** Before all TruCoins operations
- **Duplicate Prevention:** Unique constraints on registrations
- **Match Integrity:** Winner validation logic

### Audit Trail

- **Arena Transactions:** Complete logging
- **Prize Distribution:** Immutable records
- **Rule Acceptance:** IP and timestamp tracking

## Usage Examples

### Entering a Tournament

```typescript
import { gamingService } from '@/modules/gaming';

const result = await gamingService.enterTournament(
  tournamentId,
  teamId // optional
);

if (result.success) {
  console.log('Registered!', result.participant_id);
} else {
  console.error(result.error);
}
```

### Fetching Leaderboards

```typescript
const leaderboard = await gamingService.getLeaderboard({
  game_id: 'game-uuid',
  season_id: 'season-uuid',
  leaderboard_type: 'individual',
  limit: 100
});
```

### Creating a Team

```typescript
const result = await gamingService.createTeam({
  name: 'Elite Squad',
  slug: 'elite-squad',
  tag: 'ELIT',
  description: 'Competitive team',
  season_id: 'current-season-uuid',
  max_members: 5
});
```

### Subscribing to Live Sessions

```typescript
const unsubscribe = gamingService.subscribeToActiveSessions(
  gameId,
  (session) => {
    console.log('Session updated:', session);
  }
);

// Later
unsubscribe();
```

## Performance Optimizations

### Database Indexes

- Composite indexes on frequently queried columns
- Covering indexes for leaderboard queries
- Partial indexes on active records only

### Query Optimization

- Selective column fetching
- Join optimization with proper foreign keys
- Materialized views for complex aggregations

### Real-time Updates

- Supabase Realtime for live data
- Efficient channel subscriptions
- Automatic cleanup on unmount

## Deployment Checklist

- [ ] All migrations applied
- [ ] RPC functions deployed
- [ ] RLS policies tested
- [ ] Indexes created
- [ ] Arena Fund initialized for current season
- [ ] Gaming rules published
- [ ] Admin roles configured
- [ ] Rate limits configured
- [ ] Monitoring enabled

## Future Enhancements

### Phase 2
- Match replay system
- Spectator mode
- In-game overlays API
- Automated brackets
- Streaming integrations

### Phase 3
- Mobile apps
- Dedicated gaming studio
- Professional caster tools
- Sponsor management portal
- Advanced analytics

### Phase 4
- AI anti-cheat
- Tournament automation
- Cross-game rankings
- NFT badges
- Merchandise integration

## Support

For gaming-specific support:
- Technical: gaming@goroti.com
- Tournaments: tournaments@goroti.com
- Teams: teams@goroti.com
- Compliance: compliance@goroti.com

## License

Proprietary - GOROTI Platform
