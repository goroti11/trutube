import { supabase } from '../lib/supabase';

export interface ProfileReview {
  id: string;
  reviewer_id: string;
  profile_id: string;
  rating: number;
  review_text: string;
  is_public: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  reviewer?: {
    username: string;
    avatar_url: string;
    display_name: string;
  };
}

export interface SocialLink {
  id: string;
  user_id: string;
  platform: 'twitter' | 'instagram' | 'youtube' | 'tiktok' | 'facebook' | 'linkedin' | 'twitch' | 'discord' | 'website' | 'other';
  url: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface ProfileShare {
  id: string;
  profile_id: string;
  shared_by_user_id: string;
  share_method: 'link' | 'facebook' | 'twitter' | 'whatsapp' | 'email' | 'other';
  created_at: string;
}

export interface EnhancedProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  banner_url: string;
  channel_url: string;
  bio: string;
  about: string;
  total_reviews: number;
  average_rating: number;
  community_guidelines: Record<string, any>;
  privacy_settings: Record<string, any>;
  is_creator: boolean;
  is_premium: boolean;
  subscriber_count: number;
  video_count: number;
  created_at: string;
}

class ProfileEnhancedService {
  async updateProfileImages(
    userId: string,
    avatarUrl?: string,
    bannerUrl?: string
  ): Promise<boolean> {
    try {
      const updates: any = { updated_at: new Date().toISOString() };

      if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;
      if (bannerUrl !== undefined) updates.banner_url = bannerUrl;

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      return !error;
    } catch (error) {
      console.error('Error updating profile images:', error);
      return false;
    }
  }

  async updateProfileInfo(
    userId: string,
    data: {
      display_name?: string;
      username?: string;
      bio?: string;
      about?: string;
      channel_url?: string;
    }
  ): Promise<boolean> {
    try {
      const updates: any = { ...data, updated_at: new Date().toISOString() };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      return !error;
    } catch (error) {
      console.error('Error updating profile info:', error);
      return false;
    }
  }

  async generateChannelUrl(username: string): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('generate_channel_url', {
        p_username: username
      });

      if (error) throw error;
      return data || username.toLowerCase().replace(/[^a-z0-9]/g, '');
    } catch (error) {
      console.error('Error generating channel URL:', error);
      return username.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
  }

  async addReview(
    reviewerId: string,
    profileId: string,
    rating: number,
    reviewText: string = ''
  ): Promise<ProfileReview | null> {
    try {
      const { data, error } = await supabase
        .from('profile_reviews')
        .insert({
          reviewer_id: reviewerId,
          profile_id: profileId,
          rating,
          review_text: reviewText,
          is_public: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding review:', error);
      return null;
    }
  }

  async getProfileReviews(profileId: string, limit: number = 20): Promise<ProfileReview[]> {
    try {
      const { data, error } = await supabase
        .from('profile_reviews')
        .select(`
          *,
          reviewer:reviewer_id (
            username,
            avatar_url,
            display_name
          )
        `)
        .eq('profile_id', profileId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  async updateReview(
    reviewId: string,
    rating: number,
    reviewText: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profile_reviews')
        .update({
          rating,
          review_text: reviewText,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      return !error;
    } catch (error) {
      console.error('Error updating review:', error);
      return false;
    }
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profile_reviews')
        .delete()
        .eq('id', reviewId);

      return !error;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  }

  async addSocialLink(
    userId: string,
    platform: SocialLink['platform'],
    url: string,
    displayOrder: number = 0
  ): Promise<SocialLink | null> {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .insert({
          user_id: userId,
          platform,
          url,
          display_order: displayOrder,
          is_visible: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding social link:', error);
      return null;
    }
  }

  async getSocialLinks(userId: string): Promise<SocialLink[]> {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', userId)
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching social links:', error);
      return [];
    }
  }

  async updateSocialLink(
    linkId: string,
    url: string,
    isVisible: boolean
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('social_links')
        .update({ url, is_visible: isVisible })
        .eq('id', linkId);

      return !error;
    } catch (error) {
      console.error('Error updating social link:', error);
      return false;
    }
  }

  async deleteSocialLink(linkId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', linkId);

      return !error;
    } catch (error) {
      console.error('Error deleting social link:', error);
      return false;
    }
  }

  async trackProfileShare(
    profileId: string,
    sharedByUserId: string | null,
    shareMethod: ProfileShare['share_method']
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profile_shares')
        .insert({
          profile_id: profileId,
          shared_by_user_id: sharedByUserId,
          share_method: shareMethod
        });

      return !error;
    } catch (error) {
      console.error('Error tracking share:', error);
      return false;
    }
  }

  async getProfileShareCount(profileId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('profile_shares')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching share count:', error);
      return 0;
    }
  }

  async updatePrivacySettings(
    userId: string,
    settings: Record<string, any>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          privacy_settings: settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      return !error;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      return false;
    }
  }

  async updateCommunityGuidelines(
    userId: string,
    guidelines: Record<string, any>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          community_guidelines: guidelines,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      return !error;
    } catch (error) {
      console.error('Error updating community guidelines:', error);
      return false;
    }
  }

  async getEnhancedProfile(userId: string): Promise<EnhancedProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching enhanced profile:', error);
      return null;
    }
  }

  async getProfileByChannelUrl(channelUrl: string): Promise<EnhancedProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('channel_url', channelUrl)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile by channel URL:', error);
      return null;
    }
  }
}

export const profileEnhancedService = new ProfileEnhancedService();
