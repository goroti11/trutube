import { supabase } from '../lib/supabase';

export interface BrandDeal {
  id: string;
  creator_id: string;
  brand_name: string;
  brand_contact_email: string | null;
  brand_contact_name: string | null;
  deal_type: string;
  contract_value: number;
  currency: string;
  start_date: string;
  end_date: string | null;
  required_videos: number | null;
  completed_videos: number;
  contract_terms: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface VideoSponsorship {
  id: string;
  video_id: string;
  brand_deal_id: string | null;
  brand_name: string;
  sponsorship_type: string;
  sponsor_message: string | null;
  sponsor_link: string | null;
  sponsor_code: string | null;
  payment_amount: number;
  currency: string;
  timestamp_start: number | null;
  timestamp_end: number | null;
  is_disclosed: boolean;
  status: string;
  created_at: string;
}

export interface SponsorshipDeliverable {
  id: string;
  brand_deal_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  submitted_at: string | null;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
}

export const brandDealsService = {
  async getCreatorBrandDeals(creatorId: string): Promise<BrandDeal[]> {
    const { data, error } = await supabase
      .from('brand_deals')
      .select('*')
      .eq('creator_id', creatorId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching brand deals:', error);
      return [];
    }

    return data as BrandDeal[];
  },

  async getActiveBrandDeals(creatorId: string): Promise<BrandDeal[]> {
    const { data, error } = await supabase
      .from('brand_deals')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('status', 'active')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching active brand deals:', error);
      return [];
    }

    return data as BrandDeal[];
  },

  async createBrandDeal(dealData: Partial<BrandDeal>): Promise<BrandDeal | null> {
    const { data, error } = await supabase
      .from('brand_deals')
      .insert([dealData])
      .select()
      .single();

    if (error) {
      console.error('Error creating brand deal:', error);
      return null;
    }

    return data as BrandDeal;
  },

  async updateBrandDeal(
    dealId: string,
    updates: Partial<BrandDeal>
  ): Promise<BrandDeal | null> {
    const { data, error } = await supabase
      .from('brand_deals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', dealId)
      .select()
      .single();

    if (error) {
      console.error('Error updating brand deal:', error);
      return null;
    }

    return data as BrandDeal;
  },

  async deleteBrandDeal(dealId: string): Promise<boolean> {
    const { error } = await supabase
      .from('brand_deals')
      .delete()
      .eq('id', dealId);

    if (error) {
      console.error('Error deleting brand deal:', error);
      return false;
    }

    return true;
  },

  async getVideoSponsorships(videoId: string): Promise<VideoSponsorship[]> {
    const { data, error } = await supabase
      .from('video_sponsorships')
      .select('*')
      .eq('video_id', videoId)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching video sponsorships:', error);
      return [];
    }

    return data as VideoSponsorship[];
  },

  async addVideoSponsorship(
    sponsorshipData: Partial<VideoSponsorship>
  ): Promise<VideoSponsorship | null> {
    const { data, error } = await supabase
      .from('video_sponsorships')
      .insert([sponsorshipData])
      .select()
      .single();

    if (error) {
      console.error('Error adding video sponsorship:', error);
      return null;
    }

    if (sponsorshipData.brand_deal_id) {
      await supabase.rpc('increment', {
        table_name: 'brand_deals',
        column_name: 'completed_videos',
        row_id: sponsorshipData.brand_deal_id,
      });
    }

    return data as VideoSponsorship;
  },

  async updateVideoSponsorship(
    sponsorshipId: string,
    updates: Partial<VideoSponsorship>
  ): Promise<VideoSponsorship | null> {
    const { data, error } = await supabase
      .from('video_sponsorships')
      .update(updates)
      .eq('id', sponsorshipId)
      .select()
      .single();

    if (error) {
      console.error('Error updating video sponsorship:', error);
      return null;
    }

    return data as VideoSponsorship;
  },

  async deleteVideoSponsorship(sponsorshipId: string): Promise<boolean> {
    const { error } = await supabase
      .from('video_sponsorships')
      .delete()
      .eq('id', sponsorshipId);

    if (error) {
      console.error('Error deleting video sponsorship:', error);
      return false;
    }

    return true;
  },

  async getDealDeliverables(dealId: string): Promise<SponsorshipDeliverable[]> {
    const { data, error } = await supabase
      .from('sponsorship_deliverables')
      .select('*')
      .eq('brand_deal_id', dealId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching deliverables:', error);
      return [];
    }

    return data as SponsorshipDeliverable[];
  },

  async addDeliverable(
    deliverableData: Partial<SponsorshipDeliverable>
  ): Promise<SponsorshipDeliverable | null> {
    const { data, error } = await supabase
      .from('sponsorship_deliverables')
      .insert([deliverableData])
      .select()
      .single();

    if (error) {
      console.error('Error adding deliverable:', error);
      return null;
    }

    return data as SponsorshipDeliverable;
  },

  async updateDeliverable(
    deliverableId: string,
    updates: Partial<SponsorshipDeliverable>
  ): Promise<SponsorshipDeliverable | null> {
    if (updates.status === 'submitted' && !updates.submitted_at) {
      updates.submitted_at = new Date().toISOString();
    }
    if (updates.status === 'approved' && !updates.approved_at) {
      updates.approved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('sponsorship_deliverables')
      .update(updates)
      .eq('id', deliverableId)
      .select()
      .single();

    if (error) {
      console.error('Error updating deliverable:', error);
      return null;
    }

    return data as SponsorshipDeliverable;
  },

  async getBrandDealStats(creatorId: string) {
    const { data: deals } = await supabase
      .from('brand_deals')
      .select('*')
      .eq('creator_id', creatorId);

    const { data: sponsorships } = await supabase
      .from('video_sponsorships')
      .select('*')
      .in(
        'video_id',
        (
          await supabase
            .from('videos')
            .select('id')
            .eq('creator_id', creatorId)
        ).data?.map((v) => v.id) || []
      );

    if (!deals) {
      return {
        totalDeals: 0,
        activeDeals: 0,
        completedDeals: 0,
        totalEarned: 0,
        pendingDeliverables: 0,
        sponsoredVideos: 0,
      };
    }

    const totalDeals = deals.length;
    const activeDeals = deals.filter((d) => d.status === 'active').length;
    const completedDeals = deals.filter((d) => d.status === 'completed').length;
    const totalEarned = deals
      .filter((d) => d.status === 'completed')
      .reduce((sum, deal) => sum + deal.contract_value, 0);

    const { data: deliverables } = await supabase
      .from('sponsorship_deliverables')
      .select('*')
      .in(
        'brand_deal_id',
        deals.map((d) => d.id)
      )
      .eq('status', 'pending');

    const pendingDeliverables = deliverables?.length || 0;
    const sponsoredVideos = sponsorships?.length || 0;

    return {
      totalDeals,
      activeDeals,
      completedDeals,
      totalEarned,
      pendingDeliverables,
      sponsoredVideos,
    };
  },
};
