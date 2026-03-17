# GOROTI Creator Architecture - Cleanup & Unification Plan

**Date:** 2026-03-17
**Status:** In Progress
**Goal:** Clean, unified, production-ready creator identity system

---

## Executive Summary

The GOROTI platform currently has fragmented creator identity with:
- 6 overlapping profile pages
- Duplicate data in profiles + creator_channels tables
- 2 social links systems
- Conflicting services (profileService vs profileEnhancedService)
- No clear canonical public creator page

This document defines the refactored architecture.

---

## Part 1: Canonical Data Model

### A) `profiles` Table - User Account Identity

**Purpose:** User account information (private, self-facing)

**Owns:**
- `id` (auth.users FK)
- `username` (unique handle for @mentions, login)
- `full_name` (legal/real name for account)
- `avatar_url` (personal account avatar)
- `bio` (short personal bio)
- `language_preference` (UI language)
- Account-level settings
- Premium/subscription status

**Does NOT own:**
- Public creator branding
- Subscriber counts (belongs to channel)
- Channel-specific data

### B) `creator_channels` Table - Public Creator Identity

**Purpose:** Public-facing creator brand (public, viewer-facing)

**Owns:**
- `id` (channel UUID)
- `user_id` (owner FK → profiles)
- `channel_name` (public creator name)
- `channel_slug` (URL-safe unique identifier)
- `channel_type` (creator|artist|label|studio|brand)
- `avatar_url` (public channel avatar)
- `banner_url` (channel banner)
- `description` (public channel description)
- `category`, `language`, `hashtags`
- `social_links` (external social media)
- `subscriber_count`, `video_count`, `total_views`
- `monetization_enabled`, `is_verified`
- Channel settings, branding, sections

**Canonical URL:** `/channel/:channelSlug`

---

## Part 2: Page Architecture - Canonical Structure

### Public Pages

#### **ChannelPage** - `/channel/:channelSlug` (CANONICAL)
**Status:** Keep & Enhance
**Purpose:** Single source of truth for public creator identity

**Features:**
- Channel header with name, avatar, banner, stats
- Subscribe button
- 6 tabs: Home, Videos, Shorts, Releases, Playlists, Posts, Events
- Social links
- About section
- Support/tip actions
- Legend badge integration
- Marketplace/shop integration
- Live status indicator

**Data Source:** `creator_channels` table + related content

**Services:** `channelService.getChannelBySlug()`

---

### Management Pages

#### **MyChannelsPage** - `/my-channels`
**Status:** Keep
**Purpose:** Manage multiple channels

**Features:**
- List all user's channels
- Create new channel
- Quick actions (Analytics, Edit, Delete)
- KYC status alert

#### **ChannelEditPage** - `/channel/:channelSlug/edit`
**Status:** Keep & Enhance
**Purpose:** Edit channel settings, branding, content

**Features:** 9 tabs (Branding, Info, Sections, Playlists, Social, Notifications, Visibility, Monetization, Danger)

#### **ChannelAnalyticsPage** - `/channel-analytics/:channelId`
**Status:** Keep (implement real metrics)
**Purpose:** Channel performance metrics

#### **EditProfilePage** - `/edit-profile`
**Status:** Simplify to account-only fields
**Purpose:** Edit user account profile (NOT creator channel)

**Scope:** username, full_name, bio, language_preference, privacy settings

---

### Deprecated Pages (To Refactor/Remove)

#### ❌ **ProfilePage**
**Action:** Redirect to ChannelPage
**Reason:** Duplicate of public channel view

#### ❌ **EnhancedProfilePage**
**Action:** Merge useful features into ChannelPage
**Reason:** Another duplicate public profile view

#### ❌ **EnhancedCreatorProfilePage**
**Action:** Merge tabs/features into ChannelPage
**Reason:** Yet another public creator page variant

#### ❌ **UserProfilePage**
**Action:** Merge into EditProfilePage
**Reason:** Duplicate profile editor

---

## Part 3: Service Layer Consolidation

### Unified Service Architecture

#### **profileService.ts** (Simplified)
**Scope:** User account profile ONLY

**Methods:**
- `getProfile(userId)` - Basic account info
- `updateProfile(userId, updates)` - Account fields only
- `isPremium(userId)`
- `getTrustScore(userId)`

**Does NOT handle:** Channels, social links, reviews, creator features

---

#### **channelService.ts** (Canonical Creator Service)
**Scope:** All creator channel operations

**Core Methods:**
- `getChannelBySlug(slug)` - Public channel lookup
- `getMyChannels(userId)` - User's channels list
- `getChannel(channelId)` - Channel by ID
- `createChannel(userId, data)` - Create new channel
- `updateChannel(channelId, data)` - Update channel
- `deleteChannel(channelId)` - Delete channel

**Content Methods:**
- `getChannelVideos(channelId, filter)`
- `getChannelPlaylists(channelId)`
- `getChannelStats(channelId)`

**Social Methods:**
- `getChannelSocialLinks(channelId)` - From channel.social_links JSONB
- `updateChannelSocialLinks(channelId, links)` - Update JSONB

**Team Methods:**
- `getCollaborators(channelId)`
- `addCollaborator(channelId, userId, role)`

---

#### **Removed:** `profileEnhancedService.ts`
**Action:** Deprecate completely
**Reason:** Functionality split between `profileService` (account) and `channelService` (creator)

---

## Part 4: Social Links - Single Source of Truth

### Decision: Use `creator_channels.social_links` (JSONB)

**Rationale:**
- Social links are public creator branding
- Belong to channel, not user account
- JSONB is flexible for various platforms
- No need for separate table join

**Schema:**
```typescript
social_links: {
  youtube?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  facebook?: string;
  spotify?: string;
  soundcloud?: string;
  website?: string;
  [key: string]: string;
}
```

**Actions:**
1. Migrate data from `social_links` table to channel JSONB
2. Update ChannelEditPage to use JSONB
3. Deprecate `social_links` table (or repurpose for user account links if needed)

---

## Part 5: Routing & Navigation Cleanup

### New Canonical Routes

```typescript
// Public creator page
/channel/:channelSlug → ChannelPage

// Creator management
/my-channels → MyChannelsPage
/channel/:channelSlug/edit → ChannelEditPage
/channel-analytics/:channelId → ChannelAnalyticsPage

// User account
/edit-profile → EditProfilePage (account settings only)
/settings → SettingsPage (preferences)

// Legacy redirects
/profile → Redirect to primary channel or /my-channels
/profile/:userId → Redirect to user's primary channel
```

---

## Part 6: Channel Integration with GOROTI Modules

### ChannelPage Must Integrate:

**A) Live Streaming**
- Show if channel is currently live
- "LIVE" badge on avatar
- Redirect to live stream

**B) Gaming**
- Gaming badge if creator is in gaming universe
- Link to gaming profile/tournaments

**C) Legend System**
- Legend badge if creator has legend status
- Legend level display
- Link to legend rankings

**D) Marketplace**
- Shop tab if creator has products/services
- Product listings
- Service offerings

**E) Awards/Milestones**
- Subscriber milestones (100K, 1M, etc.)
- Platform awards
- Community achievements

**F) Support/Monetization**
- Tip/support button
- Premium membership offerings
- Fan club integration

---

## Part 7: Homepage Universe Display

### Requirement: Show all universes on homepage

**Implementation:**
- Use `universes.ts` data file
- Create UniverseGrid component
- Show universe cards with:
  - Icon
  - Name
  - Description
  - Creator count
  - Click → Browse universe content

**Location:** HomePage hero section or featured section

---

## Part 8: Database Cleanup Tasks

### Migrations Needed

1. **Add missing fields to creator_channels:**
   - Ensure `social_links` JSONB exists
   - Add universe/category mappings

2. **Remove redundant fields from profiles:**
   - Drop `subscriber_count` (use channel stats)
   - Drop `video_count` (use channel stats)
   - Consider: Keep `display_name` OR `full_name`, not both

3. **Migrate social_links data:**
   ```sql
   -- Copy social_links table data to channel JSONB
   UPDATE creator_channels c
   SET social_links = (
     SELECT jsonb_object_agg(sl.platform, sl.url)
     FROM social_links sl
     WHERE sl.user_id = c.user_id
   );
   ```

---

## Part 9: Implementation Checklist

### Phase 1: Service Consolidation
- [ ] Simplify profileService to account-only
- [ ] Enhance channelService with all creator methods
- [ ] Remove profileEnhancedService
- [ ] Update all imports

### Phase 2: Page Refactoring
- [ ] Enhance ChannelPage as canonical public page
- [ ] Simplify EditProfilePage to account fields only
- [ ] Add redirects from old profile pages to ChannelPage
- [ ] Update MyChannelsPage with improved UX

### Phase 3: Data Migration
- [ ] Migrate social links to channel JSONB
- [ ] Clean up duplicate profile fields
- [ ] Update RLS policies

### Phase 4: Integration
- [ ] Add universe grid to HomePage
- [ ] Integrate Live status in ChannelPage
- [ ] Add Legend badge to ChannelPage
- [ ] Add Gaming integration to ChannelPage
- [ ] Add Marketplace shop tab to ChannelPage

### Phase 5: Testing & Documentation
- [ ] Test all routes redirect correctly
- [ ] Verify data integrity
- [ ] Update API documentation
- [ ] Create migration guide for existing users

---

## Part 10: Success Criteria

✅ **Single canonical public creator page:** ChannelPage
✅ **Clear data ownership:** profiles (account) vs creator_channels (public)
✅ **No duplicate pages:** Old profile pages deprecated
✅ **Unified services:** One service per responsibility
✅ **Clean routing:** Logical, predictable URLs
✅ **Module integration:** Live, Gaming, Legend, Marketplace connected
✅ **Universe display:** All universes visible on homepage

---

## Timeline

**Phase 1:** Services (2 hours)
**Phase 2:** Pages (3 hours)
**Phase 3:** Data (1 hour)
**Phase 4:** Integration (2 hours)
**Phase 5:** Testing (1 hour)

**Total:** ~9 hours of focused development

---

**Status:** Ready for implementation
**Next Action:** Begin Phase 1 - Service consolidation
