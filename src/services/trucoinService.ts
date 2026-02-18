import { supabase } from '../lib/supabase';

export interface TruCoinWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface TruCoinTransaction {
  id: string;
  from_user_id?: string;
  to_user_id?: string;
  amount: number;
  transaction_type: 'purchase' | 'tip' | 'subscription' | 'badge' | 'event' | 'reward' | 'refund';
  reference_id?: string;
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export const trucoinService = {
  async getWallet(userId: string): Promise<TruCoinWallet | null> {
    try {
      const { data, error } = await supabase
        .from('trucoin_wallets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return await this.createWallet(userId);
      }

      return data;
    } catch (error) {
      console.error('Error getting wallet:', error);
      return null;
    }
  },

  async createWallet(userId: string): Promise<TruCoinWallet | null> {
    try {
      const { data, error } = await supabase
        .from('trucoin_wallets')
        .insert({
          user_id: userId,
          balance: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating wallet:', error);
      return null;
    }
  },

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.getWallet(userId);
    return wallet?.balance || 0;
  },

  async purchaseCoins(userId: string, amount: number, paymentMethod: string): Promise<boolean> {
    try {
      const wallet = await this.getWallet(userId);
      if (!wallet) return false;

      const { error: transactionError } = await supabase
        .from('trucoin_transactions')
        .insert({
          to_user_id: userId,
          amount,
          transaction_type: 'purchase',
          description: `Achat de ${amount} TruCoins`,
          metadata: { payment_method: paymentMethod },
        });

      if (transactionError) throw transactionError;

      const { error: walletError } = await supabase
        .from('trucoin_wallets')
        .update({
          balance: wallet.balance + amount,
          total_earned: wallet.total_earned + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (walletError) throw walletError;

      return true;
    } catch (error) {
      console.error('Error purchasing coins:', error);
      return false;
    }
  },

  async sendTip(
    fromUserId: string,
    toUserId: string,
    amount: number,
    referenceId?: string
  ): Promise<boolean> {
    try {
      const fromWallet = await this.getWallet(fromUserId);
      const toWallet = await this.getWallet(toUserId);

      if (!fromWallet || !toWallet) return false;
      if (fromWallet.balance < amount) return false;

      const { error: transactionError } = await supabase
        .from('trucoin_transactions')
        .insert({
          from_user_id: fromUserId,
          to_user_id: toUserId,
          amount,
          transaction_type: 'tip',
          reference_id: referenceId,
          description: `Tip de ${amount} TruCoins`,
        });

      if (transactionError) throw transactionError;

      await supabase
        .from('trucoin_wallets')
        .update({
          balance: fromWallet.balance - amount,
          total_spent: fromWallet.total_spent + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', fromUserId);

      await supabase
        .from('trucoin_wallets')
        .update({
          balance: toWallet.balance + amount,
          total_earned: toWallet.total_earned + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', toUserId);

      return true;
    } catch (error) {
      console.error('Error sending tip:', error);
      return false;
    }
  },

  async spendCoins(
    userId: string,
    amount: number,
    type: TruCoinTransaction['transaction_type'],
    description: string,
    referenceId?: string
  ): Promise<boolean> {
    try {
      const wallet = await this.getWallet(userId);
      if (!wallet || wallet.balance < amount) return false;

      const { error: transactionError } = await supabase
        .from('trucoin_transactions')
        .insert({
          from_user_id: userId,
          amount,
          transaction_type: type,
          reference_id: referenceId,
          description,
        });

      if (transactionError) throw transactionError;

      const { error: walletError } = await supabase
        .from('trucoin_wallets')
        .update({
          balance: wallet.balance - amount,
          total_spent: wallet.total_spent + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (walletError) throw walletError;

      return true;
    } catch (error) {
      console.error('Error spending coins:', error);
      return false;
    }
  },

  async getTransactions(userId: string, limit = 50): Promise<TruCoinTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('trucoin_transactions')
        .select('*')
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  },

  async rewardUser(userId: string, amount: number, reason: string): Promise<boolean> {
    try {
      const wallet = await this.getWallet(userId);
      if (!wallet) return false;

      const { error: transactionError } = await supabase
        .from('trucoin_transactions')
        .insert({
          to_user_id: userId,
          amount,
          transaction_type: 'reward',
          description: reason,
        });

      if (transactionError) throw transactionError;

      const { error: walletError } = await supabase
        .from('trucoin_wallets')
        .update({
          balance: wallet.balance + amount,
          total_earned: wallet.total_earned + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (walletError) throw walletError;

      return true;
    } catch (error) {
      console.error('Error rewarding user:', error);
      return false;
    }
  },
};
