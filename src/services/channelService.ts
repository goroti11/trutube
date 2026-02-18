import { supabase } from '../lib/supabase';

export type KycStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';
export type ChannelVisibility = 'public' | 'private';
export type LegalEntityType = 'individual' | 'company' | 'auto_entrepreneur' | 'association';

export interface LegalProfile {
  id: string;
  user_id: string;
  legal_entity_type: LegalEntityType;
  legal_name: string;
  business_name: string;
  tax_country: string;
  tax_id: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_state: string;
  address_country: string;
  phone: string;
  iban_last4: string;
  bank_account_holder: string;
  payment_method_verified: boolean;
  kyc_status: KycStatus;
  kyc_submitted_at: string | null;
  kyc_approved_at: string | null;
  tos_accepted: boolean;
  tos_accepted_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreatorChannel {
  id: string;
  user_id: string;
  legal_profile_id: string | null;
  channel_name: string;
  channel_slug: string;
  description: string;
  avatar_url: string;
  banner_url: string;
  website_url: string;
  contact_email: string;
  display_country: string;
  channel_category: string;
  visibility: ChannelVisibility;
  is_primary: boolean;
  is_verified: boolean;
  is_suspended: boolean;
  suspension_reason: string;
  subscriber_count: number;
  video_count: number;
  total_views: number;
  monetization_enabled: boolean;
  monetization_tier: string;
  social_links: Record<string, string>;
  custom_tags: string[];
  created_at: string;
  updated_at: string;
}

export type LegalProfileInput = Partial<Omit<LegalProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type ChannelInput = Partial<Omit<CreatorChannel, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export const channelService = {
  async getLegalProfile(userId: string): Promise<LegalProfile | null> {
    try {
      const { data, error } = await supabase
        .from('legal_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting legal profile:', error);
      return null;
    }
  },

  async upsertLegalProfile(userId: string, input: LegalProfileInput): Promise<LegalProfile | null> {
    try {
      const { data, error } = await supabase
        .from('legal_profiles')
        .upsert({ user_id: userId, ...input }, { onConflict: 'user_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upserting legal profile:', error);
      return null;
    }
  },

  async getMyChannels(userId: string): Promise<CreatorChannel[]> {
    try {
      const { data, error } = await supabase
        .from('creator_channels')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting channels:', error);
      return [];
    }
  },

  async getChannel(channelId: string): Promise<CreatorChannel | null> {
    try {
      const { data, error } = await supabase
        .from('creator_channels')
        .select('*')
        .eq('id', channelId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting channel:', error);
      return null;
    }
  },

  async getChannelBySlug(slug: string): Promise<CreatorChannel | null> {
    try {
      const { data, error } = await supabase
        .from('creator_channels')
        .select('*')
        .eq('channel_slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting channel by slug:', error);
      return null;
    }
  },

  async createChannel(userId: string, input: ChannelInput & { channel_name: string; channel_slug: string }): Promise<CreatorChannel | null> {
    try {
      const { data, error } = await supabase
        .from('creator_channels')
        .insert({ user_id: userId, ...input })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating channel:', error);
      return null;
    }
  },

  async updateChannel(channelId: string, input: ChannelInput): Promise<CreatorChannel | null> {
    try {
      const { data, error } = await supabase
        .from('creator_channels')
        .update(input)
        .eq('id', channelId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating channel:', error);
      return null;
    }
  },

  async deleteChannel(channelId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('creator_channels')
        .delete()
        .eq('id', channelId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting channel:', error);
      return false;
    }
  },

  async isSlugAvailable(slug: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('creator_channels')
        .select('id')
        .eq('channel_slug', slug)
        .maybeSingle();
      return !data;
    } catch {
      return false;
    }
  },

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
  },

  getKycLabel(status: KycStatus): string {
    const labels: Record<KycStatus, string> = {
      not_submitted: 'Non soumis',
      pending: 'En cours de vérification',
      verified: 'Vérifié',
      rejected: 'Refusé',
    };
    return labels[status];
  },

  getKycColor(status: KycStatus): string {
    const colors: Record<KycStatus, string> = {
      not_submitted: 'text-gray-400',
      pending: 'text-amber-400',
      verified: 'text-green-400',
      rejected: 'text-red-400',
    };
    return colors[status];
  },
};
