import { supabase } from '../lib/supabase';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  created_at: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category_id?: string;
  author_id?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  views: number;
  reading_time: number;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
  author?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  reactions?: {
    likes: number;
    loves: number;
    insightful: number;
    bookmarks: number;
  };
}

export interface BlogComment {
  id: string;
  article_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  likes: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  replies?: BlogComment[];
}

export const blogService = {
  async getCategories(): Promise<BlogCategory[]> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getArticles(options?: {
    category?: string;
    tag?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ articles: BlogArticle[]; total: number }> {
    let query = supabase
      .from('blog_articles')
      .select(`
        *,
        category:blog_categories(*),
        author:user_profiles(id, username, avatar_url)
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (options?.category) {
      query = query.eq('category.slug', options.category);
    }

    if (options?.tag) {
      query = query.contains('tags', [options.tag]);
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options?.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const articlesWithReactions = await Promise.all(
      (data || []).map(async (article) => {
        const reactions = await this.getArticleReactions(article.id);
        return { ...article, reactions };
      })
    );

    return {
      articles: articlesWithReactions,
      total: count || 0
    };
  },

  async getArticleBySlug(slug: string): Promise<BlogArticle | null> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select(`
        *,
        category:blog_categories(*),
        author:user_profiles(id, username, avatar_url)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const reactions = await this.getArticleReactions(data.id);

    return { ...data, reactions };
  },

  async incrementArticleViews(slug: string): Promise<void> {
    const { error } = await supabase.rpc('increment_article_views', {
      article_slug: slug
    });

    if (error) console.error('Failed to increment views:', error);
  },

  async getArticleReactions(articleId: string): Promise<{
    likes: number;
    loves: number;
    insightful: number;
    bookmarks: number;
  }> {
    const { data, error } = await supabase
      .from('blog_reactions')
      .select('reaction_type')
      .eq('article_id', articleId);

    if (error) {
      console.error('Failed to fetch reactions:', error);
      return { likes: 0, loves: 0, insightful: 0, bookmarks: 0 };
    }

    const reactions = {
      likes: 0,
      loves: 0,
      insightful: 0,
      bookmarks: 0
    };

    data?.forEach((reaction) => {
      if (reaction.reaction_type === 'like') reactions.likes++;
      if (reaction.reaction_type === 'love') reactions.loves++;
      if (reaction.reaction_type === 'insightful') reactions.insightful++;
      if (reaction.reaction_type === 'bookmark') reactions.bookmarks++;
    });

    return reactions;
  },

  async addReaction(
    articleId: string,
    reactionType: 'like' | 'love' | 'insightful' | 'bookmark'
  ): Promise<void> {
    const { error } = await supabase
      .from('blog_reactions')
      .insert({
        article_id: articleId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        reaction_type: reactionType
      });

    if (error) throw error;
  },

  async removeReaction(
    articleId: string,
    reactionType: 'like' | 'love' | 'insightful' | 'bookmark'
  ): Promise<void> {
    const { error } = await supabase
      .from('blog_reactions')
      .delete()
      .eq('article_id', articleId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .eq('reaction_type', reactionType);

    if (error) throw error;
  },

  async getComments(articleId: string): Promise<BlogComment[]> {
    const { data, error } = await supabase
      .from('blog_comments')
      .select(`
        *,
        user:user_profiles(id, username, avatar_url)
      `)
      .eq('article_id', articleId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const commentsWithReplies = await Promise.all(
      (data || []).map(async (comment) => {
        const replies = await this.getCommentReplies(comment.id);
        return { ...comment, replies };
      })
    );

    return commentsWithReplies;
  },

  async getCommentReplies(parentId: string): Promise<BlogComment[]> {
    const { data, error } = await supabase
      .from('blog_comments')
      .select(`
        *,
        user:user_profiles(id, username, avatar_url)
      `)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addComment(
    articleId: string,
    content: string,
    parentId?: string
  ): Promise<BlogComment> {
    const { data, error } = await supabase
      .from('blog_comments')
      .insert({
        article_id: articleId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        content,
        parent_id: parentId
      })
      .select(`
        *,
        user:user_profiles(id, username, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  },

  async getTrendingTags(limit: number = 10): Promise<{ tag: string; count: number }[]> {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('tags')
      .eq('status', 'published');

    if (error) throw error;

    const tagCounts = new Map<string, number>();

    data?.forEach((article) => {
      article.tags?.forEach((tag: string) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  async getRelatedArticles(articleId: string, limit: number = 3): Promise<BlogArticle[]> {
    const article = await supabase
      .from('blog_articles')
      .select('category_id, tags')
      .eq('id', articleId)
      .single();

    if (article.error) return [];

    const { data, error } = await supabase
      .from('blog_articles')
      .select(`
        *,
        category:blog_categories(*),
        author:user_profiles(id, username, avatar_url)
      `)
      .eq('status', 'published')
      .neq('id', articleId)
      .or(`category_id.eq.${article.data.category_id},tags.ov.{${article.data.tags?.join(',') || ''}}`)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  }
};
