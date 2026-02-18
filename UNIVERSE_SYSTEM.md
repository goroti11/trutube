# TruTube Universe System

## Core Concept

TruTube uses a structured **Universe → Sub-Universe** system to organize content and personalize feeds. This is what fundamentally differentiates TruTube from platforms like YouTube.

## Structure

### 7 Main Universes

1. **Music** - Clips, lives, freestyles, concerts
2. **Game** - Streams, highlights, tournaments
3. **Learn** (Know) - Formations, crypto, AI, business
4. **Culture** - Podcasts, debates, storytelling, cinema
5. **Life** - Dating, vlogs, fitness, lifestyle
6. **Mind** - Personal development, spirituality, meditation
7. **Lean** - Developer careers, tech content

Each universe has its own color scheme and identity.

## How It Works

### For Creators

When a creator joins TruTube, they **must**:

1. Choose **1 main universe** (e.g., Music, Game, Learn)
2. Select **1+ sub-universes** within that universe (e.g., Freestyle, Clips)

Example:
```
Rapper Creator:
- Main Universe: Music
- Sub-Universes: Freestyle, Clips, Lives
```

This information is stored in the `creator_universes` table.

### For Videos

Every video **must have**:
- 1 universe
- 1 sub-universe

Example:
```
Video: "Freestyle Session #12"
- Universe: Music
- Sub-Universe: Freestyle
```

Videos without universe/sub-universe classification cannot be published.

### For Users

Users customize their feed by:

1. Selecting preferred **universes** (e.g., Music, Game, Mind)
2. Selecting preferred **sub-universes** within those (e.g., Freestyle, Clips, Meditation)

Their feed shows **ONLY** content from their selected preferences.

## Database Schema

### Tables

#### `universes`
```sql
- id (uuid)
- name (text) - e.g., "Music", "Game"
- slug (text) - e.g., "music", "game"
- description (text)
- color_primary (text) - hex color
- color_secondary (text) - hex color
```

#### `sub_universes`
```sql
- id (uuid)
- universe_id (uuid) → references universes
- name (text) - e.g., "Freestyle", "Clips"
- slug (text) - e.g., "freestyle", "clips"
- description (text)
```

#### `creator_universes`
```sql
- id (uuid)
- creator_id (uuid) → references profiles
- main_universe_id (uuid) → references universes
- sub_universe_ids (uuid[]) - array of sub-universe IDs
```

#### `user_preferences`
```sql
- id (uuid)
- user_id (uuid) → references profiles
- universe_ids (uuid[]) - preferred universes
- sub_universe_ids (uuid[]) - preferred sub-universes
```

#### `videos` (updated)
```sql
- universe_id (uuid) → references universes [MANDATORY]
- sub_universe_id (uuid) → references sub_universes [MANDATORY]
```

## Complete Universe Breakdown

### 🎵 Music

**Genres:**
- Afrobeat, Amapiano
- Hip-Hop / Rap, Trap, Drill
- R&B, Soul, Funk
- Jazz, Blues
- Rock, Pop
- Reggae, Dancehall
- Latin
- Electro
- Gospel
- Classique (Classical)

**Formats:**
- Freestyle
- Clips (Music Videos)
- Lives
- Concerts
- Exclus (Exclusive Content)
- Beatmaking

### 🎮 Game

**Game Types:**
- FPS (First-Person Shooter)
- Battle Royale
- MOBA (Multiplayer Online Battle Arena)
- RPG (Role-Playing Games)
- Sport (FIFA, NBA, etc.)

**Formats:**
- Stream (Live Gaming)
- Highlights (Best Moments)
- Tournois (Tournaments)
- Speedrun

### 🎓 Learn (Know)

**Topics:**
- Formations (Training/Courses)
- Finance (Personal Finance)
- Crypto (Cryptocurrency & Blockchain)
- IA (Artificial Intelligence)
- Business & Entrepreneurship
- Marketing

### 🎭 Culture

**Content Types:**
- Podcasts
- Débats (Debates)
- Storytelling
- Cinéma (Film & Cinema)
- Humour (Comedy)

### ❤️ Life

**Topics:**
- Dating
- Rencontres (Meeting People)
- Lives Privés (Private Lives)
- Vlogs
- Fitness

### 🧠 Mind

**Topics:**
- Développement Personnel (Personal Development)
- Spiritualité (Spirituality)
- Méditation (Meditation)
- Motivation

### 💻 Lean (Tech)

**Topics:**
- Développeur (Developer)
- Frontend Development
- Backend Development
- UI/UX Design
- Cybersécurité (Cybersecurity)

## Feed Navigation

### Traditional YouTube Approach
```
[Mixed Feed]
- Random music video
- Random gaming stream
- Random tutorial
- Random vlog
```

### TruTube Approach
```
Navigation Bar:
[Music] [Game] [Learn] [Culture] [Life] [Mind] [Lean]

Selected: Music
  Tabs: [Freestyle] [Clips] [Lives] [Concerts]

  Selected Tab: Freestyle
    → Shows only Freestyle content
    → Scored by algorithm
    → Personalized based on preferences
```

## Feed Algorithm Integration

The feed generation now includes universe filtering:

### 1. `generateUniverseFeed()`
Generate feed for a specific universe (and optionally sub-universe):

```typescript
generateUniverseFeed(
  videos,
  creators,
  universeId: "music-uuid",
  subUniverseId: "freestyle-uuid",  // optional
  limit: 50
)
```

### 2. `generatePreferenceBasedFeed()`
Generate feed based on user preferences:

```typescript
generatePreferenceBasedFeed(
  videos,
  creators,
  userPreferences: {
    universeIds: ["music-uuid", "game-uuid"],
    subUniverseIds: ["freestyle-uuid", "stream-uuid"]
  },
  subscriptions,
  limit: 50
)
```

## User Experience Flow

### New User Flow

1. User signs up
2. System shows `UserPreferencesModal`
3. User selects preferred universes
4. User selects preferred sub-universes
5. Feed is personalized immediately

### Creator Onboarding Flow

1. Creator signs up
2. System shows `CreatorUniverseSelector`
3. Creator chooses main universe (required)
4. Creator selects sub-universes (1+ required)
5. When uploading videos, must select sub-universe

### Browsing Flow

1. User sees top navigation with universes
2. Clicks on "Music"
3. Sees sub-universe tabs: [Freestyle] [Clips] [Lives] [Concerts]
4. Clicks "Freestyle"
5. Feed shows only Freestyle videos from Music universe
6. Algorithm applies diversity boost and scoring

## Components

### `UniverseNavigation`
Top navigation component showing:
- All universes as buttons
- Selected universe's sub-universes as tabs

### `UserPreferencesModal`
Modal for users to select:
- Preferred universes (multiple selection)
- Preferred sub-universes (multiple selection)

### `CreatorUniverseSelector`
Onboarding screen for creators:
- Select 1 main universe (required)
- Select 1+ sub-universes (required)

## Benefits

### For Creators
✅ Clear content categorization
✅ Reach target audience precisely
✅ No content drowning in "everything feed"
✅ Fair distribution within niche

### For Users
✅ Only see content they care about
✅ No irrelevant videos
✅ Discover new creators in preferred niches
✅ Clean, organized navigation

### For the Platform
✅ Better content organization
✅ Higher engagement (relevant content)
✅ Fair distribution of visibility
✅ Clear product differentiation

## Key Rules

1. **No Video Without Universe**: Videos must have both universe and sub-universe
2. **Creator Commitment**: Creators choose their niche upfront
3. **User Control**: Users decide what appears in their feed
4. **No Generic Feed**: Every feed is personalized by universe preferences
5. **Clear Navigation**: Universes → Sub-Universes → Content

## Implementation Status

✅ Database schema with all tables
✅ 7 universes with 50+ sub-universes populated
✅ TypeScript types updated
✅ Universe navigation component
✅ User preferences modal
✅ Creator onboarding selector
✅ Feed algorithm with universe filtering
✅ Row-level security for all tables

## Next Steps

1. Connect components to Supabase
2. Implement video upload with universe selection
3. Build universe-specific feed pages
4. Add analytics by universe/sub-universe
5. Create universe discovery features

---

**This system is the core differentiator for TruTube. It solves the "everything mixed together" problem of traditional platforms.**
