import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  user_status: 'viewer' | 'supporter' | 'creator' | 'pro' | 'elite';
  subscriber_count: number;
  upload_frequency: number;
  trust_score: number;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },

  async isPremium(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking premium status:', error);
      return false;
    }

    return data?.is_premium || false;
  },

  async createProfile(userId: string, displayName: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        display_name: displayName,
        user_status: 'viewer',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  },

  async getTrustScore(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('user_trust_scores')
      .select('overall_trust')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return 0.5;
    }

    return data.overall_trust;
  },
};
