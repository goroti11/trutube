import { Video as TypeVideo, UserStatus } from '../types';
import { VideoWithCreator } from '../services/videoService';

export function convertSupabaseVideoToTypeVideo(supabaseVideo: VideoWithCreator): TypeVideo {
  return {
    id: supabaseVideo.id,
    userId: supabaseVideo.creator_id,
    creatorId: supabaseVideo.creator_id,
    universeId: supabaseVideo.universe_id || undefined,
    subUniverseId: supabaseVideo.sub_universe_id || undefined,
    title: supabaseVideo.title,
    description: supabaseVideo.description,
    thumbnailUrl: supabaseVideo.thumbnail_url || '/placeholder-thumbnail.jpg',
    videoUrl: supabaseVideo.video_url || '',
    duration: supabaseVideo.duration,
    isShort: supabaseVideo.is_short,
    isPremium: supabaseVideo.is_premium,
    viewCount: supabaseVideo.view_count,
    likeCount: supabaseVideo.like_count,
    commentCount: supabaseVideo.comment_count,
    avgWatchTime: supabaseVideo.avg_watch_time,
    isMasked: supabaseVideo.is_masked,
    qualityScore: supabaseVideo.quality_score,
    authenticityScore: supabaseVideo.authenticity_score,
    createdAt: supabaseVideo.created_at,
    user: {
      id: supabaseVideo.creator_id,
      displayName: supabaseVideo.creator.display_name,
      avatarUrl: supabaseVideo.creator.avatar_url || '/placeholder-avatar.jpg',
      bio: '',
      userStatus: supabaseVideo.creator.user_status as UserStatus,
      subscriberCount: 0,
      uploadFrequency: 0,
      createdAt: '',
      updatedAt: ''
    }
  };
}

export function convertSupabaseVideosToTypeVideos(supabaseVideos: VideoWithCreator[]): TypeVideo[] {
  return supabaseVideos.map(convertSupabaseVideoToTypeVideo);
}
