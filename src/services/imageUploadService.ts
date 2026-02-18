import { supabase } from '../lib/supabase';

export type ImageBucket = 'avatars' | 'banners' | 'thumbnails';

export interface UploadResult {
  url: string;
  path: string;
  bucket: string;
}

export const imageUploadService = {
  async uploadImage(
    file: File,
    bucket: ImageBucket,
    userId: string
  ): Promise<UploadResult> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
      bucket
    };
  },

  async deleteImage(bucket: ImageBucket, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  },

  async updateProfileAvatar(userId: string, avatarUrl: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);

    if (error) throw error;
  },

  async updateProfileBanner(userId: string, bannerUrl: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ banner_url: bannerUrl })
      .eq('id', userId);

    if (error) throw error;
  },

  getPublicUrl(bucket: ImageBucket, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  },

  validateImageFile(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Format non supporté. Utilisez JPG, PNG, WEBP ou GIF'
      };
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `La taille maximale est de ${maxSizeMB}MB`
      };
    }

    return { valid: true };
  },

  async listUserImages(userId: string, bucket: ImageBucket) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;
    return data;
  }
};
