import { supabase } from '../lib/supabase';

export interface UserReferralCode {
  id: string;
  user_id: string;
  code: string;
  total_referrals: number;
  total_rewards: number;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string | null;
  referral_code: string;
  status: 'pending' | 'completed' | 'rewarded';
  reward_trucoin: number;
  created_at: string;
  completed_at: string | null;
}

const REWARD_PER_REFERRAL = 50;

function generateCode(userId: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seed = userId.replace(/-/g, '').slice(0, 8);
  let code = 'GRT';
  for (let i = 0; i < 6; i++) {
    const idx = parseInt(seed[i] || '0', 16) % chars.length;
    code += chars[idx];
  }
  return code;
}

export const referralService = {
  async getOrCreateReferralCode(userId: string): Promise<UserReferralCode | null> {
    const { data: existing } = await supabase
      .from('user_referral_codes')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) return existing as UserReferralCode;

    const code = generateCode(userId) + Math.floor(Math.random() * 100).toString().padStart(2, '0');

    const { data, error } = await supabase
      .from('user_referral_codes')
      .insert([{ user_id: userId, code }])
      .select()
      .single();

    if (error) {
      console.error('Error creating referral code:', error);
      return null;
    }
    return data as UserReferralCode;
  },

  async getReferralStats(userId: string): Promise<{ total: number; completed: number; pending: number; rewards: number }> {
    const { data } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);

    if (!data) return { total: 0, completed: 0, pending: 0, rewards: 0 };

    const total = data.length;
    const completed = data.filter(r => r.status === 'completed' || r.status === 'rewarded').length;
    const pending = data.filter(r => r.status === 'pending').length;
    const rewards = data.filter(r => r.status === 'rewarded').reduce((sum, r) => sum + r.reward_trucoin, 0);

    return { total, completed, pending, rewards };
  },

  async getReferralList(userId: string): Promise<Referral[]> {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data as Referral[];
  },

  async useReferralCode(code: string, newUserId: string): Promise<boolean> {
    const { data: codeData } = await supabase
      .from('user_referral_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .maybeSingle();

    if (!codeData || codeData.user_id === newUserId) return false;

    const { error } = await supabase
      .from('referrals')
      .insert([{
        referrer_id: codeData.user_id,
        referred_id: newUserId,
        referral_code: code.toUpperCase(),
        status: 'completed',
        reward_trucoin: REWARD_PER_REFERRAL,
        completed_at: new Date().toISOString()
      }]);

    if (error) return false;

    await supabase
      .from('user_referral_codes')
      .update({
        total_referrals: codeData.total_referrals + 1,
        total_rewards: codeData.total_rewards + REWARD_PER_REFERRAL
      })
      .eq('id', codeData.id);

    return true;
  },

  getReferralLink(code: string): string {
    return `${window.location.origin}?ref=${code}`;
  },

  getVideoShareLink(videoId: string, referralCode?: string): string {
    const base = `${window.location.origin}?video=${videoId}`;
    return referralCode ? `${base}&ref=${referralCode}` : base;
  },

  async logShareEvent(videoId: string, platform: string, userId?: string, referralCode?: string): Promise<void> {
    await supabase
      .from('video_share_events')
      .insert([{
        video_id: videoId,
        shared_by: userId || null,
        platform,
        referral_code: referralCode || null
      }]);
  },

  REWARD_PER_REFERRAL
};
