import { supabase } from '../lib/supabase';
import type { TrucoinWallet, TrucoinTransaction } from '../types/database';

export const walletService = {
  async getWallet(userId: string): Promise<TrucoinWallet | null> {
    const { data, error } = await supabase
      .from('trucoin_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getTransactions(userId: string, limit = 50, offset = 0): Promise<TrucoinTransaction[]> {
    const { data, error } = await supabase
      .from('trucoin_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.getWallet(userId);
    return wallet?.balance || 0;
  },

  subscribeToWallet(userId: string, callback: (wallet: TrucoinWallet) => void) {
    return supabase
      .channel(`wallet_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trucoin_wallets',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as TrucoinWallet);
        }
      )
      .subscribe();
  },
};
