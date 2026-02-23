import { supabase } from '../lib/supabase';
import type { LiveStream, LiveGift } from '../types/database';

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const liveService = {
  async getLiveStreams(status?: 'scheduled' | 'live' | 'ended'): Promise<LiveStream[]> {
    let query = supabase
      .from('live_streams')
      .select('*, profiles(username, avatar_url)');

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
      .select('*, profiles(username, avatar_url), live_settings(*)')
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
      .order('price_trucoins');

    if (error) throw error;
    return data || [];
  },

  async sendGift(liveId: string, giftId: string): Promise<{ success: boolean; newBalance: number }> {
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

    const result = await response.json();
    return { success: result.success, newBalance: result.new_balance };
  },

  subscribeToLiveGifts(liveId: string, callback: (gift: unknown) => void) {
    return supabase
      .channel(`live_gifts_${liveId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_gift_transactions',
          filter: `live_id=eq.${liveId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  },
};
