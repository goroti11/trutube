# Goroti Anti-Fake Views & Community Moderation System

## Problem Statement

YouTube suffers from:
- Purchased views
- Bot traffic
- Fake engagement
- Arbitrary content strikes
- Opaque moderation decisions

## Goroti Solution

### Part 1: Anti-Fake Views System

A view = **real human interaction**, not just a page load.

## How Views Are Validated

### Validation Formula

```
validated_view = watch_time + interactions + trust_score
```

A view counts as **valid** when ALL conditions are met:

1. **Watch Time**: ≥30 seconds OR ≥30% of video duration (whichever is less)
2. **Interactions**: At least 1 interaction (pause, play, volume change, fullscreen, seek)
3. **Trust Score**: Session trust score ≥0.3

### What We Track Per View

#### `watch_sessions` Table

Each viewing session records:

```typescript
{
  videoId: string;
  userId: string | null;           // Authenticated user or anonymous
  sessionStart: timestamp;
  sessionEnd: timestamp;
  watchTimeSeconds: number;         // Actual seconds watched
  interactionsCount: number;        // User interactions during session
  deviceFingerprint: string;        // Device identifier
  ipHash: string;                   // Hashed IP (privacy-preserving)
  isValidated: boolean;             // Does this count as a real view?
  trustScore: number;               // 0-1, confidence this is real
}
```

### Session Trust Score Calculation

**Base Score**: 0.5 (neutral)

**Bonuses:**
- User has high overall trust score: use their score
- Watch time >60 seconds: +0.1
- Interactions >3: +0.1
- Device previously seen: +0.05

**Penalties:**
- Repeated view from same session: -0.2
- Suspicious pattern detected: -0.3

**Formula:**
```typescript
sessionTrust = min(1, max(0,
  userTrust + watchBonus + interactionBonus + deviceBonus - penalties
))
```

## User Trust Scores

### Why Trust Scores?

Not all users are equal:
- New accounts might be bots
- Established users are more trustworthy
- Users who consistently engage authentically build trust
- Users with suspicious patterns lose trust

### `user_trust_scores` Table

```typescript
{
  userId: string;
  overallTrust: number;           // 0-1, composite score
  viewAuthenticity: number;       // How real their views are
  reportAccuracy: number;         // How accurate their reports are
  engagementQuality: number;      // Quality of engagement
  accountAgeDays: number;
  verifiedActionsCount: number;
  suspiciousActionsCount: number;
}
```

### Trust Score Components

#### 1. View Authenticity (40% weight)
- Based on validated vs. suspicious sessions
- Increases with legitimate viewing patterns
- Decreases with bot-like behavior

#### 2. Report Accuracy (30% weight)
- Increases when reports are confirmed valid
- Decreases when reports are dismissed
- Discourages false reporting

#### 3. Engagement Quality (30% weight)
- Comment quality
- Like patterns
- Subscription behavior

### Overall Trust Calculation

```typescript
overallTrust = (
  viewAuthenticity * 0.4 +
  reportAccuracy * 0.3 +
  engagementQuality * 0.3
)

// Account age bonus
if (accountAgeDays > 365) overallTrust += 0.1
else if (accountAgeDays > 180) overallTrust += 0.05

// Suspicious action penalty
if (suspiciousActionsCount > 5) overallTrust -= 0.2

// Clamp to 0-1
overallTrust = min(1, max(0, overallTrust))
```

## Suspicious Pattern Detection

### What We Look For

1. **Rapid Fire Views**
   - Multiple views in <60 seconds
   - Same device/IP
   - Zero interactions

2. **Bot Patterns**
   - Identical watch times across videos
   - No interactions ever
   - Unusual timing patterns

3. **View Farms**
   - Same IP for hundreds of views
   - Different devices but same behavior
   - Coordinated timing

### Detection Logic

```typescript
function detectSuspiciousPattern(sessions: WatchSession[]): boolean {
  const recent = sessions.slice(0, 10);

  const sameDevice = all same device fingerprint
  const sameIP = all same IP hash
  const rapidFire = average interval <60 seconds
  const noInteraction = all have 0 interactions

  return (sameDevice && sameIP && rapidFire) || (rapidFire && noInteraction);
}
```

## Video Quality & Authenticity Scores

### Each Video Gets 2 Scores

#### 1. Quality Score (0-1)

Measures actual content quality:

```typescript
qualityScore = (
  avgWatchPercentage * 0.4 +      // How much people watch
  engagementRate * 0.3 +           // Likes + comments per view
  completionRate * 0.3             // % who watch to end
)
```

#### 2. Authenticity Score (0-1)

Confidence that views are real:

```typescript
authenticityScore = (
  validatedViews / totalViews - suspicionPenalty
)

suspicionPenalty = min(0.5, suspiciousPatternCount * 0.1)
```

### Why This Matters

- Videos with low authenticity scores get deprioritized
- Creators see their authenticity score and can appeal
- Buy views = hurt your ranking

## Part 2: Community Moderation System

### The Problem with Traditional Moderation

- Opaque decisions
- Automated strikes
- No context
- No appeal process
- Central authority bias

### Goroti's 3-Level System

```
Level 1: Community Reports
    ↓
Level 2: Peer Creator Voting
    ↓
Level 3: Goroti Team (last resort)
```

## Level 1: Community Reports

### Anyone Can Report

Users submit reports through `content_reports`:

```typescript
{
  contentType: 'video' | 'comment' | 'profile';
  contentId: string;
  reporterId: string;
  reason: 'spam' | 'harassment' | 'misinformation' | 'copyright' | 'inappropriate' | 'other';
  description: string;
  reporterTrustAtTime: number;    // Reporter's trust when reported
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
}
```

### Report Reasons (Clear Categories)

1. **Spam** - Repetitive, misleading, promotional
2. **Harassment** - Bullying, threats, hate
3. **Misinformation** - False or misleading info
4. **Copyright** - Unauthorized use
5. **Inappropriate** - Sexual, violent, etc.
6. **Other** - Other guideline violations

### False Reports Have Consequences

- Tracked in reporter's `reportAccuracy` score
- Too many false reports → lower trust score
- Lower trust = less weight in future reports

## Level 2: Peer Creator Voting

### Who Can Vote?

Only creators with:
- Creator status (not just viewers)
- Trust score ≥0.6
- Ideally in the same universe (context matters)

### `moderation_votes` Table

```typescript
{
  reportId: string;
  voterId: string;
  vote: 'remove' | 'keep' | 'warn';
  comment: string;                 // Explanation
  voterTrustAtTime: number;        // Weight of this vote
}
```

### Vote Options

1. **Remove** - Content violates guidelines
2. **Warn** - Issue warning to creator
3. **Keep** - No violation, dismiss report

### Vote Weighting

Not all votes are equal:

```
voteWeight = voterTrustScore
```

A trusted creator (0.9 trust) has more weight than a new creator (0.6 trust).

### Decision Threshold

Content is masked when:

```
weightedRemoveVotes / totalWeightedVotes > 0.6
```

Requires 60% weighted majority to take action.

## Level 3: Goroti Team Review

Only for:
- Clear legal violations (copyright, illegal content)
- Inconclusive peer votes
- Appeals from creators

## Content Status System

### `content_status` Table

Tracks moderation state:

```typescript
{
  contentType: 'video' | 'comment' | 'profile';
  contentId: string;
  status: 'visible' | 'masked' | 'under_review' | 'removed';
  reason: string;
  canAppeal: boolean;
  appealDeadline: timestamp;
  maskedAt: timestamp;
}
```

### Key Principle: Masked, Not Deleted

- Content is **masked**, not deleted
- Creator can see it and appeal
- Can be restored if appeal succeeds
- Transparency > censorship

### Appeal Process

1. Creator sees content masked
2. Sees moderation votes and reasoning
3. Can write appeal with evidence
4. Community or team reviews appeal
5. Decision with full transparency

## Benefits of This System

### For Platform Health

✅ **Authenticity**
- Only real views count
- Bot traffic doesn't inflate metrics
- Fair representation of popularity

✅ **Quality Over Quantity**
- Quality score rewards good content
- Authenticity score penalizes fake engagement
- Algorithm prioritizes genuine engagement

✅ **Fair Moderation**
- Community decides together
- Transparent reasoning
- Right to appeal
- Context-aware (peer review)

### For Creators

✅ **Understand Their Metrics**
- See quality score breakdown
- See authenticity score
- Understand what counts as a view

✅ **Fair Treatment**
- No arbitrary strikes
- See who voted and why
- Can appeal decisions
- Mistakes can be corrected

### For Users

✅ **Trust the Platform**
- Know metrics are real
- Community-driven moderation
- Transparent decisions

## Implementation Status

### Database

✅ `watch_sessions` - Track all viewing sessions
✅ `user_trust_scores` - User reputation system
✅ `content_reports` - Community reporting
✅ `moderation_votes` - Peer creator voting
✅ `content_status` - Content visibility state

### Functions

✅ Auto-validate watch sessions (trigger)
✅ Auto-calculate trust scores (trigger)
✅ Suspicious pattern detection
✅ Quality score calculation
✅ Authenticity score calculation

### Components

✅ `ReportContentModal` - Report submission UI
✅ `ModerationVotePanel` - Peer voting interface

### Utils

✅ `viewValidation.ts` - All validation logic
  - validateWatchSession()
  - calculateSessionTrustScore()
  - detectSuspiciousPattern()
  - calculateAuthenticityScore()
  - calculateQualityScore()
  - updateUserTrustScore()

## Example Scenarios

### Scenario 1: Bot Attack

**What Happens:**
1. Bot farm sends 10,000 views to video
2. Views have:
   - <5 second watch time
   - Zero interactions
   - Same IP ranges
3. Session trust scores all <0.2
4. Views marked as NOT validated
5. Video's authenticity score drops
6. Video gets deprioritized in feed

**Result:** Bot views don't help, actually hurt.

### Scenario 2: Legitimate Viral Video

**What Happens:**
1. Video gets 100,000 views organically
2. Most sessions have:
   - >30 second watch time
   - 2-3 interactions per session
   - Trust scores 0.5-0.9
3. 85% of views validated
4. High authenticity score (0.85)
5. High quality score (0.78)
6. Algorithm prioritizes video

**Result:** Real engagement gets rewarded.

### Scenario 3: False Copyright Claim

**What Happens:**
1. User reports video as copyright violation
2. Report enters peer review
3. 15 trusted creators vote:
   - 13 vote "Keep" (weighted 11.2)
   - 2 vote "Remove" (weighted 1.4)
4. Keep votes win (88% weighted)
5. Report dismissed
6. Reporter's accuracy score drops
7. Video stays visible

**Result:** Fair outcome, false reporter penalized.

### Scenario 4: Legitimate Harassment

**What Happens:**
1. Multiple users report harassing comment
2. Enters peer review
3. 20 creators vote:
   - 18 vote "Remove" (weighted 16.1)
   - 2 vote "Keep" (weighted 1.5)
4. Remove votes win (91% weighted)
5. Comment masked
6. Creator can appeal within 7 days
7. Reporters' accuracy scores increase

**Result:** Clear violation handled properly.

## Future Enhancements

### Phase 1 (MVP - Current)
- Basic view validation
- Trust score system
- Community reporting
- Peer voting

### Phase 2 (Growth)
- Machine learning for pattern detection
- Real-time fraud detection
- Advanced fingerprinting
- Appeal workflow

### Phase 3 (Scale)
- AI-assisted moderation (suggestions only)
- Cross-platform fraud detection
- Industry-wide authenticity standards
- Reputation portability

## Key Metrics to Track

### Platform Health
- % of validated views
- Average session trust score
- Suspicious pattern detection rate
- False positive rate

### Moderation Health
- Average time to resolution
- Appeal success rate
- Voter participation rate
- Community satisfaction score

### Creator Trust
- Average creator trust score
- Creator appeal rate
- Strike reversal rate
- Creator retention by trust score

---

**This system makes Goroti fundamentally different from YouTube: real views, transparent moderation, and community-driven decisions.**
