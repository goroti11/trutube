export type UserStatus = 'viewer' | 'supporter' | 'creator' | 'pro' | 'elite';
export type SubscriptionTier = 'silver' | 'gold' | 'platinum';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export type ReportReason = 'spam' | 'harassment' | 'misinformation' | 'copyright' | 'inappropriate' | 'other';
export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';
export type ModerationVote = 'remove' | 'keep' | 'warn';
export type ContentStatusType = 'visible' | 'masked' | 'under_review' | 'removed';
export type ContentType = 'video' | 'comment' | 'profile';

export interface User {
  id: string;
  username?: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  userStatus: UserStatus;
  subscriberCount: number;
  uploadFrequency: number;
  isVerified?: boolean;
  trustScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Universe {
  id: string;
  name: string;
  slug: string;
  description: string;
  colorPrimary: string;
  colorSecondary: string;
  createdAt: string;
  subUniverses?: SubUniverse[];
}

export interface SubUniverse {
  id: string;
  universeId: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

export interface Video {
  id: string;
  userId: string;
  creatorId: string;
  universeId?: string;
  subUniverseId?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  isShort: boolean;
  isPremium: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  avgWatchTime: number;
  categoryId?: string;
  isTrending?: boolean;
  isMasked?: boolean;
  qualityScore?: number;
  authenticityScore?: number;
  createdAt: string;
  user?: User;
}

export interface VideoScore {
  id: string;
  videoId: string;
  engagementScore: number;
  supportScore: number;
  freshnessScore: number;
  diversityBoost: number;
  finalScore: number;
  updatedAt: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  content: string;
  likeCount: number;
  createdAt: string;
  user?: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface MembershipTier {
  id: string;
  creatorId?: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  benefits: string[];
  badgeColor: string;
}

export interface Subscription {
  id: string;
  subscriberId: string;
  supporterId: string;
  creatorId: string;
  tierId?: string;
  tier: SubscriptionTier;
  amount: number;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  createdAt: string;
}

export interface Tip {
  id: string;
  fromUserId: string;
  toCreatorId: string;
  amount: number;
  message: string;
  createdAt: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toCreatorId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreatorRevenue {
  id: string;
  creatorId: string;
  totalRevenue: number;
  subscriptionRevenue: number;
  tipsRevenue: number;
  premiumRevenue: number;
  liveRevenue: number;
  month: string;
  updatedAt: string;
}

export interface DashboardStats {
  revenue: CreatorRevenue;
  videos: Array<Video & { score?: VideoScore }>;
  totalViews: number;
  totalSubscribers: number;
  supportersCount: number;
  growth: {
    subscribers: number;
    revenue: number;
    views: number;
  };
}

export interface CreatorUniverses {
  id: string;
  creatorId: string;
  mainUniverseId: string;
  subUniverseIds: string[];
  createdAt: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  universeIds: string[];
  subUniverseIds: string[];
  updatedAt: string;
}

export interface WatchSession {
  id: string;
  videoId: string;
  userId?: string;
  sessionStart: string;
  sessionEnd?: string;
  watchTimeSeconds: number;
  interactionsCount: number;
  deviceFingerprint: string;
  ipHash: string;
  isValidated: boolean;
  trustScore: number;
  createdAt: string;
}

export interface UserTrustScore {
  id: string;
  userId: string;
  overallTrust: number;
  viewAuthenticity: number;
  reportAccuracy: number;
  engagementQuality: number;
  accountAgeDays: number;
  verifiedActionsCount: number;
  suspiciousActionsCount: number;
  updatedAt: string;
}

export interface ContentReport {
  id: string;
  contentType: ContentType;
  contentId: string;
  reporterId: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reporterTrustAtTime: number;
  createdAt: string;
  reporter?: User;
}

export interface ModerationVoteRecord {
  id: string;
  reportId: string;
  voterId: string;
  vote: ModerationVote;
  comment: string;
  voterTrustAtTime: number;
  createdAt: string;
  voter?: User;
}

export interface ContentStatus {
  id: string;
  contentType: ContentType;
  contentId: string;
  status: ContentStatusType;
  reason: string;
  canAppeal: boolean;
  appealDeadline?: string;
  maskedAt?: string;
  updatedAt: string;
}
