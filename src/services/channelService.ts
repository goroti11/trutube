import { supabase } from '../lib/supabase';

export type KycStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';
export type ChannelVisibility = 'public' | 'private' | 'unlisted';
export type LegalEntityType = 'individual' | 'company' | 'auto_entrepreneur' | 'association';
export type ChannelType = 'creator' | 'artist' | 'label' | 'studio' | 'brand';
export type CollaboratorRole = 'admin' | 'editor' | 'analyst' | 'moderator' | 'finance';
export type PlaylistType = 'standard' | 'series' | 'album' | 'course' | 'season';

export interface LegalProfile {
  id: string;
  user_id: string;
  legal_entity_type: LegalEntityType;
  legal_name: string;
  business_name: string;
  tax_country: string;
  tax_id: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_state: string;
  address_country: string;
  phone: string;
  iban_last4: string;
  bank_account_holder: string;
  payment_method_verified: boolean;
  kyc_status: KycStatus;
  kyc_submitted_at: string | null;
  kyc_approved_at: string | null;
  tos_accepted: boolean;
  tos_accepted_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreatorChannel {
  id: string;
  user_id: string;
  legal_profile_id: string | null;
  channel_name: string;
  channel_slug: string;
  channel_type: ChannelType;
  description: string;
  avatar_url: string;
  banner_url: string;
  website_url: string;
  contact_email: string;
  display_country: string;
  channel_category: string;
  channel_language: string;
  official_hashtags: string[];
  visibility: ChannelVisibility;
  is_primary: boolean;
  is_verified: boolean;
  is_suspended: boolean;
  suspension_reason: string;
  subscriber_count: number;
  video_count: number;
  total_views: number;
  monetization_enabled: boolean;
  monetization_tier: string;
  social_links: Record<string, string>;
  custom_tags: string[];
  intro_video_url: string | null;
  trailer_visitors_url: string | null;
  trailer_subscribers_url: string | null;
  notification_settings: {
    video_release: boolean;
    album_release: boolean;
    live_start: boolean;
    merch_promo: boolean;
    preorder: boolean;
  };
  page_sections_order: string[];
  created_at: string;
  updated_at: string;
}

export interface ChannelPlaylist {
  id: string;
  channel_id: string;
  user_id: string;
  title: string;
  description: string;
  playlist_type: PlaylistType;
  thumbnail_url: string | null;
  visibility: 'public' | 'unlisted' | 'private';
  is_premium_locked: boolean;
  video_count: number;
  sort_order: string;
  created_at: string;
  updated_at: string;
}

export interface ChannelCollaborator {
  id: string;
  channel_id: string;
  user_id: string;
  invited_by: string;
  role: CollaboratorRole;
  permissions: Record<string, boolean>;
  accepted: boolean;
  accepted_at: string | null;
  created_at: string;
}

export type LegalProfileInput = Partial<Omit<LegalProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type ChannelInput = Partial<Omit<CreatorChannel, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type PlaylistInput = Partial<Omit<ChannelPlaylist, 'id' | 'user_id' | 'channel_id' | 'created_at' | 'updated_at'>>;

export const CHANNEL_TYPES: { value: ChannelType; label: string; desc: string; icon: string }[] = [
  { value: 'creator', label: 'Créateur individuel', desc: 'Contenu personnel, vlogs, tutoriels', icon: '🎬' },
  { value: 'artist', label: 'Artiste musical', desc: 'Albums, singles, clips musicaux', icon: '🎵' },
  { value: 'label', label: 'Label', desc: 'Multi-artistes, gestion de catalogue', icon: '🏷️' },
  { value: 'studio', label: 'Studio / Média', desc: 'Production vidéo, émissions, podcasts', icon: '🎙️' },
  { value: 'brand', label: 'Marque', desc: 'Contenu commercial, brand content', icon: '💼' },
];

export const CHANNEL_SECTIONS = [
  { id: 'home', label: 'Accueil', desc: 'Présentation de la chaîne' },
  { id: 'videos', label: 'Vidéos', desc: 'Liste des vidéos' },
  { id: 'shorts', label: 'Shorts', desc: 'Formats courts' },
  { id: 'albums', label: 'Albums', desc: 'Contenu premium musical' },
  { id: 'lives', label: 'Lives', desc: 'Diffusions en direct' },
  { id: 'store', label: 'Store', desc: 'Merchandising et produits' },
  { id: 'playlists', label: 'Playlists', desc: 'Collections et séries' },
  { id: 'community', label: 'Communauté', desc: 'Posts et interactions' },
];

export const COLLABORATOR_ROLES: { value: CollaboratorRole; label: string; desc: string; perms: string[] }[] = [
  { value: 'admin', label: 'Admin', desc: 'Accès complet', perms: ['Tout gérer'] },
  { value: 'editor', label: 'Éditeur', desc: 'Gérer les contenus', perms: ['Vidéos', 'Posts', 'Playlists'] },
  { value: 'analyst', label: 'Analyste', desc: 'Voir les statistiques', perms: ['Stats', 'Analytics'] },
  { value: 'moderator', label: 'Modérateur', desc: 'Gérer les commentaires', perms: ['Commentaires', 'Signalements'] },
  { value: 'finance', label: 'Financier', desc: 'Voir les revenus', perms: ['Revenus', 'Paiements'] },
];

export const channelService = {
  async getLegalProfile(userId: string): Promise<LegalProfile | null> {
    try {
      const { data, error } = await supabase
        .from('legal_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting legal profile:', error);
      return null;
    }
  },

  async upsertLegalProfile(userId: string, input: LegalProfileInput): Promise<LegalProfile | null> {
    try {
      const { data, error } = await supabase
        .from('legal_profiles')
        .upsert({ user_id: userId, ...input }, { onConflict: 'user_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upserting legal profile:', error);
      return null;
    }
  },

  async getMyChannels(userId: string): Promise<CreatorChannel[]> {
    try {
      const { data, error } = await supabase
        .from('creator_channels')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting channels:', error);
      return [];
    }
  },

  async getChannel(channelId: string): Promise<CreatorChannel | null> {
    try {
      const { data, error } = await supabase
        .from('creator_channels')
        .select('*')
        .eq('id', channelId)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting channel:', error);
      return null;
    }
  },

  async getChannelBySlug(slug: string): Promise<CreatorChannel | null> {
    try {
      const { data, error } = await supabase
        .from('creator_channels')
        .select('*')
        .eq('channel_slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting channel by slug:', error);
      return null;
    }
  },

  async createChannel(userId: string, input: ChannelInput & { channel_name: string; channel_slug: string }): Promise<CreatorChannel | null> {
    try {
      const { data, error } = await supabase
        .from('creator_channels')
        .insert({ user_id: userId, ...input })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating channel:', error);
      return null;
    }
  },

  async updateChannel(channelId: string, input: ChannelInput): Promise<CreatorChannel | null> {
    try {
      const { data, error } = await supabase
        .from('creator_channels')
        .update(input)
        .eq('id', channelId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating channel:', error);
      return null;
    }
  },

  async deleteChannel(channelId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('creator_channels')
        .delete()
        .eq('id', channelId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting channel:', error);
      return false;
    }
  },

  async isSlugAvailable(slug: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('creator_channels')
        .select('id')
        .eq('channel_slug', slug)
        .maybeSingle();
      return !data;
    } catch {
      return false;
    }
  },

  async getPlaylists(channelId: string): Promise<ChannelPlaylist[]> {
    try {
      const { data, error } = await supabase
        .from('channel_playlists')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting playlists:', error);
      return [];
    }
  },

  async createPlaylist(channelId: string, userId: string, input: PlaylistInput & { title: string }): Promise<ChannelPlaylist | null> {
    try {
      const { data, error } = await supabase
        .from('channel_playlists')
        .insert({ channel_id: channelId, user_id: userId, ...input })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      return null;
    }
  },

  async updatePlaylist(playlistId: string, input: PlaylistInput): Promise<ChannelPlaylist | null> {
    try {
      const { data, error } = await supabase
        .from('channel_playlists')
        .update(input)
        .eq('id', playlistId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating playlist:', error);
      return null;
    }
  },

  async deletePlaylist(playlistId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('channel_playlists')
        .delete()
        .eq('id', playlistId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting playlist:', error);
      return false;
    }
  },

  async getCollaborators(channelId: string): Promise<ChannelCollaborator[]> {
    try {
      const { data, error } = await supabase
        .from('channel_collaborators')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting collaborators:', error);
      return [];
    }
  },

  async addCollaborator(channelId: string, invitedBy: string, userId: string, role: CollaboratorRole): Promise<ChannelCollaborator | null> {
    try {
      const { data, error } = await supabase
        .from('channel_collaborators')
        .insert({ channel_id: channelId, invited_by: invitedBy, user_id: userId, role, permissions: {}, accepted: false })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding collaborator:', error);
      return null;
    }
  },

  async updateCollaboratorRole(collaboratorId: string, role: CollaboratorRole): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('channel_collaborators')
        .update({ role })
        .eq('id', collaboratorId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating collaborator role:', error);
      return false;
    }
  },

  async removeCollaborator(collaboratorId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('channel_collaborators')
        .delete()
        .eq('id', collaboratorId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing collaborator:', error);
      return false;
    }
  },

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
  },

  getKycLabel(status: KycStatus): string {
    const labels: Record<KycStatus, string> = {
      not_submitted: 'Non soumis',
      pending: 'En cours de vérification',
      verified: 'Vérifié',
      rejected: 'Refusé',
    };
    return labels[status];
  },

  getKycColor(status: KycStatus): string {
    const colors: Record<KycStatus, string> = {
      not_submitted: 'text-gray-400',
      pending: 'text-amber-400',
      verified: 'text-green-400',
      rejected: 'text-red-400',
    };
    return colors[status];
  },

  getChannelTypeLabel(type: ChannelType): string {
    return CHANNEL_TYPES.find(t => t.value === type)?.label ?? type;
  },

  getRoleLabel(role: CollaboratorRole): string {
    return COLLABORATOR_ROLES.find(r => r.value === role)?.label ?? role;
  },
};
