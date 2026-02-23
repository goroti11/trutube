import { supabase } from '../lib/supabase';
import type { LiveStream, LiveGift } from '../types/database';

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const liveService = {
  async getLiveStreams(status?: string): Promise<LiveStream[]> {
    let query = supabase.from('live_streams').select('*, profiles(username, avatar_url)');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getLiveStream(id: string): Promise<LiveStream | null> {
    const { data, error } = await supabase
      .from('live_streams')
      .select('*, profiles(username, avatar_url)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getGifts(): Promise<LiveGift[]> {
    const { data, error } = await supabase
      .from('live_gifts')
      .select('*')
      .eq('is_active', true)
      .order('tier');

    if (error) throw error;
    return data || [];
  },

  async sendGift(liveId: string, giftId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${FUNCTIONS_URL}/send-live-gift`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        live_id: liveId,
        gift_id: giftId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send gift');
    }
  },
};
