import { supabase } from '../lib/supabase';

export interface SavedVideo {
  id: string;
  user_id: string;
  video_id: string;
  video_title: string;
  video_thumbnail: string;
  video_creator: string;
  video_duration: number;
  created_at: string;
}

export const savedVideosService = {
  async getSavedVideos(userId: string): Promise<SavedVideo[]> {
    const { data, error } = await supabase
      .from('saved_videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved videos:', error);
      return [];
    }
    return data as SavedVideo[];
  },

  async saveVideo(userId: string, video: {
    video_id: string;
    video_title: string;
    video_thumbnail: string;
    video_creator: string;
    video_duration: number;
  }): Promise<boolean> {
    const { error } = await supabase
      .from('saved_videos')
      .insert([{ user_id: userId, ...video }]);

    if (error) {
      console.error('Error saving video:', error);
      return false;
    }
    return true;
  },

  async unsaveVideo(userId: string, videoId: string): Promise<boolean> {
    const { error } = await supabase
      .from('saved_videos')
      .delete()
      .eq('user_id', userId)
      .eq('video_id', videoId);

    if (error) {
      console.error('Error unsaving video:', error);
      return false;
    }
    return true;
  },

  async isVideoSaved(userId: string, videoId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('saved_videos')
      .select('id')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  }
};
