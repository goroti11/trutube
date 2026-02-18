import { supabase } from '../lib/supabase';

export type ReleaseType = 'single' | 'album' | 'ep' | 'bundle';
export type SaleType = 'lifetime' | 'limited_access' | 'rental_48h' | 'rental_72h';
export type ReleasePhase = 'draft' | 'preorder' | 'exclusive' | 'public' | 'archived';
export type DistributionLevel = 'independent' | 'label';
export type RoyaltyRole = 'main_artist' | 'featured_artist' | 'producer' | 'author' | 'composer' | 'label' | 'other';

export interface MusicSaleRelease {
  id: string;
  creator_id: string;
  title: string;
  artist_name: string;
  label_name: string;
  isrc: string;
  release_type: ReleaseType;
  genre: string;
  cover_art_url: string;
  description: string;
  rights_owned: boolean;
  rights_declaration_signed_at: string | null;
  territories_allowed: string[];
  credits: CreditEntry[];
  price_standard: number;
  price_promo: number | null;
  promo_starts_at: string | null;
  promo_ends_at: string | null;
  currency: string;
  sale_type: SaleType;
  access_duration_days: number | null;
  is_bundle: boolean;
  bundle_items: BundleItem[];
  phase: ReleasePhase;
  exclusive_starts_at: string | null;
  exclusive_ends_at: string | null;
  public_release_at: string | null;
  preorder_enabled: boolean;
  preorder_price: number | null;
  preorder_starts_at: string | null;
  preorder_ends_at: string | null;
  is_limited_edition: boolean;
  limited_edition_total: number | null;
  limited_edition_sold: number;
  total_sales: number;
  total_revenue: number;
  platform_commission_rate: number;
  video_id: string | null;
  preview_url: string;
  distribution_level: DistributionLevel;
  label_mandate_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditEntry {
  name: string;
  role: string;
}

export interface BundleItem {
  type: 'album' | 'single' | 'merch';
  id: string;
  name: string;
}

export interface RoyaltySplit {
  id: string;
  release_id: string;
  recipient_user_id: string | null;
  recipient_name: string;
  recipient_email: string;
  role: RoyaltyRole;
  percentage: number;
  is_confirmed: boolean;
  confirmed_at: string | null;
  created_at: string;
}

export interface MusicSalePurchase {
  id: string;
  release_id: string;
  buyer_id: string;
  purchase_price: number;
  currency: string;
  payment_method: 'card' | 'trucoin' | 'mixed';
  card_amount: number;
  trucoin_amount: number;
  sale_type: string;
  access_expires_at: string | null;
  is_early_supporter: boolean;
  is_preorder: boolean;
  is_founder: boolean;
  limited_edition_number: number | null;
  certificate_code: string | null;
  status: 'pending' | 'completed' | 'refunded' | 'expired';
  hd_access: boolean;
  bonus_content_access: boolean;
  created_at: string;
}

export interface MusicSalePreorder {
  id: string;
  release_id: string;
  buyer_id: string;
  preorder_price: number;
  currency: string;
  payment_method: string;
  status: 'active' | 'converted' | 'cancelled' | 'refunded';
  access_granted: boolean;
  display_name: string;
  show_publicly: boolean;
  created_at: string;
}

export interface ReleaseStats {
  total_sales: number;
  total_revenue: number;
  gross_revenue: number;
  platform_commission: number;
  net_revenue: number;
  conversion_rate: number;
  top_countries: { country: string; count: number }[];
  sales_by_day: { date: string; count: number; revenue: number }[];
  preorder_count: number;
  founder_count: number;
}

export interface CreateReleaseInput {
  title: string;
  artist_name: string;
  label_name?: string;
  isrc?: string;
  release_type: ReleaseType;
  genre?: string;
  cover_art_url?: string;
  description?: string;
  rights_owned: boolean;
  territories_allowed?: string[];
  credits?: CreditEntry[];
  price_standard: number;
  price_promo?: number;
  promo_ends_at?: string;
  currency?: string;
  sale_type: SaleType;
  access_duration_days?: number;
  is_bundle?: boolean;
  bundle_items?: BundleItem[];
  exclusive_starts_at?: string;
  exclusive_ends_at?: string;
  public_release_at?: string;
  preorder_enabled?: boolean;
  preorder_price?: number;
  preorder_starts_at?: string;
  preorder_ends_at?: string;
  is_limited_edition?: boolean;
  limited_edition_total?: number;
  video_id?: string;
  preview_url?: string;
  distribution_level?: DistributionLevel;
}

export const musicSalesService = {
  async createRelease(userId: string, input: CreateReleaseInput): Promise<MusicSaleRelease | null> {
    const { data, error } = await supabase
      .from('music_sale_releases')
      .insert({
        creator_id: userId,
        ...input,
        phase: 'draft',
        rights_declaration_signed_at: input.rights_owned ? new Date().toISOString() : null,
      })
      .select()
      .single();
    if (error) {
      console.error('createRelease error:', error);
      return null;
    }
    return data as MusicSaleRelease;
  },

  async updateRelease(releaseId: string, updates: Partial<CreateReleaseInput & { phase: ReleasePhase }>): Promise<boolean> {
    const { error } = await supabase
      .from('music_sale_releases')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', releaseId);
    return !error;
  },

  async getRelease(releaseId: string): Promise<MusicSaleRelease | null> {
    const { data, error } = await supabase
      .from('music_sale_releases')
      .select('*')
      .eq('id', releaseId)
      .maybeSingle();
    if (error) return null;
    return data as MusicSaleRelease;
  },

  async getCreatorReleases(userId: string): Promise<MusicSaleRelease[]> {
    const { data, error } = await supabase
      .from('music_sale_releases')
      .select('*')
      .eq('creator_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data || []) as MusicSaleRelease[];
  },

  async getPublicReleases(limit = 20, offset = 0): Promise<MusicSaleRelease[]> {
    const { data, error } = await supabase
      .from('music_sale_releases')
      .select('*')
      .in('phase', ['exclusive', 'public'])
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) return [];
    return (data || []) as MusicSaleRelease[];
  },

  async publishRelease(releaseId: string, phase: 'preorder' | 'exclusive'): Promise<boolean> {
    const updates: Record<string, unknown> = {
      phase,
      updated_at: new Date().toISOString(),
    };
    if (phase === 'exclusive') {
      updates.exclusive_starts_at = new Date().toISOString();
    }
    const { error } = await supabase
      .from('music_sale_releases')
      .update(updates)
      .eq('id', releaseId);
    return !error;
  },

  async setRoyaltySplits(releaseId: string, splits: Omit<RoyaltySplit, 'id' | 'release_id' | 'is_confirmed' | 'confirmed_at' | 'created_at'>[]): Promise<boolean> {
    const { error: deleteError } = await supabase
      .from('music_royalty_splits')
      .delete()
      .eq('release_id', releaseId);
    if (deleteError) return false;

    if (splits.length === 0) return true;

    const { error } = await supabase
      .from('music_royalty_splits')
      .insert(splits.map(s => ({ ...s, release_id: releaseId })));
    return !error;
  },

  async getRoyaltySplits(releaseId: string): Promise<RoyaltySplit[]> {
    const { data, error } = await supabase
      .from('music_royalty_splits')
      .select('*')
      .eq('release_id', releaseId)
      .order('percentage', { ascending: false });
    if (error) return [];
    return (data || []) as RoyaltySplit[];
  },

  async purchaseRelease(
    releaseId: string,
    buyerId: string,
    options: {
      payment_method: 'card' | 'trucoin' | 'mixed';
      card_amount: number;
      trucoin_amount: number;
      stripe_payment_intent_id?: string;
    }
  ): Promise<MusicSalePurchase | null> {
    const release = await this.getRelease(releaseId);
    if (!release) return null;

    const now = new Date();
    const isPromo =
      release.price_promo !== null &&
      release.promo_ends_at !== null &&
      new Date(release.promo_ends_at) > now &&
      (release.promo_starts_at === null || new Date(release.promo_starts_at) <= now);

    const price = isPromo && release.price_promo ? release.price_promo : release.price_standard;
    const totalPaid = options.card_amount + options.trucoin_amount;

    const isFounder = release.phase === 'exclusive';
    const isEarlySupporter = release.phase === 'exclusive' || release.phase === 'preorder';

    let accessExpiresAt: string | null = null;
    if (release.sale_type === 'limited_access' && release.access_duration_days) {
      const expires = new Date();
      expires.setDate(expires.getDate() + release.access_duration_days);
      accessExpiresAt = expires.toISOString();
    } else if (release.sale_type === 'rental_48h') {
      const expires = new Date();
      expires.setHours(expires.getHours() + 48);
      accessExpiresAt = expires.toISOString();
    } else if (release.sale_type === 'rental_72h') {
      const expires = new Date();
      expires.setHours(expires.getHours() + 72);
      accessExpiresAt = expires.toISOString();
    }

    const { data, error } = await supabase
      .from('music_sale_purchases')
      .insert({
        release_id: releaseId,
        buyer_id: buyerId,
        purchase_price: totalPaid,
        currency: release.currency,
        payment_method: options.payment_method,
        card_amount: options.card_amount,
        trucoin_amount: options.trucoin_amount,
        sale_type: release.sale_type,
        access_expires_at: accessExpiresAt,
        is_early_supporter: isEarlySupporter,
        is_preorder: false,
        is_founder: isFounder,
        status: 'completed',
        stripe_payment_intent_id: options.stripe_payment_intent_id || '',
        hd_access: isFounder,
        bonus_content_access: isFounder,
      })
      .select()
      .single();

    if (error) {
      console.error('purchaseRelease error:', error);
      return null;
    }

    await supabase
      .from('music_sale_releases')
      .update({
        total_sales: release.total_sales + 1,
        total_revenue: Number(release.total_revenue) + totalPaid,
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseId);

    return data as MusicSalePurchase;
  },

  async preorderRelease(
    releaseId: string,
    buyerId: string,
    options: {
      payment_method: string;
      stripe_payment_intent_id?: string;
      display_name?: string;
      show_publicly?: boolean;
    }
  ): Promise<MusicSalePreorder | null> {
    const release = await this.getRelease(releaseId);
    if (!release || !release.preorder_enabled) return null;

    const price = release.preorder_price ?? release.price_standard;

    const { data, error } = await supabase
      .from('music_sale_preorders')
      .insert({
        release_id: releaseId,
        buyer_id: buyerId,
        preorder_price: price,
        currency: release.currency,
        payment_method: options.payment_method,
        status: 'active',
        stripe_payment_intent_id: options.stripe_payment_intent_id || '',
        display_name: options.display_name || '',
        show_publicly: options.show_publicly ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error('preorderRelease error:', error);
      return null;
    }
    return data as MusicSalePreorder;
  },

  async checkUserAccess(releaseId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('music_sale_purchases')
      .select('id, access_expires_at, status')
      .eq('release_id', releaseId)
      .eq('buyer_id', userId)
      .eq('status', 'completed')
      .maybeSingle();

    if (!data) return false;
    if (!data.access_expires_at) return true;
    return new Date(data.access_expires_at) > new Date();
  },

  async getUserPurchase(releaseId: string, userId: string): Promise<MusicSalePurchase | null> {
    const { data } = await supabase
      .from('music_sale_purchases')
      .select('*')
      .eq('release_id', releaseId)
      .eq('buyer_id', userId)
      .maybeSingle();
    return data as MusicSalePurchase | null;
  },

  async getUserPurchases(userId: string): Promise<MusicSalePurchase[]> {
    const { data } = await supabase
      .from('music_sale_purchases')
      .select('*, music_sale_releases(*)')
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });
    return (data || []) as MusicSalePurchase[];
  },

  async getPreorders(releaseId: string): Promise<MusicSalePreorder[]> {
    const { data } = await supabase
      .from('music_sale_preorders')
      .select('*')
      .eq('release_id', releaseId)
      .eq('show_publicly', true)
      .order('created_at', { ascending: true });
    return (data || []) as MusicSalePreorder[];
  },

  async getReleaseStats(releaseId: string): Promise<ReleaseStats> {
    const { data: purchases } = await supabase
      .from('music_sale_purchases')
      .select('purchase_price, is_founder, is_early_supporter, created_at, status')
      .eq('release_id', releaseId)
      .eq('status', 'completed');

    const { data: preorders } = await supabase
      .from('music_sale_preorders')
      .select('id, status')
      .eq('release_id', releaseId);

    const validPurchases = purchases || [];
    const totalSales = validPurchases.length;
    const grossRevenue = validPurchases.reduce((sum, p) => sum + Number(p.purchase_price), 0);
    const platformCommission = grossRevenue * 0.15;
    const netRevenue = grossRevenue - platformCommission;
    const founderCount = validPurchases.filter(p => p.is_founder).length;
    const preorderCount = (preorders || []).filter(p => p.status === 'active').length;

    const salesByDay: Record<string, { count: number; revenue: number }> = {};
    validPurchases.forEach(p => {
      const day = p.created_at.slice(0, 10);
      if (!salesByDay[day]) salesByDay[day] = { count: 0, revenue: 0 };
      salesByDay[day].count += 1;
      salesByDay[day].revenue += Number(p.purchase_price);
    });

    return {
      total_sales: totalSales,
      total_revenue: grossRevenue,
      gross_revenue: grossRevenue,
      platform_commission: platformCommission,
      net_revenue: netRevenue,
      conversion_rate: 0,
      top_countries: [],
      sales_by_day: Object.entries(salesByDay).map(([date, val]) => ({ date, ...val })),
      preorder_count: preorderCount,
      founder_count: founderCount,
    };
  },

  getCurrentPrice(release: MusicSaleRelease): number {
    const now = new Date();
    if (
      release.price_promo !== null &&
      release.promo_ends_at !== null &&
      new Date(release.promo_ends_at) > now &&
      (release.promo_starts_at === null || new Date(release.promo_starts_at) <= now)
    ) {
      return release.price_promo;
    }
    return release.price_standard;
  },

  getDiscountPercentage(release: MusicSaleRelease): number {
    if (!release.price_promo || !release.price_standard) return 0;
    return Math.round(((release.price_standard - release.price_promo) / release.price_standard) * 100);
  },

  isAvailableForPurchase(release: MusicSaleRelease): boolean {
    return release.is_active && ['exclusive', 'public'].includes(release.phase);
  },

  isAvailableForPreorder(release: MusicSaleRelease): boolean {
    if (!release.preorder_enabled) return false;
    if (release.phase !== 'preorder') return false;
    const now = new Date();
    if (release.preorder_starts_at && new Date(release.preorder_starts_at) > now) return false;
    if (release.preorder_ends_at && new Date(release.preorder_ends_at) < now) return false;
    return true;
  },

  isLimitedEditionAvailable(release: MusicSaleRelease): boolean {
    if (!release.is_limited_edition) return false;
    if (!release.limited_edition_total) return false;
    return release.limited_edition_sold < release.limited_edition_total;
  },

  getRemainingEditions(release: MusicSaleRelease): number {
    if (!release.is_limited_edition || !release.limited_edition_total) return 0;
    return Math.max(0, release.limited_edition_total - release.limited_edition_sold);
  },
};
