import { supabase } from '../lib/supabase';

export type MarketplaceCategory = 'music_production' | 'video' | 'branding' | 'marketing' | 'legal';
export type ExpertiseLevel = 'beginner' | 'intermediate' | 'expert' | 'pro';
export type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'revision_requested' | 'completed' | 'cancelled' | 'disputed';
export type EscrowStatus = 'held' | 'released' | 'refunded' | 'disputed';

export const CATEGORY_LABELS: Record<MarketplaceCategory, string> = {
  music_production: 'Production Musicale',
  video: 'Vidéo & Montage',
  branding: 'Branding & Design',
  marketing: 'Marketing & Lancement',
  legal: 'Juridique & Droits',
};

export const CATEGORY_SUBCATEGORIES: Record<MarketplaceCategory, string[]> = {
  music_production: ['Beatmaking', 'Mix & Master', 'Composition', 'Arrangement', 'Sound Design', 'Voix Off'],
  video: ['Montage Vidéo', 'Motion Design', 'Colorimétrie', 'Réalisation Clip', 'VFX', 'Sous-titrage'],
  branding: ['Identité Visuelle', 'Design Merch', 'Cover Art', 'UI/UX Créateur', 'Photographie', 'Direction Artistique'],
  marketing: ['Community Management', 'Stratégie Lancement', 'Gestion Ads', 'Influence & Partenariats', 'Press Kit', 'SEO YouTube'],
  legal: ['Contrats Artistes', 'Dépôt Droits', 'Conseil Royalties', 'Gestion SACEM', 'Licences', 'Protection Marque'],
};

export interface ProviderProfile {
  id: string;
  user_id: string;
  display_name: string;
  tagline: string;
  bio: string;
  avatar_url: string;
  portfolio_images: string[];
  portfolio_urls: string[];
  primary_category: MarketplaceCategory;
  secondary_categories: string[];
  specializations: string[];
  languages: string[];
  experience_years: number;
  expertise_level: ExpertiseLevel;
  is_verified: boolean;
  is_pro: boolean;
  total_orders: number;
  completed_orders: number;
  average_rating: number;
  total_reviews: number;
  total_revenue: number;
  response_rate: number;
  on_time_delivery_rate: number;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
}

export interface MarketplaceService {
  id: string;
  provider_id: string;
  user_id: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  subcategory: string;
  tags: string[];
  price_basic: number;
  price_standard: number | null;
  price_premium: number | null;
  currency: string;
  delivery_days_basic: number;
  delivery_days_standard: number | null;
  delivery_days_premium: number | null;
  revisions_basic: number;
  revisions_standard: number | null;
  revisions_premium: number | null;
  includes_basic: string;
  includes_standard: string;
  includes_premium: string;
  cover_image_url: string;
  gallery_images: string[];
  sample_work_url: string;
  requirements: string;
  total_orders: number;
  average_rating: number;
  total_reviews: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  provider?: ProviderProfile;
}

export interface MarketplaceOrder {
  id: string;
  service_id: string;
  buyer_id: string;
  provider_id: string;
  order_number: string;
  tier: 'basic' | 'standard' | 'premium';
  price: number;
  platform_fee: number;
  provider_amount: number;
  currency: string;
  payment_method: 'card' | 'trucoin' | 'mixed';
  card_amount: number;
  trucoin_amount: number;
  escrow_status: EscrowStatus;
  delivery_days: number;
  due_date: string | null;
  revisions_allowed: number;
  revisions_used: number;
  status: OrderStatus;
  buyer_requirements: string;
  delivery_message: string;
  buyer_rating: number | null;
  buyer_review: string;
  started_at: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  created_at: string;
  service?: MarketplaceService;
}

export interface OrderMessage {
  id: string;
  order_id: string;
  sender_id: string;
  message: string;
  attachment_url: string;
  is_system_message: boolean;
  created_at: string;
}

export interface MarketplaceReview {
  id: string;
  order_id: string;
  service_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  review_text: string;
  communication_rating: number | null;
  quality_rating: number | null;
  delivery_rating: number | null;
  would_recommend: boolean;
  created_at: string;
}

export const marketplaceService = {
  async createProviderProfile(userId: string, data: Partial<ProviderProfile>): Promise<ProviderProfile | null> {
    const { data: profile, error } = await supabase
      .from('marketplace_provider_profiles')
      .insert({ user_id: userId, ...data })
      .select()
      .single();
    if (error) {
      console.error('createProviderProfile error:', error);
      return null;
    }
    return profile as ProviderProfile;
  },

  async getProviderProfile(userId: string): Promise<ProviderProfile | null> {
    const { data } = await supabase
      .from('marketplace_provider_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    return data as ProviderProfile | null;
  },

  async updateProviderProfile(userId: string, updates: Partial<ProviderProfile>): Promise<boolean> {
    const { error } = await supabase
      .from('marketplace_provider_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    return !error;
  },

  async searchProviders(filters: {
    category?: MarketplaceCategory;
    expertise_level?: ExpertiseLevel;
    min_rating?: number;
    is_verified?: boolean;
    is_pro?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ProviderProfile[]> {
    let query = supabase
      .from('marketplace_provider_profiles')
      .select('*')
      .eq('is_active', true)
      .eq('is_available', true);

    if (filters.category) query = query.eq('primary_category', filters.category);
    if (filters.expertise_level) query = query.eq('expertise_level', filters.expertise_level);
    if (filters.min_rating) query = query.gte('average_rating', filters.min_rating);
    if (filters.is_verified) query = query.eq('is_verified', true);
    if (filters.is_pro) query = query.eq('is_pro', true);

    query = query
      .order('is_pro', { ascending: false })
      .order('average_rating', { ascending: false })
      .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1);

    const { data } = await query;
    return (data || []) as ProviderProfile[];
  },

  async createService(userId: string, providerId: string, data: Partial<MarketplaceService>): Promise<MarketplaceService | null> {
    const { data: service, error } = await supabase
      .from('marketplace_services')
      .insert({ user_id: userId, provider_id: providerId, ...data })
      .select()
      .single();
    if (error) {
      console.error('createService error:', error);
      return null;
    }
    return service as MarketplaceService;
  },

  async getServices(filters: {
    category?: MarketplaceCategory;
    subcategory?: string;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    is_featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<MarketplaceService[]> {
    let query = supabase
      .from('marketplace_services')
      .select('*, provider:marketplace_provider_profiles(*)')
      .eq('is_active', true);

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.subcategory) query = query.eq('subcategory', filters.subcategory);
    if (filters.min_price) query = query.gte('price_basic', filters.min_price);
    if (filters.max_price) query = query.lte('price_basic', filters.max_price);
    if (filters.min_rating) query = query.gte('average_rating', filters.min_rating);
    if (filters.is_featured) query = query.eq('is_featured', true);

    query = query
      .order('is_featured', { ascending: false })
      .order('average_rating', { ascending: false })
      .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1);

    const { data } = await query;
    return (data || []) as MarketplaceService[];
  },

  async getService(serviceId: string): Promise<MarketplaceService | null> {
    const { data } = await supabase
      .from('marketplace_services')
      .select('*, provider:marketplace_provider_profiles(*)')
      .eq('id', serviceId)
      .maybeSingle();
    return data as MarketplaceService | null;
  },

  async getProviderServices(userId: string): Promise<MarketplaceService[]> {
    const { data } = await supabase
      .from('marketplace_services')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return (data || []) as MarketplaceService[];
  },

  async createOrder(
    serviceId: string,
    buyerId: string,
    providerId: string,
    options: {
      tier: 'basic' | 'standard' | 'premium';
      price: number;
      delivery_days: number;
      revisions_allowed: number;
      payment_method: 'card' | 'trucoin' | 'mixed';
      card_amount: number;
      trucoin_amount: number;
      buyer_requirements: string;
      stripe_payment_intent_id?: string;
    }
  ): Promise<MarketplaceOrder | null> {
    const platformFee = options.price * 0.10;
    const providerAmount = options.price - platformFee;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + options.delivery_days);

    const { data, error } = await supabase
      .from('marketplace_orders')
      .insert({
        service_id: serviceId,
        buyer_id: buyerId,
        provider_id: providerId,
        tier: options.tier,
        price: options.price,
        platform_fee: platformFee,
        provider_amount: providerAmount,
        currency: 'EUR',
        payment_method: options.payment_method,
        card_amount: options.card_amount,
        trucoin_amount: options.trucoin_amount,
        stripe_payment_intent_id: options.stripe_payment_intent_id || '',
        escrow_status: 'held',
        delivery_days: options.delivery_days,
        due_date: dueDate.toISOString(),
        revisions_allowed: options.revisions_allowed,
        revisions_used: 0,
        status: 'pending',
        buyer_requirements: options.buyer_requirements,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('createOrder error:', error);
      return null;
    }
    return data as MarketplaceOrder;
  },

  async getBuyerOrders(userId: string): Promise<MarketplaceOrder[]> {
    const { data } = await supabase
      .from('marketplace_orders')
      .select('*, service:marketplace_services(*)')
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });
    return (data || []) as MarketplaceOrder[];
  },

  async getProviderOrders(userId: string): Promise<MarketplaceOrder[]> {
    const { data } = await supabase
      .from('marketplace_orders')
      .select('*, service:marketplace_services(*)')
      .eq('provider_id', userId)
      .order('created_at', { ascending: false });
    return (data || []) as MarketplaceOrder[];
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, extra?: Partial<MarketplaceOrder>): Promise<boolean> {
    const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString(), ...extra };
    if (status === 'delivered') updates.delivered_at = new Date().toISOString();
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
      updates.escrow_status = 'released';
      updates.escrow_released_at = new Date().toISOString();
    }
    const { error } = await supabase
      .from('marketplace_orders')
      .update(updates)
      .eq('id', orderId);
    return !error;
  },

  async sendMessage(orderId: string, senderId: string, message: string, attachmentUrl?: string): Promise<OrderMessage | null> {
    const { data, error } = await supabase
      .from('marketplace_order_messages')
      .insert({
        order_id: orderId,
        sender_id: senderId,
        message,
        attachment_url: attachmentUrl || '',
        is_system_message: false,
      })
      .select()
      .single();
    if (error) return null;
    return data as OrderMessage;
  },

  async getMessages(orderId: string): Promise<OrderMessage[]> {
    const { data } = await supabase
      .from('marketplace_order_messages')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });
    return (data || []) as OrderMessage[];
  },

  async submitReview(
    orderId: string,
    serviceId: string,
    reviewerId: string,
    reviewedUserId: string,
    review: {
      rating: number;
      review_text: string;
      communication_rating?: number;
      quality_rating?: number;
      delivery_rating?: number;
      would_recommend?: boolean;
    }
  ): Promise<boolean> {
    const { error } = await supabase
      .from('marketplace_reviews')
      .insert({
        order_id: orderId,
        service_id: serviceId,
        reviewer_id: reviewerId,
        reviewed_user_id: reviewedUserId,
        ...review,
        would_recommend: review.would_recommend ?? true,
      });
    return !error;
  },

  async getServiceReviews(serviceId: string): Promise<MarketplaceReview[]> {
    const { data } = await supabase
      .from('marketplace_reviews')
      .select('*')
      .eq('service_id', serviceId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    return (data || []) as MarketplaceReview[];
  },

  async openDispute(orderId: string, openedBy: string, reason: string, description: string): Promise<boolean> {
    const { error: orderError } = await supabase
      .from('marketplace_orders')
      .update({ status: 'disputed', escrow_status: 'disputed', updated_at: new Date().toISOString() })
      .eq('id', orderId);
    if (orderError) return false;

    const { error } = await supabase
      .from('marketplace_disputes')
      .insert({ order_id: orderId, opened_by: openedBy, reason, description });
    return !error;
  },

  async getOrder(orderId: string): Promise<MarketplaceOrder | null> {
    const { data } = await supabase
      .from('marketplace_orders')
      .select('*, service:marketplace_services(*, provider:marketplace_provider_profiles(*))')
      .eq('id', orderId)
      .maybeSingle();
    return data as MarketplaceOrder | null;
  },

  async submitDelivery(orderId: string, deliveryNote: string, fileUrls: string[]): Promise<boolean> {
    const { data, error } = await supabase.rpc('rpc_submit_marketplace_delivery', {
      p_order_id: orderId,
      p_delivery_note: deliveryNote,
      p_file_urls: fileUrls,
    });
    if (error) {
      console.error('submitDelivery error:', error);
      return false;
    }
    return data?.success || false;
  },

  async requestRevision(orderId: string, revisionNote: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('rpc_request_marketplace_revision', {
      p_order_id: orderId,
      p_revision_note: revisionNote,
    });
    if (error) {
      console.error('requestRevision error:', error);
      return false;
    }
    return data?.success || false;
  },

  async completeOrder(orderId: string, rating?: number, reviewText?: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('rpc_complete_marketplace_order', {
      p_order_id: orderId,
      p_rating: rating || null,
      p_review_text: reviewText || '',
    });
    if (error) {
      console.error('completeOrder error:', error);
      return false;
    }
    return data?.success || false;
  },

  async getDeliveries(orderId: string) {
    const { data } = await supabase
      .from('marketplace_order_deliveries')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async getDispute(orderId: string) {
    const { data } = await supabase
      .from('marketplace_disputes')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();
    return data;
  },

  async getMarketplaceHome(limit: number = 20) {
    const { data, error } = await supabase.rpc('rpc_get_marketplace_home', {
      p_limit: limit,
    });
    if (error) {
      console.error('getMarketplaceHome error:', error);
      return {
        featured_services: [],
        top_providers: [],
        categories: {},
      };
    }
    return data || {
      featured_services: [],
      top_providers: [],
      categories: {},
    };
  },

  async createOrderWithRpc(
    serviceId: string,
    buyerId: string,
    tier: 'basic' | 'standard' | 'premium',
    price: number,
    paymentMethod: 'card' | 'trucoin' | 'mixed',
    cardAmount: number,
    trucoinAmount: number,
    buyerRequirements: string,
    stripePaymentIntentId?: string
  ) {
    const { data, error } = await supabase.rpc('rpc_create_marketplace_order', {
      p_service_id: serviceId,
      p_buyer_id: buyerId,
      p_tier: tier,
      p_price: price,
      p_payment_method: paymentMethod,
      p_card_amount: cardAmount,
      p_trucoin_amount: trucoinAmount,
      p_buyer_requirements: buyerRequirements,
      p_stripe_payment_intent_id: stripePaymentIntentId || '',
    });
    if (error) {
      console.error('createOrderWithRpc error:', error);
      return null;
    }
    return data;
  },

  async openDisputeWithRpc(orderId: string, reason: string, description: string, evidenceUrls: string[] = []) {
    const { data, error } = await supabase.rpc('rpc_open_marketplace_dispute', {
      p_order_id: orderId,
      p_reason: reason,
      p_description: description,
      p_evidence_urls: evidenceUrls,
    });
    if (error) {
      console.error('openDisputeWithRpc error:', error);
      return null;
    }
    return data;
  },
};
