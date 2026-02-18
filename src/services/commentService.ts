import { supabase } from '../lib/supabase';

export interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  content: string;
  like_count: number;
  created_at: string;
  user?: {
    display_name: string;
    avatar_url: string | null;
    user_status: string;
  };
}

export const commentService = {
  async getComments(videoId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles!comments_user_id_fkey(
          display_name,
          avatar_url,
          user_status
        )
      `)
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return data as Comment[];
  },

  async addComment(
    videoId: string,
    userId: string,
    content: string
  ): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        video_id: videoId,
        user_id: userId,
        content: content,
      })
      .select(`
        *,
        user:profiles!comments_user_id_fkey(
          display_name,
          avatar_url,
          user_status
        )
      `)
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      return null;
    }

    await supabase.rpc('increment_comment_count', { video_id: videoId });

    return data as Comment;
  },

  async deleteComment(commentId: string): Promise<boolean> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      return false;
    }

    return true;
  },
};
