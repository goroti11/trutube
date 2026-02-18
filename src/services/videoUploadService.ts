import { supabase } from '../lib/supabase';

export interface VideoUploadData {
  title: string;
  description: string;
  transcription?: string;
  universe_id: string;
  sub_universe_id?: string;
  tags?: string[];
  thumbnail?: File;
  video: File;
  quality?: 'SD' | 'HD' | 'FHD' | '4K';
}

export interface VideoUploadProgress {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
}

class VideoUploadService {
  private readonly MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
  private readonly MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_VIDEO_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
  private readonly ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

  validateVideoFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'Aucun fichier sélectionné' };
    }

    if (file.size > this.MAX_VIDEO_SIZE) {
      return { valid: false, error: 'La vidéo ne doit pas dépasser 2GB' };
    }

    if (!this.ALLOWED_VIDEO_FORMATS.includes(file.type)) {
      return { valid: false, error: 'Format vidéo non supporté. Utilisez MP4, WebM ou MOV' };
    }

    return { valid: true };
  }

  validateThumbnailFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: true }; // Thumbnail is optional
    }

    if (file.size > this.MAX_THUMBNAIL_SIZE) {
      return { valid: false, error: 'La miniature ne doit pas dépasser 5MB' };
    }

    if (!this.ALLOWED_IMAGE_FORMATS.includes(file.type)) {
      return { valid: false, error: 'Format d\'image non supporté. Utilisez JPG, PNG ou WebP' };
    }

    return { valid: true };
  }

  async getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };

      video.onerror = () => {
        resolve(0);
      };

      video.src = URL.createObjectURL(file);
    });
  }

  async uploadVideo(
    data: VideoUploadData,
    onProgress?: (progress: VideoUploadProgress) => void
  ): Promise<{ success: boolean; videoId?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Vous devez être connecté' };
      }

      // Validate files
      const videoValidation = this.validateVideoFile(data.video);
      if (!videoValidation.valid) {
        return { success: false, error: videoValidation.error };
      }

      if (data.thumbnail) {
        const thumbnailValidation = this.validateThumbnailFile(data.thumbnail);
        if (!thumbnailValidation.valid) {
          return { success: false, error: thumbnailValidation.error };
        }
      }

      // Get video duration
      onProgress?.({ status: 'uploading', progress: 5, message: 'Analyse de la vidéo...' });
      const duration = await this.getVideoDuration(data.video);

      // Create video record first
      onProgress?.({ status: 'uploading', progress: 10, message: 'Création de l\'enregistrement...' });

      const { data: videoRecord, error: createError } = await supabase
        .from('videos')
        .insert({
          creator_id: user.id,
          title: data.title,
          description: data.description,
          transcription: data.transcription || '',
          universe_id: data.universe_id,
          sub_universe_id: data.sub_universe_id || null,
          tags: data.tags || [],
          duration: duration,
          file_size: data.video.size,
          quality: data.quality || 'HD',
          processing_status: 'pending',
          is_published: false,
          view_count: 0,
          like_count: 0,
          dislike_count: 0,
          share_count: 0
        })
        .select()
        .single();

      if (createError || !videoRecord) {
        console.error('Error creating video record:', createError);
        return { success: false, error: 'Erreur lors de la création de l\'enregistrement' };
      }

      const videoId = videoRecord.id;

      // Upload thumbnail if provided
      let thumbnailUrl = '';
      if (data.thumbnail) {
        onProgress?.({ status: 'uploading', progress: 20, message: 'Upload de la miniature...' });

        const thumbnailExt = data.thumbnail.name.split('.').pop();
        const thumbnailPath = `thumbnails/${user.id}/${videoId}.${thumbnailExt}`;

        const { error: thumbnailError } = await supabase.storage
          .from('video-content')
          .upload(thumbnailPath, data.thumbnail, {
            cacheControl: '3600',
            upsert: true
          });

        if (!thumbnailError) {
          const { data: { publicUrl } } = supabase.storage
            .from('video-content')
            .getPublicUrl(thumbnailPath);
          thumbnailUrl = publicUrl;
        }
      }

      // Upload video file
      onProgress?.({ status: 'uploading', progress: 30, message: 'Upload de la vidéo...' });

      const videoExt = data.video.name.split('.').pop();
      const videoPath = `videos/${user.id}/${videoId}.${videoExt}`;

      const { error: uploadError } = await supabase.storage
        .from('video-content')
        .upload(videoPath, data.video, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            const percentage = 30 + Math.round((progress.loaded / progress.total) * 60);
            onProgress?.({
              status: 'uploading',
              progress: percentage,
              message: `Upload en cours... ${percentage}%`
            });
          }
        });

      if (uploadError) {
        console.error('Error uploading video:', uploadError);
        // Delete the video record if upload fails
        await supabase.from('videos').delete().eq('id', videoId);
        return { success: false, error: 'Erreur lors de l\'upload de la vidéo' };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('video-content')
        .getPublicUrl(videoPath);

      // Update video record with URLs
      onProgress?.({ status: 'processing', progress: 95, message: 'Finalisation...' });

      const { error: updateError } = await supabase
        .from('videos')
        .update({
          video_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          processing_status: 'completed',
          is_published: true
        })
        .eq('id', videoId);

      if (updateError) {
        console.error('Error updating video record:', updateError);
        return { success: false, error: 'Erreur lors de la finalisation' };
      }

      onProgress?.({ status: 'completed', progress: 100, message: 'Vidéo publiée avec succès!' });

      return { success: true, videoId };

    } catch (error) {
      console.error('Error in uploadVideo:', error);
      return { success: false, error: 'Erreur inattendue lors de l\'upload' };
    }
  }

  async getCreatorVideos(creatorId: string, includeUnpublished: boolean = false): Promise<any[]> {
    try {
      let query = supabase
        .from('videos')
        .select(`
          *,
          universe:universe_id(id, name),
          sub_universe:sub_universe_id(id, name)
        `)
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (!includeUnpublished) {
        query = query.eq('is_published', true).eq('processing_status', 'completed');
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching creator videos:', error);
      return [];
    }
  }

  async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Get video details first
      const { data: video } = await supabase
        .from('videos')
        .select('video_url, thumbnail_url, creator_id')
        .eq('id', videoId)
        .single();

      if (!video || video.creator_id !== user.id) {
        return false;
      }

      // Delete files from storage
      if (video.video_url) {
        const videoPath = this.extractStoragePath(video.video_url);
        if (videoPath) {
          await supabase.storage.from('video-content').remove([videoPath]);
        }
      }

      if (video.thumbnail_url) {
        const thumbnailPath = this.extractStoragePath(video.thumbnail_url);
        if (thumbnailPath) {
          await supabase.storage.from('video-content').remove([thumbnailPath]);
        }
      }

      // Delete video record
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId)
        .eq('creator_id', user.id);

      return !error;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  async updateVideo(
    videoId: string,
    updates: Partial<{
      title: string;
      description: string;
      transcription: string;
      tags: string[];
      is_published: boolean;
    }>
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', videoId)
        .eq('creator_id', user.id);

      return !error;
    } catch (error) {
      console.error('Error updating video:', error);
      return false;
    }
  }

  private extractStoragePath(url: string): string | null {
    try {
      const urlParts = url.split('/storage/v1/object/public/video-content/');
      return urlParts[1] || null;
    } catch {
      return null;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

export const videoUploadService = new VideoUploadService();
