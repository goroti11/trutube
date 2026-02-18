import { supabase } from '../lib/supabase';

/**
 * Service de gestion des liens de réseaux sociaux
 * Permet aux utilisateurs d'ajouter tous leurs réseaux sociaux
 */

export interface SocialLink {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  url: string;
  display_order: number;
  is_verified: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitch'
  | 'linkedin'
  | 'snapchat'
  | 'pinterest'
  | 'reddit'
  | 'discord'
  | 'telegram'
  | 'whatsapp'
  | 'spotify'
  | 'apple_music'
  | 'soundcloud'
  | 'bandcamp'
  | 'github'
  | 'gitlab'
  | 'behance'
  | 'dribbble'
  | 'medium'
  | 'substack'
  | 'patreon'
  | 'kofi'
  | 'buymeacoffee'
  | 'website'
  | 'blog'
  | 'portfolio'
  | 'other';

export const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: '👥', color: '#1877F2', urlPattern: 'facebook.com' },
  { value: 'twitter', label: 'X (Twitter)', icon: '𝕏', color: '#000000', urlPattern: 'twitter.com|x.com' },
  { value: 'instagram', label: 'Instagram', icon: '📷', color: '#E4405F', urlPattern: 'instagram.com' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', color: '#000000', urlPattern: 'tiktok.com' },
  { value: 'youtube', label: 'YouTube', icon: '▶️', color: '#FF0000', urlPattern: 'youtube.com' },
  { value: 'twitch', label: 'Twitch', icon: '🎮', color: '#9146FF', urlPattern: 'twitch.tv' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0A66C2', urlPattern: 'linkedin.com' },
  { value: 'snapchat', label: 'Snapchat', icon: '👻', color: '#FFFC00', urlPattern: 'snapchat.com' },
  { value: 'pinterest', label: 'Pinterest', icon: '📌', color: '#E60023', urlPattern: 'pinterest.com' },
  { value: 'reddit', label: 'Reddit', icon: '🤖', color: '#FF4500', urlPattern: 'reddit.com' },
  { value: 'discord', label: 'Discord', icon: '💬', color: '#5865F2', urlPattern: 'discord.gg|discord.com' },
  { value: 'telegram', label: 'Telegram', icon: '✈️', color: '#26A5E4', urlPattern: 't.me' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '📱', color: '#25D366', urlPattern: 'wa.me|whatsapp.com' },
  { value: 'spotify', label: 'Spotify', icon: '🎧', color: '#1DB954', urlPattern: 'spotify.com' },
  { value: 'apple_music', label: 'Apple Music', icon: '🎵', color: '#FA243C', urlPattern: 'music.apple.com' },
  { value: 'soundcloud', label: 'SoundCloud', icon: '🔊', color: '#FF3300', urlPattern: 'soundcloud.com' },
  { value: 'bandcamp', label: 'Bandcamp', icon: '🎸', color: '#629AA9', urlPattern: 'bandcamp.com' },
  { value: 'github', label: 'GitHub', icon: '💻', color: '#181717', urlPattern: 'github.com' },
  { value: 'gitlab', label: 'GitLab', icon: '🦊', color: '#FCA121', urlPattern: 'gitlab.com' },
  { value: 'behance', label: 'Behance', icon: '🎨', color: '#1769FF', urlPattern: 'behance.net' },
  { value: 'dribbble', label: 'Dribbble', icon: '🏀', color: '#EA4C89', urlPattern: 'dribbble.com' },
  { value: 'medium', label: 'Medium', icon: '✍️', color: '#000000', urlPattern: 'medium.com' },
  { value: 'substack', label: 'Substack', icon: '📧', color: '#FF6719', urlPattern: 'substack.com' },
  { value: 'patreon', label: 'Patreon', icon: '🎁', color: '#FF424D', urlPattern: 'patreon.com' },
  { value: 'kofi', label: 'Ko-fi', icon: '☕', color: '#FF5E5B', urlPattern: 'ko-fi.com' },
  { value: 'buymeacoffee', label: 'Buy Me a Coffee', icon: '☕', color: '#FFDD00', urlPattern: 'buymeacoffee.com' },
  { value: 'website', label: 'Site Web', icon: '🌐', color: '#4A90E2', urlPattern: '' },
  { value: 'blog', label: 'Blog', icon: '📝', color: '#34495E', urlPattern: '' },
  { value: 'portfolio', label: 'Portfolio', icon: '🎯', color: '#9B59B6', urlPattern: '' },
  { value: 'other', label: 'Autre', icon: '🔗', color: '#95A5A6', urlPattern: '' }
];

class SocialLinksService {
  /**
   * Récupérer tous les liens sociaux d'un utilisateur
   */
  async getUserSocialLinks(userId: string): Promise<SocialLink[]> {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erreur récupération liens sociaux:', error);
      return [];
    }
  }

  /**
   * Ajouter un nouveau lien social
   */
  async addSocialLink(
    userId: string,
    platform: SocialPlatform,
    url: string
  ): Promise<SocialLink | null> {
    try {
      // Valider l'URL
      if (!this.validateUrl(url)) {
        throw new Error('URL invalide');
      }

      // Valider que l'URL correspond à la plateforme
      if (!this.validatePlatformUrl(platform, url)) {
        throw new Error('L\'URL ne correspond pas à la plateforme sélectionnée');
      }

      // Obtenir le prochain ordre d'affichage
      const { data: existingLinks } = await supabase
        .from('social_links')
        .select('display_order')
        .eq('user_id', userId)
        .order('display_order', { ascending: false })
        .limit(1);

      const nextOrder = existingLinks && existingLinks.length > 0
        ? existingLinks[0].display_order + 1
        : 0;

      const { data, error } = await supabase
        .from('social_links')
        .insert({
          user_id: userId,
          platform,
          url,
          display_order: nextOrder,
          is_verified: false,
          click_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erreur ajout lien social:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un lien social
   */
  async updateSocialLink(
    linkId: string,
    userId: string,
    updates: Partial<Pick<SocialLink, 'url' | 'display_order'>>
  ): Promise<SocialLink | null> {
    try {
      if (updates.url && !this.validateUrl(updates.url)) {
        throw new Error('URL invalide');
      }

      const { data, error } = await supabase
        .from('social_links')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', linkId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erreur mise à jour lien social:', error);
      throw error;
    }
  }

  /**
   * Supprimer un lien social
   */
  async deleteSocialLink(linkId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', linkId)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Erreur suppression lien social:', error);
      return false;
    }
  }

  /**
   * Réorganiser les liens sociaux
   */
  async reorderSocialLinks(
    userId: string,
    linkIds: string[]
  ): Promise<boolean> {
    try {
      // Mettre à jour l'ordre d'affichage de chaque lien
      const updates = linkIds.map((linkId, index) =>
        supabase
          .from('social_links')
          .update({ display_order: index })
          .eq('id', linkId)
          .eq('user_id', userId)
      );

      await Promise.all(updates);

      return true;
    } catch (error) {
      console.error('Erreur réorganisation liens:', error);
      return false;
    }
  }

  /**
   * Incrémenter le compteur de clics
   */
  async trackClick(linkId: string): Promise<void> {
    try {
      await supabase.rpc('increment_social_link_clicks', {
        link_id: linkId
      });
    } catch (error) {
      console.error('Erreur tracking clic:', error);
    }
  }

  /**
   * Obtenir les statistiques de clics
   */
  async getLinkAnalytics(userId: string): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('platform, click_count')
        .eq('user_id', userId);

      if (error) throw error;

      const analytics: Record<string, number> = {};
      data?.forEach(link => {
        analytics[link.platform] = link.click_count;
      });

      return analytics;
    } catch (error) {
      console.error('Erreur analytics liens:', error);
      return {};
    }
  }

  /**
   * Valider une URL
   */
  private validateUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Valider que l'URL correspond à la plateforme
   */
  private validatePlatformUrl(platform: SocialPlatform, url: string): boolean {
    const platformInfo = SOCIAL_PLATFORMS.find(p => p.value === platform);

    if (!platformInfo || !platformInfo.urlPattern) {
      return true; // Pas de validation pour les plateformes sans pattern
    }

    const patterns = platformInfo.urlPattern.split('|');
    return patterns.some(pattern => url.toLowerCase().includes(pattern));
  }

  /**
   * Obtenir les informations d'une plateforme
   */
  getPlatformInfo(platform: SocialPlatform) {
    return SOCIAL_PLATFORMS.find(p => p.value === platform);
  }

  /**
   * Obtenir toutes les plateformes disponibles
   */
  getAllPlatforms() {
    return SOCIAL_PLATFORMS;
  }
}

export const socialLinksService = new SocialLinksService();
