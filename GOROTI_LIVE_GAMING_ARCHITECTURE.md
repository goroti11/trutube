# GOROTI Live & Gaming Architecture - Clean & Consolidated

## Executive Summary

GOROTI now has a **canonical, production-ready Live and Gaming system** that follows these principles:

1. **ONE Live Engine**: `live_streams` table is the base for ALL streaming
2. **Gaming Extends Live**: `gaming_live_sessions` extends (not replaces) live_streams
3. **No Duplication**: Single source of truth for each domain
4. **Clean Services**: Consolidated services with clear responsibilities
5. **Production Ready**: Full RLS, indexes, and helper functions

---

## Database Architecture

### Core Live System

**`live_streams`** - Canonical streaming base (ALL streams)
- Supports all stream types: general, gaming, music, event, premiere
- Handles all access types: public, premium, private, subscribers
- Tracks viewers, gifts, TruCoins
- Links to replay videos
- Categorized by universes and sub-universes
- Stream status lifecycle: scheduled → live → ended → archived

**`live_viewers`** - Real-time viewer tracking
- Tracks join/leave times
- Calculates watch duration
- Anonymous and authenticated viewers

**`live_messages`** - Live chat
- Real-time messaging
- Pinning and moderation support

**`live_gifts`** - TruCoin gifts
- Gift type and amount tracking
- Automatically updates stream TruCoin totals

### Gaming Extension

**`gaming_live_sessions`** - Gaming-specific extension of live_streams
- **CRITICAL**: Has `live_stream_id` FK to base live_streams
- Gaming-specific fields: game, mode, ranked, anti-cheat, tournaments
- Modes: casual, competitive, tournament
- Tournament integration

**`gaming_stream_stats`** - Gaming session statistics
- Historical stats tracking
- Performance metrics

**`gaming_seasons`** - Competitive seasons
- Prize pools
- Season-based competitions

### Gaming Competitive System

**`games`** - Game catalog
- Publisher relationships
- Competitive/tournament support flags

**`gaming_teams`** - Team management
- Captain system
- Win/loss records
- TruCoin earnings

**`gaming_tournaments`** - Tournament system
- Multiple formats: single/double elimination, round robin, swiss
- Entry fees and prize pools
- Registration and status management

**`gaming_matches`** - Match records
- Tournament bracket management
- Score tracking

**`gaming_leaderboards`** - Rankings
- Categories: solo, team, TruCoin earnings, performance
- Game and season specific

**`gaming_arena_fund`** - Community prize pool
- Transparent fund management
- Contribution and distribution tracking

---

## Service Layer

### Canonical Services

#### `liveService.ts` - Canonical Live Streaming Service
Replaces both `liveStreamService` and `liveStudioService`

**Responsibilities:**
- Create, start, end live streams
- Viewer join/leave management
- Chat messaging
- Gift sending
- Statistics retrieval
- Real-time subscriptions

**Key Methods:**
```typescript
createLiveStream(params): Promise<CreateLiveStreamResult>
startLiveStream(streamId): Promise<void>
endLiveStream(streamId): Promise<void>
joinLiveStream(streamId): Promise<string>
leaveLiveStream(viewerId): Promise<void>
getLiveStreamById(streamId): Promise<LiveStream>
getCurrentLiveStreams(streamType?, limit?): Promise<LiveStream[]>
getLiveStreamStats(streamId): Promise<LiveStreamStats>
sendMessage(streamId, message): Promise<LiveMessage>
sendGift(streamId, giftType, giftName, amount, message?): Promise<LiveGift>
subscribeToStream(streamId, callback): Subscription
```

#### `gamingLiveService.ts` - Gaming Live Streaming Service
Handles gaming-specific live streaming built ON TOP of liveService

**Responsibilities:**
- Create gaming streams (creates both live_stream + gaming_live_session)
- Gaming session lifecycle
- Game catalog access
- Active gaming sessions discovery
- Gaming-specific stats

**Key Methods:**
```typescript
createGamingLiveStream(params): Promise<CreateGamingLiveStreamResult>
startGamingLiveStream(liveStreamId): Promise<void>
endGamingLiveStream(liveStreamId): Promise<void>
getActiveGamingSessions(gameId?, limit?): Promise<ActiveGamingSession[]>
getGamingSessionById(sessionId): Promise<GamingLiveSession>
getActiveGames(limit?): Promise<Game[]>
searchGames(query, limit?): Promise<Game[]>
subscribeToGamingSession(sessionId, callback): Subscription
```

#### `gamingService.ts` - Gaming Division Service
Handles competitive gaming (teams, tournaments, leaderboards)

**Responsibilities:**
- Tournament management
- Team management
- Leaderboards
- Seasons
- Arena Fund
- Match tracking

**Status:** Existing service, needs to use gaming_live_sessions from database

---

## Database Functions (RPC)

### Live Stream Management
- `create_live_stream()` - Create new stream with unique key
- `start_live_stream()` - Transition from scheduled to live
- `end_live_stream()` - End stream
- `join_live_stream()` - Join as viewer, update count
- `leave_live_stream()` - Leave, calculate watch duration
- `get_live_stream_stats()` - Get comprehensive stats

### Gaming Live Management
- `create_gaming_live_stream()` - **Atomically** creates live_stream + gaming_live_session
- `start_gaming_live_stream()` - Start gaming stream
- `end_gaming_live_stream()` - End gaming stream, record final stats
- `get_active_gaming_sessions()` - Get active gaming streams with details
- `update_gaming_session_stats()` - Record stats snapshot

---

## Architecture Rules

### MANDATORY Integration Rules

1. **Gaming Live MUST use live_streams as base**
   - Never create standalone gaming streams
   - Always use `create_gaming_live_stream()` RPC
   - This creates BOTH tables atomically

2. **Replay generation uses live_streams.replay_video_id**
   - Same for regular streams and gaming streams
   - No separate replay pipelines

3. **TruCoin gifts use live_gifts table**
   - Works for all stream types
   - No duplicate gift systems

4. **Viewer tracking uses live_viewers**
   - All streams use same viewer system
   - Gaming doesn't need separate viewer tracking

5. **Chat uses live_messages**
   - All streams share chat system
   - Gaming-specific emotes/effects can be added as metadata

### Service Consolidation Rules

**OLD (Deprecated):**
- `liveStreamService.ts` - Basic live operations
- `liveStudioService.ts` - Advanced live + games in stream
- `gamingService.ts` - Gaming division
- `liveGamingService.ts` - Gaming live (duplicate)

**NEW (Canonical):**
- `liveService.ts` - ALL live streaming (replaces liveStreamService + liveStudioService)
- `gamingLiveService.ts` - Gaming extension of live (gaming sessions only)
- `gamingService.ts` - Competitive gaming (teams, tournaments, leaderboards)

---

## Creator Studio Structure

### Recommended Routes

```
/studio
  /live                   - Live Studio hub
    /create              - Create new live stream
    /:id/setup           - Stream configuration
    /:id/chat            - Chat moderation
    /:id/gifts           - Gift management
    /:id/replay          - Replay & dubbing
    /:id/analytics       - Stream analytics

  /gaming                - Gaming Studio hub
    /live                - Gaming live streams
      /create            - Create gaming stream
      /:id/setup         - Gaming stream config
    /tournaments         - Manage tournaments
    /team                - Team management
    /analytics           - Gaming analytics

  /video                 - Video Studio
  /monetization          - Revenue management
  /analytics             - Overall analytics
```

---

## Migration Status

### Applied Migrations

✅ `create_canonical_live_and_gaming_system.sql`
- Created all live_streams tables
- Created all gaming tables with proper FK relationships
- gaming_live_sessions.live_stream_id → live_streams.id
- live_streams.gaming_session_id → gaming_live_sessions.id
- Full RLS policies
- Comprehensive indexes

✅ `create_live_and_gaming_rpc_functions.sql`
- All live stream RPC functions
- All gaming live RPC functions
- Atomic creation functions
- Statistics functions

### Not Applied (Old Migrations)

The following migrations exist in `/supabase/migrations/` but were NOT applied to database:
- `20260217075043_create_live_streaming_system.sql`
- `20260222213522_create_live_gift_system.sql`
- Multiple gaming migrations from Feb 22-27

These are now **obsolete** - the canonical migration replaces all of them.

---

## Next Steps for Full Implementation

### 1. Update Pages to Use New Services

**LiveStreamingPage.tsx** → Use `liveService`
```typescript
import { liveService } from '../services/liveService';

// Create stream
const result = await liveService.createLiveStream({
  title, description, universe_id, sub_universe_id
});

// Start stream
await liveService.startLiveStream(streamId);

// Get stats
const stats = await liveService.getLiveStreamStats(streamId);
```

**GamingStudioPage.tsx** → Use `gamingLiveService`
```typescript
import { gamingLiveService } from '../services/gamingLiveService';

// Create gaming stream
const result = await gamingLiveService.createGamingLiveStream({
  game_id, title, mode: 'competitive', is_ranked: true
});

// Start gaming stream
await gamingLiveService.startGamingLiveStream(result.live_stream_id);
```

**GamingHubPage.tsx** → Use `gamingLiveService`
```typescript
// Get active gaming sessions
const sessions = await gamingLiveService.getActiveGamingSessions();

// Get games
const games = await gamingLiveService.getActiveGames();
```

### 2. Deprecate Old Services Safely

Create deprecation wrappers in old services:

```typescript
// liveStreamService.ts
import { liveService } from './liveService';

export class LiveStreamService {
  createLiveStream(...) {
    console.warn('DEPRECATED: Use liveService.createLiveStream() instead');
    return liveService.createLiveStream(...);
  }
}
```

### 3. Update Studio Navigation

Integrate Gaming Studio into main Creator Studio:
- Add Gaming section to Creator Studio sidebar
- Link to gaming live creation
- Show gaming analytics

### 4. Test Integration Points

- Create gaming stream → verify live_streams + gaming_live_sessions created
- Start gaming stream → verify both tables updated
- Send gift → verify live_gifts created and totals updated
- End gaming stream → verify replay linkage works
- Verify RLS policies work correctly

### 5. Documentation Updates

Update all developer docs to reference:
- New canonical architecture
- New service imports
- New RPC functions
- Migration from old services

---

## Benefits of This Architecture

### For Developers

✅ **Single Source of Truth**: No confusion about which table/service to use
✅ **Clear Boundaries**: Live vs Gaming responsibilities are obvious
✅ **Type Safety**: Proper TypeScript interfaces
✅ **Extensible**: Easy to add new stream types (music, events)
✅ **Maintainable**: Less code duplication

### For the Platform

✅ **Unified Analytics**: All streams use same metrics
✅ **Unified Monetization**: All streams use same gift/TruCoin system
✅ **Unified Replay**: Same replay pipeline for all content
✅ **Better UX**: Consistent experience across stream types
✅ **Performance**: Optimized indexes and RLS policies

### For Creators

✅ **One Studio**: Manage all streaming from one place
✅ **Consistent Tools**: Same tools work across stream types
✅ **Combined Analytics**: See all metrics together
✅ **Cross-Promotion**: Gaming and general audiences can discover each other

---

## Critical Success Factors

### Must Have

1. ✅ Single live_streams table as canonical base
2. ✅ Gaming extends live via FK relationship
3. ✅ Atomic creation via RPC functions
4. ✅ Full RLS security
5. ⏳ Pages updated to use new services
6. ⏳ Old services deprecated

### Must Not Have

1. ❌ Parallel streaming systems
2. ❌ Duplicate gift/viewer/chat systems
3. ❌ Gaming streams bypassing live_streams
4. ❌ Multiple sources of truth
5. ❌ Inconsistent stat tracking

---

## Troubleshooting

### "Gaming stream not showing up"
→ Check that both live_streams and gaming_live_sessions records exist
→ Verify live_streams.gaming_session_id is set

### "Viewers not counting"
→ Use live_streams.viewer_count (not gaming-specific counter)
→ Verify live_viewers records are being created

### "Gifts not working"
→ Use live_gifts table for all streams
→ Check live_streams.total_trucoins_earned is updating

### "Stats mismatch"
→ live_streams is source of truth
→ gaming_stream_stats is historical snapshot

---

## Conclusion

GOROTI now has a **professional, consolidated Live and Gaming architecture** that:

- Eliminates duplication
- Establishes clear canonical models
- Separates concerns properly
- Enables future growth
- Maintains data integrity
- Provides excellent developer experience

The foundation is solid and production-ready. Next step is updating the UI layer to use the new services.
