import { supabase } from '../lib/supabase';

export interface VideoReview {
  id: string;
  video_id: string;
  reviewer_id: string;
  rating: number;
  title: string;
  content: string;
  helpful_count: number;
  verified_purchase: boolean;
  status: 'published' | 'hidden' | 'reported' | 'removed';
  created_at: string;
  updated_at: string;
  reviewer?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  response?: ReviewResponse;
  user_helpfulness?: boolean;
}

export interface CreatorReview {
  id: string;
  creator_id: string;
  reviewer_id: string;
  rating: number;
  title: string;
  content: string;
  helpful_count: number;
  verified_supporter: boolean;
  status: 'published' | 'hidden' | 'reported' | 'removed';
  created_at: string;
  updated_at: string;
  reviewer?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  response?: ReviewResponse;
  user_helpfulness?: boolean;
}

export interface ReviewResponse {
  id: string;
  review_id: string;
  review_type: 'video' | 'creator';
  creator_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

class ReviewService {
  // Video Reviews
  async getVideoReviews(videoId: string, userId?: string) {
    let query = supabase
      .from('video_reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(id, username, display_name, avatar_url),
        response:review_responses(*)
      `)
      .eq('video_id', videoId)
      .eq('status', 'published')
      .order('helpful_count', { ascending: false })
      .order('created_at', { ascending: false });

    const { data: reviews, error } = await query;
    if (error) throw error;

    if (userId && reviews) {
      const reviewIds = reviews.map(r => r.id);
      const { data: helpfulness } = await supabase
        .from('review_helpfulness')
        .select('review_id, is_helpful')
        .eq('review_type', 'video')
        .in('review_id', reviewIds)
        .eq('user_id', userId);

      const helpfulnessMap = new Map(
        helpfulness?.map(h => [h.review_id, h.is_helpful]) || []
      );

      return reviews.map(review => ({
        ...review,
        user_helpfulness: helpfulnessMap.get(review.id)
      }));
    }

    return reviews || [];
  }

  async getVideoReviewStats(videoId: string): Promise<ReviewStats> {
    const { data, error } = await supabase
      .from('video_reviews')
      .select('rating')
      .eq('video_id', videoId)
      .eq('status', 'published');

    if (error) throw error;

    const total = data?.length || 0;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    data?.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
      sum += review.rating;
    });

    return {
      average_rating: total > 0 ? sum / total : 0,
      total_reviews: total,
      rating_distribution: distribution
    };
  }

  async createVideoReview(review: {
    video_id: string;
    rating: number;
    title: string;
    content: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if user has supported the creator
    const { data: supportData } = await supabase
      .from('creator_support')
      .select('id')
      .eq('supporter_id', user.id)
      .eq('video_id', review.video_id)
      .maybeSingle();

    const { data, error } = await supabase
      .from('video_reviews')
      .insert({
        ...review,
        reviewer_id: user.id,
        verified_purchase: !!supportData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateVideoReview(reviewId: string, updates: {
    rating?: number;
    title?: string;
    content?: string;
  }) {
    const { data, error } = await supabase
      .from('video_reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteVideoReview(reviewId: string) {
    const { error } = await supabase
      .from('video_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
  }

  // Creator Reviews
  async getCreatorReviews(creatorId: string, userId?: string) {
    let query = supabase
      .from('creator_reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(id, username, display_name, avatar_url),
        response:review_responses(*)
      `)
      .eq('creator_id', creatorId)
      .eq('status', 'published')
      .order('helpful_count', { ascending: false })
      .order('created_at', { ascending: false });

    const { data: reviews, error } = await query;
    if (error) throw error;

    if (userId && reviews) {
      const reviewIds = reviews.map(r => r.id);
      const { data: helpfulness } = await supabase
        .from('review_helpfulness')
        .select('review_id, is_helpful')
        .eq('review_type', 'creator')
        .in('review_id', reviewIds)
        .eq('user_id', userId);

      const helpfulnessMap = new Map(
        helpfulness?.map(h => [h.review_id, h.is_helpful]) || []
      );

      return reviews.map(review => ({
        ...review,
        user_helpfulness: helpfulnessMap.get(review.id)
      }));
    }

    return reviews || [];
  }

  async getCreatorReviewStats(creatorId: string): Promise<ReviewStats> {
    const { data, error } = await supabase
      .from('creator_reviews')
      .select('rating')
      .eq('creator_id', creatorId)
      .eq('status', 'published');

    if (error) throw error;

    const total = data?.length || 0;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    data?.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
      sum += review.rating;
    });

    return {
      average_rating: total > 0 ? sum / total : 0,
      total_reviews: total,
      rating_distribution: distribution
    };
  }

  async createCreatorReview(review: {
    creator_id: string;
    rating: number;
    title: string;
    content: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if user is a supporter
    const { data: supportData } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('supporter_id', user.id)
      .eq('creator_id', review.creator_id)
      .eq('status', 'active')
      .maybeSingle();

    const { data, error } = await supabase
      .from('creator_reviews')
      .insert({
        ...review,
        reviewer_id: user.id,
        verified_supporter: !!supportData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCreatorReview(reviewId: string, updates: {
    rating?: number;
    title?: string;
    content?: string;
  }) {
    const { data, error } = await supabase
      .from('creator_reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCreatorReview(reviewId: string) {
    const { error } = await supabase
      .from('creator_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
  }

  // Review Helpfulness
  async markReviewHelpful(
    reviewId: string,
    reviewType: 'video' | 'creator',
    isHelpful: boolean
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('review_helpfulness')
      .upsert({
        review_id: reviewId,
        review_type: reviewType,
        user_id: user.id,
        is_helpful: isHelpful
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeHelpfulness(reviewId: string, reviewType: 'video' | 'creator') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('review_helpfulness')
      .delete()
      .eq('review_id', reviewId)
      .eq('review_type', reviewType)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  // Review Responses
  async createReviewResponse(
    reviewId: string,
    reviewType: 'video' | 'creator',
    content: string
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('review_responses')
      .insert({
        review_id: reviewId,
        review_type: reviewType,
        creator_id: user.id,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateReviewResponse(responseId: string, content: string) {
    const { data, error } = await supabase
      .from('review_responses')
      .update({ content })
      .eq('id', responseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteReviewResponse(responseId: string) {
    const { error } = await supabase
      .from('review_responses')
      .delete()
      .eq('id', responseId);

    if (error) throw error;
  }
}

export const reviewService = new ReviewService();
