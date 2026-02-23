# 🏛️ LÉGENDE Quick Start Guide

## 30-Second Overview

GOROTI LÉGENDE is a 4-tier prestige system for exceptional content with anti-fraud protection and full audit trails.

## Routes

- **`/legende`** - Browse all legends with filters
- **`/hall-of-fame`** - Top 100 historical legends

## Database Tables

```sql
legend_categories    -- 5 categories (Video, Music, Gaming, Live, Culture)
legend_registry      -- All legends with metrics
legend_candidates    -- Evaluation queue
legend_fraud_checks  -- Anti-manipulation logs
```

## Quick Integration

### 1. Display Badge on Content

```tsx
import { legendService } from '@/services/legendService';
import { LegendBadge } from '@/components/legend/LegendBadge';

// Fetch legend status
const legend = await legendService.getLegendByEntity('video', videoId);

// Show badge if legendary
{legend && <LegendBadge level={legend.level} size="md" showLabel />}
```

### 2. Evaluate Content

```typescript
const result = await legendService.evaluateCandidate('video', videoId);

if (result.eligible) {
  console.log(`Eligible for Level ${result.level}: ${result.reason}`);
  // Can auto-grant or queue for admin review
}
```

### 3. Grant Legend Status (Admin)

```typescript
await legendService.grantLegendStatus(
  'video',           // entity type
  videoId,           // entity ID
  3,                 // level (1-4)
  'video',           // category slug
  'views_milestone_10m',  // reason
  { verified_views: 10000000 }  // metrics
);
```

## Level Criteria

| Level | Badge | Criteria |
|-------|-------|----------|
| 1 | ⭐ | 1M views + 6 months |
| 2 | 🏅 | 5M views + 12 months |
| 3 | 💎 | 10M views |
| 4 | 👑 | Admin validation |

## Anti-Fraud Protection

Every evaluation checks:
- ✅ Verified views (from watch_sessions)
- ✅ No active sanctions
- ✅ Risk score < 30
- ✅ No fraud patterns

## RPCs Available

```typescript
// Frontend-safe
rpc_evaluate_legend_candidate(entity_type, entity_id)
rpc_get_legend_stats()

// Admin only
rpc_grant_legend_status(...)
rpc_revoke_legend_status(legend_id, reason)

// Internal
check_legend_fraud_signals(entity_type, entity_id)
```

## Common Queries

### Get All Legends
```typescript
const legends = await legendService.getLegends({
  category: 'video',  // optional
  level: 3,           // optional
  limit: 50,
});
```

### Check if Content is Legend
```typescript
const legend = await legendService.getLegendByEntity('video', videoId);
const isLegend = legend && !legend.is_revoked;
```

### Get Platform Stats
```typescript
const stats = await legendService.getStats();
// Returns: { total_legends, by_level, by_category, recent_grants }
```

## Badge Variants

```tsx
<LegendBadge level={1} size="sm" />
<LegendBadge level={2} size="md" showLabel />
<LegendBadge level={3} size="lg" showLabel animated />
```

## Navigation

Button added to main header:
```tsx
<Link to="/legende">🏛️ LÉGENDE</Link>
```

## Next Steps

1. **Connect Real Metrics**: Update `rpc_evaluate_legend_candidate` with actual view counts
2. **Automate**: Create cron job to evaluate candidates daily
3. **Notify**: Send notification when content becomes legend
4. **Admin Panel**: Build review interface for Level 3-4

## Files Modified

```
src/App.tsx                           # Added routes
src/services/legendService.ts         # New service
src/types/legend.ts                   # Type definitions
src/components/legend/LegendBadge.tsx # Badge component
src/components/legend/LegendCard.tsx  # Card component
src/pages/LegendPage.tsx              # Main page
src/pages/HallOfFamePage.tsx          # Hall of Fame

supabase/migrations/
  ...create_legend_system_core.sql
  ...create_legend_evaluation_functions.sql
```

## Security Notes

- All tables have RLS enabled
- Public can view non-revoked legends
- Only authenticated users can evaluate
- Only admins can grant/revoke
- Full audit trail on all operations

## Support

See `LEGEND_SYSTEM_IMPLEMENTATION.md` for complete documentation.
