import { WatchSession, Video, UserTrustScore } from '../types';

export interface ViewValidationRules {
  minWatchTimeSeconds: number;
  minInteractions: number;
  minTrustScore: number;
}

export const DEFAULT_VALIDATION_RULES: ViewValidationRules = {
  minWatchTimeSeconds: 30,
  minInteractions: 1,
  minTrustScore: 0.3,
};

export function validateWatchSession(
  session: WatchSession,
  video: Video,
  rules: ViewValidationRules = DEFAULT_VALIDATION_RULES
): boolean {
  const minWatchTime = Math.min(
    rules.minWatchTimeSeconds,
    video.duration * 0.3
  );

  const hasEnoughWatchTime = session.watchTimeSeconds >= minWatchTime;
  const hasInteractions = session.interactionsCount >= rules.minInteractions;
  const isTrustedEnough = session.trustScore >= rules.minTrustScore;

  return hasEnoughWatchTime && hasInteractions && isTrustedEnough;
}

export function calculateSessionTrustScore(
  userTrustScore: UserTrustScore | null,
  sessionData: {
    watchTimeSeconds: number;
    interactionsCount: number;
    isRepeatedView: boolean;
    deviceKnown: boolean;
  }
): number {
  let score = 0.5;

  if (userTrustScore) {
    score = userTrustScore.overallTrust;
  }

  if (sessionData.watchTimeSeconds > 60) {
    score += 0.1;
  }

  if (sessionData.interactionsCount > 3) {
    score += 0.1;
  }

  if (sessionData.deviceKnown) {
    score += 0.05;
  }

  if (sessionData.isRepeatedView) {
    score -= 0.2;
  }

  return Math.max(0, Math.min(1, score));
}

export function detectSuspiciousPattern(sessions: WatchSession[]): boolean {
  if (sessions.length < 2) return false;

  const recentSessions = sessions.slice(0, 10);

  const sameDevice = recentSessions.every(
    (s) => s.deviceFingerprint === recentSessions[0].deviceFingerprint
  );
  const sameIP = recentSessions.every((s) => s.ipHash === recentSessions[0].ipHash);
  const rapidFire = recentSessions.length > 5 && areSessionsRapidFire(recentSessions);
  const lowInteraction = recentSessions.every((s) => s.interactionsCount === 0);

  return (sameDevice && sameIP && rapidFire) || (rapidFire && lowInteraction);
}

function areSessionsRapidFire(sessions: WatchSession[]): boolean {
  const timestamps = sessions.map((s) => new Date(s.sessionStart).getTime());
  const intervals = [];

  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i - 1] - timestamps[i]);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

  return avgInterval < 60000;
}

export function calculateAuthenticityScore(
  totalViews: number,
  validatedViews: number,
  suspiciousPatternCount: number
): number {
  if (totalViews === 0) return 0.5;

  const validationRatio = validatedViews / totalViews;

  const suspicionPenalty = Math.min(0.5, suspiciousPatternCount * 0.1);

  const authenticityScore = validationRatio - suspicionPenalty;

  return Math.max(0, Math.min(1, authenticityScore));
}

export function calculateQualityScore(
  video: Video,
  validatedWatchSessions: WatchSession[]
): number {
  if (video.viewCount === 0) return 0.5;

  const avgWatchPercentage = video.avgWatchTime / video.duration;

  const engagementRate =
    (video.likeCount + video.commentCount) / Math.max(video.viewCount, 1);

  const completionRate =
    validatedWatchSessions.filter(
      (s) => s.watchTimeSeconds / video.duration >= 0.8
    ).length / Math.max(validatedWatchSessions.length, 1);

  const qualityScore =
    avgWatchPercentage * 0.4 + engagementRate * 0.3 + completionRate * 0.3;

  return Math.max(0, Math.min(1, qualityScore));
}

export function updateUserTrustScore(
  currentScore: UserTrustScore,
  updates: {
    newValidatedViews?: number;
    newSuspiciousActions?: number;
    newAccurateReports?: number;
    newInaccurateReports?: number;
  }
): UserTrustScore {
  const updated = { ...currentScore };

  if (updates.newValidatedViews) {
    updated.viewAuthenticity = Math.min(
      1,
      updated.viewAuthenticity + updates.newValidatedViews * 0.01
    );
  }

  if (updates.newSuspiciousActions) {
    updated.viewAuthenticity = Math.max(
      0,
      updated.viewAuthenticity - updates.newSuspiciousActions * 0.05
    );
    updated.suspiciousActionsCount += updates.newSuspiciousActions;
  }

  if (updates.newAccurateReports) {
    updated.reportAccuracy = Math.min(
      1,
      updated.reportAccuracy + updates.newAccurateReports * 0.05
    );
  }

  if (updates.newInaccurateReports) {
    updated.reportAccuracy = Math.max(
      0,
      updated.reportAccuracy - updates.newInaccurateReports * 0.1
    );
  }

  updated.overallTrust =
    updated.viewAuthenticity * 0.4 +
    updated.reportAccuracy * 0.3 +
    updated.engagementQuality * 0.3;

  if (updated.accountAgeDays > 365) {
    updated.overallTrust = Math.min(1.0, updated.overallTrust + 0.1);
  } else if (updated.accountAgeDays > 180) {
    updated.overallTrust = Math.min(1.0, updated.overallTrust + 0.05);
  }

  if (updated.suspiciousActionsCount > 5) {
    updated.overallTrust = Math.max(0.0, updated.overallTrust - 0.2);
  }

  updated.updatedAt = new Date().toISOString();

  return updated;
}
