import { supabase } from '../lib/supabase';

export interface ResourceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  order_index: number;
  created_at: string;
}

export interface Resource {
  id: string;
  category_id?: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  type: 'guide' | 'tutorial' | 'documentation' | 'video' | 'pdf' | 'link';
  url?: string;
  thumbnail_url?: string;
  tags: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimated_time?: number;
  author_id?: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  helpful_count: number;
  not_helpful_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  category?: ResourceCategory;
}

export interface CommunityAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'feature' | 'maintenance' | 'incident' | 'update' | 'general';
  severity: 'info' | 'warning' | 'critical';
  author_id?: string;
  published_at?: string;
  expires_at?: string;
  is_pinned: boolean;
  status: 'draft' | 'active' | 'archived';
  views: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityFeedback {
  id: string;
  user_id: string;
  type: 'feature_request' | 'bug_report' | 'improvement' | 'question' | 'praise';
  title: string;
  description: string;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'reviewing' | 'planned' | 'in_progress' | 'completed' | 'declined';
  votes: number;
  admin_response?: string;
  admin_id?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  hasVoted?: boolean;
}

export interface KnowledgeBase {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  helpful_count: number;
  not_helpful_count: number;
  order_index: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export const resourceService = {
  async getCategories(): Promise<ResourceCategory[]> {
    const { data, error } = await supabase
      .from('resource_categories')
      .select('*')
      .order('order_index');

    if (error) throw error;
    return data || [];
  },

  async getResources(options?: {
    category?: string;
    type?: string;
    difficulty?: string;
    search?: string;
    limit?: number;
  }): Promise<Resource[]> {
    let query = supabase
      .from('resources')
      .select('*, category:resource_categories(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (options?.category) {
      query = query.eq('category_id', options.category);
    }

    if (options?.type) {
      query = query.eq('type', options.type);
    }

    if (options?.difficulty) {
      query = query.eq('difficulty', options.difficulty);
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getResourceBySlug(slug: string): Promise<Resource | null> {
    const { data, error } = await supabase
      .from('resources')
      .select('*, category:resource_categories(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async incrementResourceViews(slug: string): Promise<void> {
    const { error } = await supabase.rpc('increment_resource_views', {
      resource_slug: slug
    });

    if (error) console.error('Failed to increment views:', error);
  },

  async getAnnouncements(): Promise<CommunityAnnouncement[]> {
    const { data, error } = await supabase
      .from('community_announcements')
      .select('*')
      .eq('status', 'active')
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getFeedback(options?: {
    type?: string;
    status?: string;
    sortBy?: 'recent' | 'votes' | 'status';
  }): Promise<CommunityFeedback[]> {
    let query = supabase
      .from('community_feedback')
      .select(`
        *,
        user:user_profiles(id, username, avatar_url)
      `);

    if (options?.type) {
      query = query.eq('type', options.type);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.sortBy === 'votes') {
      query = query.order('votes', { ascending: false });
    } else if (options?.sortBy === 'status') {
      query = query.order('status');
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      const feedbackWithVotes = await Promise.all(
        (data || []).map(async (feedback) => {
          const { data: voteData } = await supabase
            .from('feedback_votes')
            .select('id')
            .eq('feedback_id', feedback.id)
            .eq('user_id', user.id)
            .maybeSingle();

          return { ...feedback, hasVoted: !!voteData };
        })
      );
      return feedbackWithVotes;
    }

    return data || [];
  },

  async submitFeedback(feedback: {
    type: string;
    title: string;
    description: string;
    category?: string;
  }): Promise<CommunityFeedback> {
    const { data, error } = await supabase
      .from('community_feedback')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        ...feedback
      })
      .select('*, user:user_profiles(id, username, avatar_url)')
      .single();

    if (error) throw error;
    return data;
  },

  async voteFeedback(feedbackId: string): Promise<void> {
    const { error } = await supabase.rpc('vote_feedback', {
      feedback_id: feedbackId
    });

    if (error) throw error;
  },

  async unvoteFeedback(feedbackId: string): Promise<void> {
    const { error } = await supabase.rpc('unvote_feedback', {
      feedback_id: feedbackId
    });

    if (error) throw error;
  },

  async searchKnowledge(query: string): Promise<KnowledgeBase[]> {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('status', 'published')
      .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
      .order('order_index');

    if (error) throw error;
    return data || [];
  },

  async getKnowledgeByCategory(category: string): Promise<KnowledgeBase[]> {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('status', 'published')
      .eq('category', category)
      .order('order_index');

    if (error) throw error;
    return data || [];
  },

  async getAllKnowledge(): Promise<KnowledgeBase[]> {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('status', 'published')
      .order('category')
      .order('order_index');

    if (error) throw error;
    return data || [];
  },

  async bookmarkResource(resourceId: string, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('resource_bookmarks')
      .insert({
        resource_id: resourceId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        notes
      });

    if (error) throw error;
  },

  async removeBookmark(resourceId: string): Promise<void> {
    const { error } = await supabase
      .from('resource_bookmarks')
      .delete()
      .eq('resource_id', resourceId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
  },

  async getUserBookmarks(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resource_bookmarks')
      .select('resource:resources(*, category:resource_categories(*))')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
    return data?.map(item => item.resource).filter(Boolean) || [];
  }
};
