import { supabase } from '../lib/supabase';

export interface PaymentMethod {
  id: string;
  user_id: string;
  stripe_payment_method_id: string;
  payment_type: 'card' | 'bank_account' | 'paypal';
  card_brand: string;
  card_last4: string;
  is_default: boolean;
  billing_details: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: 'subscription' | 'tip' | 'campaign' | 'withdrawal' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  stripe_payment_intent_id: string;
  stripe_charge_id: string;
  description: string;
  metadata: Record<string, any>;
  related_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Tip {
  id: string;
  from_user_id: string;
  to_creator_id: string;
  video_id?: string;
  amount: number;
  currency: string;
  message: string;
  is_anonymous: boolean;
  is_public: boolean;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  stripe_payment_intent_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatorWallet {
  id: string;
  creator_id: string;
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  pending_balance: number;
  stripe_account_id: string;
  currency: string;
  last_payout_date?: string;
  created_at: string;
  updated_at: string;
}

export interface WithdrawalRequest {
  id: string;
  creator_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  stripe_transfer_id: string;
  payment_method: string;
  destination_details: Record<string, any>;
  notes: string;
  requested_at: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EarningsBreakdown {
  total_tips: number;
  total_subscriptions: number;
  total_ad_revenue: number;
  total_earnings: number;
  available_balance: number;
  pending_balance: number;
}

export interface PremiumSubscription {
  id: string;
  user_id: string;
  tier: 'premium' | 'platine' | 'gold';
  price: number;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  started_at: string;
  expires_at: string;
  auto_renew: boolean;
  payment_method: string;
  last_payment_date?: string;
  next_billing_date?: string;
  stripe_subscription_id?: string;
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TopTipper {
  user_id: string;
  username: string;
  avatar_url: string;
  total_tipped: number;
  tip_count: number;
}

class PaymentService {
  async sendTip(
    fromUserId: string,
    toCreatorId: string,
    amount: number,
    message: string = '',
    videoId?: string,
    isAnonymous: boolean = false,
    isPublic: boolean = true
  ): Promise<Tip | null> {
    try {
      const { data, error } = await supabase
        .from('tips')
        .insert({
          from_user_id: fromUserId,
          to_creator_id: toCreatorId,
          video_id: videoId,
          amount,
          message,
          is_anonymous: isAnonymous,
          is_public: isPublic,
          status: 'completed',
          currency: 'USD'
        })
        .select()
        .single();

      if (error) throw error;

      const transaction = await this.createTransaction({
        user_id: fromUserId,
        transaction_type: 'tip',
        amount,
        status: 'completed',
        description: `Tip to creator`,
        related_id: data.id
      });

      if (transaction) {
        await supabase.rpc('process_tip_payment', {
          p_tip_id: data.id,
          p_transaction_id: transaction.id
        });
      }

      return data;
    } catch (error) {
      console.error('Error sending tip:', error);
      return null;
    }
  }

  async getTipsByCreator(creatorId: string): Promise<Tip[]> {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .eq('to_creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tips:', error);
      return [];
    }
  }

  async getTipsByUser(userId: string): Promise<Tip[]> {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .eq('from_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user tips:', error);
      return [];
    }
  }

  async getTipsByVideo(videoId: string): Promise<Tip[]> {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .eq('video_id', videoId)
        .eq('is_public', true)
        .order('amount', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching video tips:', error);
      return [];
    }
  }

  async getTopTippers(creatorId: string, limit: number = 10): Promise<TopTipper[]> {
    try {
      const { data, error } = await supabase.rpc('get_top_tippers', {
        p_creator_id: creatorId,
        p_limit: limit
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching top tippers:', error);
      return [];
    }
  }

  async getCreatorWallet(creatorId: string): Promise<CreatorWallet | null> {
    try {
      const { data, error } = await supabase
        .from('creator_wallets')
        .select('*')
        .eq('creator_id', creatorId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const walletId = await supabase.rpc('get_or_create_creator_wallet', {
          p_creator_id: creatorId
        });

        if (walletId) {
          return await this.getCreatorWallet(creatorId);
        }
      }

      return data;
    } catch (error) {
      console.error('Error fetching creator wallet:', error);
      return null;
    }
  }

  async getEarningsBreakdown(creatorId: string): Promise<EarningsBreakdown | null> {
    try {
      const { data, error } = await supabase.rpc('get_creator_earnings_breakdown', {
        p_creator_id: creatorId
      });

      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching earnings breakdown:', error);
      return null;
    }
  }

  async requestWithdrawal(
    creatorId: string,
    amount: number,
    paymentMethod: string = 'bank_transfer',
    destinationDetails: Record<string, any> = {}
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('request_withdrawal', {
        p_creator_id: creatorId,
        p_amount: amount,
        p_payment_method: paymentMethod,
        p_destination_details: destinationDetails
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      return null;
    }
  }

  async getWithdrawalRequests(creatorId: string): Promise<WithdrawalRequest[]> {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('creator_id', creatorId)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      return [];
    }
  }

  async createTransaction(transaction: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: transaction.user_id,
          transaction_type: transaction.transaction_type,
          amount: transaction.amount,
          currency: transaction.currency || 'USD',
          status: transaction.status || 'pending',
          stripe_payment_intent_id: transaction.stripe_payment_intent_id || '',
          stripe_charge_id: transaction.stripe_charge_id || '',
          description: transaction.description || '',
          metadata: transaction.metadata || {},
          related_id: transaction.related_id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      return null;
    }
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  async addPaymentMethod(
    userId: string,
    stripePaymentMethodId: string,
    paymentType: 'card' | 'bank_account' | 'paypal',
    cardBrand: string = '',
    cardLast4: string = '',
    isDefault: boolean = false,
    billingDetails: Record<string, any> = {}
  ): Promise<PaymentMethod | null> {
    try {
      if (isDefault) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: userId,
          stripe_payment_method_id: stripePaymentMethodId,
          payment_type: paymentType,
          card_brand: cardBrand,
          card_last4: cardLast4,
          is_default: isDefault,
          billing_details: billingDetails
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding payment method:', error);
      return null;
    }
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<boolean> {
    try {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);

      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq('id', paymentMethodId)
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      return false;
    }
  }

  async deletePaymentMethod(userId: string, paymentMethodId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId)
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }
  }

  async subscribeToPremium(
    userId: string,
    tier: 'premium' | 'platine' | 'gold',
    paymentMethodId?: string
  ): Promise<PremiumSubscription | null> {
    try {
      const prices = {
        premium: 9.99,
        platine: 19.99,
        gold: 29.99
      };

      const price = prices[tier];
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      const { data: existing } = await supabase
        .from('premium_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('premium_subscriptions')
          .update({
            tier,
            price,
            status: 'active',
            expires_at: expiresAt.toISOString(),
            auto_renew: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;

        await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('id', userId);

        return data;
      } else {
        const { data, error } = await supabase
          .from('premium_subscriptions')
          .insert({
            user_id: userId,
            tier,
            price,
            status: 'active',
            started_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
            auto_renew: true,
            payment_method: 'card'
          })
          .select()
          .single();

        if (error) throw error;

        await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('id', userId);

        await this.createTransaction({
          user_id: userId,
          transaction_type: 'subscription',
          amount: price,
          status: 'completed',
          description: `Abonnement ${tier.toUpperCase()} - 1 mois`,
          metadata: { tier, subscription_id: data.id }
        });

        return data;
      }
    } catch (error) {
      console.error('Error subscribing to premium:', error);
      return null;
    }
  }

  async getPremiumSubscription(userId: string): Promise<PremiumSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('premium_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching premium subscription:', error);
      return null;
    }
  }

  async cancelPremiumSubscription(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('premium_subscriptions')
        .update({
          status: 'cancelled',
          auto_renew: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error cancelling premium subscription:', error);
      return false;
    }
  }

  async upgradePremiumTier(
    userId: string,
    newTier: 'premium' | 'platine' | 'gold'
  ): Promise<PremiumSubscription | null> {
    try {
      const prices = {
        premium: 9.99,
        platine: 19.99,
        gold: 29.99
      };

      const price = prices[newTier];

      const { data, error } = await supabase
        .from('premium_subscriptions')
        .update({
          tier: newTier,
          price,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      await this.createTransaction({
        user_id: userId,
        transaction_type: 'subscription',
        amount: price,
        status: 'completed',
        description: `Changement d'abonnement vers ${newTier.toUpperCase()}`,
        metadata: { tier: newTier, action: 'upgrade' }
      });

      return data;
    } catch (error) {
      console.error('Error upgrading premium tier:', error);
      return null;
    }
  }

  async checkPremiumStatus(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getPremiumSubscription(userId);

      if (!subscription) return false;
      if (subscription.status !== 'active') return false;

      const expiresAt = new Date(subscription.expires_at);
      const now = new Date();

      if (expiresAt < now) {
        await supabase
          .from('premium_subscriptions')
          .update({ status: 'expired' })
          .eq('user_id', userId);

        await supabase
          .from('profiles')
          .update({ is_premium: false })
          .eq('id', userId);

        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }
}

export const paymentService = new PaymentService();