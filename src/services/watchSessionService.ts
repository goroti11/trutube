import { supabase } from '../lib/supabase';

export interface WatchSession {
  id?: string;
  video_id: string;
  user_id?: string | null;
  session_start: string;
  session_end?: string | null;
  watch_time_seconds: number;
  interactions_count: number;
  device_fingerprint: string;
  ip_hash: string;
  is_validated: boolean;
  trust_score: number;
}

export const watchSessionService = {
  async startSession(
    videoId: string,
    userId: string | null
  ): Promise<string | null> {
    const deviceFingerprint = generateDeviceFingerprint();

    const { data, error } = await supabase
      .from('watch_sessions')
      .insert({
        video_id: videoId,
        user_id: userId,
        session_start: new Date().toISOString(),
        watch_time_seconds: 0,
        interactions_count: 0,
        device_fingerprint: deviceFingerprint,
        ip_hash: '',
        is_validated: false,
        trust_score: 0.5,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error starting watch session:', error);
      return null;
    }

    return data.id;
  },

  async updateSession(
    sessionId: string,
    watchTimeSeconds: number,
    interactionsCount: number
  ): Promise<void> {
    const { error } = await supabase
      .from('watch_sessions')
      .update({
        watch_time_seconds: watchTimeSeconds,
        interactions_count: interactionsCount,
        session_end: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating watch session:', error);
    }
  },

  async validateSession(sessionId: string): Promise<void> {
    const trustScore = calculateTrustScore();

    const { error } = await supabase
      .from('watch_sessions')
      .update({
        is_validated: trustScore > 0.6,
        trust_score: trustScore,
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error validating session:', error);
    }
  },
};

function generateDeviceFingerprint(): string {
  const navigator = window.navigator;
  const screen = window.screen;

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
  ];

  return btoa(components.join('|')).substring(0, 32);
}

function calculateTrustScore(): number {
  const hasMouseMovement = true;
  const hasKeyboardInput = false;
  const hasFocus = document.hasFocus();
  const isVisible = !document.hidden;

  let score = 0.5;

  if (hasMouseMovement) score += 0.15;
  if (hasKeyboardInput) score += 0.1;
  if (hasFocus) score += 0.15;
  if (isVisible) score += 0.1;

  return Math.min(1, score);
}
