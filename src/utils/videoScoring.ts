import { Video, VideoScore, User, UserPreferences } from '../types';

export interface ScoringWeights {
  engagement: number;
  support: number;
  freshness: number;
  diversity: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  engagement: 0.4,
  support: 0.3,
  freshness: 0.2,
  diversity: 0.1,
};

export function computeEngagementScore(video: Video): number {
  if (video.viewCount === 0) return 0;

  const likesWeight = video.likeCount * 2;
  const commentsWeight = video.commentCount * 3;
  const watchTimeWeight = video.avgWatchTime;

  return (likesWeight + commentsWeight + watchTimeWeight) / Math.max(video.viewCount, 1);
}

export function computeSupportScore(creator: User): number {
  return creator.subscriberCount * 0.5;
}

export function computeFreshnessScore(video: Video): number {
  const now = Date.now();
  const videoDate = new Date(video.createdAt).getTime();
  const hoursSinceCreation = (now - videoDate) / (1000 * 60 * 60);

  return Math.max(0, 100 - hoursSinceCreation);
}

export function computeDiversityBoost(creator: User): number {
  const followers = creator.subscriberCount;

  if (followers < 1000) return 30;
  if (followers < 10000) return 20;
  if (followers < 100000) return 10;
  if (followers < 500000) return 0;
  if (followers < 1000000) return -10;

  return -15;
}

export function computeVideoScore(
  video: Video,
  creator: User,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): VideoScore {
  const engagementScore = computeEngagementScore(video);
  const supportScore = computeSupportScore(creator);
  const freshnessScore = computeFreshnessScore(video);
  const diversityBoost = computeDiversityBoost(creator);

  const finalScore =
    engagementScore * weights.engagement +
    supportScore * weights.support +
    freshnessScore * weights.freshness +
    diversityBoost * weights.diversity;

  return {
    id: crypto.randomUUID(),
    videoId: video.id,
    engagementScore,
    supportScore,
    freshnessScore,
    diversityBoost,
    finalScore: Math.max(0, finalScore),
    updatedAt: new Date().toISOString(),
  };
}

export function generateFeed(
  videos: Video[],
  creators: Map<string, User>,
  limit: number = 50
): Array<Video & { score: VideoScore }> {
  const videosWithScores = videos.map(video => {
    const creator = creators.get(video.creatorId) || creators.get(video.userId);
    if (!creator) return null;

    const score = computeVideoScore(video, creator);
    return { ...video, score };
  }).filter((v): v is Video & { score: VideoScore } => v !== null);

  return videosWithScores
    .sort((a, b) => b.score.finalScore - a.score.finalScore)
    .slice(0, limit);
}

export function generatePersonalizedFeed(
  videos: Video[],
  creators: Map<string, User>,
  user: User,
  subscriptions: string[],
  limit: number = 50
): Array<Video & { score: VideoScore }> {
  const isDiscovering = user.userStatus === 'viewer';
  const isSupporter = user.userStatus === 'supporter' || user.userStatus === 'creator';

  let filteredVideos = videos;

  if (isDiscovering) {
    filteredVideos = videos.filter(v => v.isShort || !v.isPremium);
  } else if (isSupporter) {
    filteredVideos = videos.filter(v =>
      !v.isPremium || subscriptions.includes(v.creatorId)
    );
  }

  return generateFeed(filteredVideos, creators, limit);
}

export function generateUniverseFeed(
  videos: Video[],
  creators: Map<string, User>,
  universeId: string,
  subUniverseId?: string,
  limit: number = 50
): Array<Video & { score: VideoScore }> {
  let filteredVideos = videos.filter(v => v.universeId === universeId);

  if (subUniverseId) {
    filteredVideos = filteredVideos.filter(v => v.subUniverseId === subUniverseId);
  }

  return generateFeed(filteredVideos, creators, limit);
}

export function generatePreferenceBasedFeed(
  videos: Video[],
  creators: Map<string, User>,
  preferences: UserPreferences,
  subscriptions: string[],
  limit: number = 50
): Array<Video & { score: VideoScore }> {
  let filteredVideos = videos;

  if (preferences.universeIds.length > 0) {
    filteredVideos = filteredVideos.filter(
      v => v.universeId && preferences.universeIds.includes(v.universeId)
    );
  }

  if (preferences.subUniverseIds.length > 0) {
    filteredVideos = filteredVideos.filter(
      v => v.subUniverseId && preferences.subUniverseIds.includes(v.subUniverseId)
    );
  }

  filteredVideos = filteredVideos.filter(
    v => !v.isPremium || subscriptions.includes(v.creatorId)
  );

  return generateFeed(filteredVideos, creators, limit);
}
