import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  actor_id?: string;
  entity_type: 'video' | 'live' | 'flow' | 'gift' | 'wallet' | 'game' | 'marketplace' | 'moderation' | 'studio' | 'premium' | 'system' | 'community' | 'channel';
  entity_id?: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, any>;
  channel: 'in_app' | 'push' | 'email';
  priority: 1 | 2 | 3 | 4 | 5;
  is_read: boolean;
  is_seen: boolean;
  grouped_with?: string;
  created_at: string;
  read_at?: string;
  actor?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface NotificationPreferences {
  user_id: string;
  live_enabled: boolean;
  gift_enabled: boolean;
  video_enabled: boolean;
  flow_enabled: boolean;
  studio_enabled: boolean;
  wallet_enabled: boolean;
  marketplace_enabled: boolean;
  moderation_enabled: boolean;
  marketing_enabled: boolean;
  community_enabled: boolean;
  game_enabled: boolean;
  premium_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  smart_enabled: boolean;
  digest_enabled: boolean;
  digest_frequency: 'hourly' | 'daily' | 'weekly';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

export interface NotificationRule {
  type: string;
  entity_type: string;
  min_priority: number;
  cooldown_seconds: number;
  groupable: boolean;
  group_window_seconds: number;
  max_group_size: number;
  description?: string;
}

export interface CreateNotificationParams {
  user_id: string;
  actor_id?: string;
  entity_type: string;
  entity_id?: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  channel?: 'in_app' | 'push' | 'email';
  priority?: 1 | 2 | 3 | 4 | 5;
}

class UnifiedNotificationService {
  async createNotification(params: CreateNotificationParams): Promise<{
    success: boolean;
    notification_id?: string;
    grouped?: boolean;
    group_count?: number;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.rpc('create_smart_notification', {
        p_user_id: params.user_id,
        p_actor_id: params.actor_id || null,
        p_entity_type: params.entity_type,
        p_entity_id: params.entity_id || null,
        p_type: params.type,
        p_title: params.title,
        p_body: params.body,
        p_data: params.data || {},
        p_channel: params.channel || 'in_app',
        p_priority: params.priority || 2
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating notification:', error);
      return { success: false, error: error.message };
    }
  }

  async getNotifications(options: {
    limit?: number;
    offset?: number;
    unread_only?: boolean;
    priority?: number;
    entity_type?: string;
  } = {}): Promise<Notification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select(`
          *,
          actor:actor_id (
            id,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (options.unread_only) {
        query = query.eq('is_read', false);
      }

      if (options.priority) {
        query = query.gte('priority', options.priority);
      }

      if (options.entity_type) {
        query = query.eq('entity_type', options.entity_type);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Notification[];
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationIds: string[]): Promise<{ success: boolean; updated_count: number }> {
    try {
      const { data, error } = await supabase.rpc('mark_notifications_read', {
        p_notification_ids: notificationIds
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error marking notifications as read:', error);
      return { success: false, updated_count: 0 };
    }
  }

  async markAsSeen(notificationIds: string[]): Promise<{ success: boolean; updated_count: number }> {
    try {
      const { data, error } = await supabase.rpc('mark_notifications_seen', {
        p_notification_ids: notificationIds
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error marking notifications as seen:', error);
      return { success: false, updated_count: 0 };
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_unread_notification_count');

      if (error) throw error;
      return data || 0;
    } catch (error: any) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  async getUnseenCount(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_unseen_notification_count');

      if (error) throw error;
      return data || 0;
    } catch (error: any) {
      console.error('Error getting unseen count:', error);
      return 0;
    }
  }

  async getPreferences(): Promise<NotificationPreferences | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('notification_preferences')
        .update(preferences)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  }

  async getRules(): Promise<NotificationRule[]> {
    try {
      const { data, error } = await supabase
        .from('notification_rules')
        .select('*')
        .order('type');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching notification rules:', error);
      return [];
    }
  }

  async deleteOldNotifications(): Promise<{ success: boolean; deleted_count: number }> {
    try {
      const { data, error } = await supabase.rpc('delete_old_user_notifications');

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error deleting old notifications:', error);
      return { success: false, deleted_count: 0 };
    }
  }

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  getNotificationIcon(type: string): string {
    const iconMap: Record<string, string> = {
      'video:like': '👍',
      'video:comment': '💬',
      'video:reply': '↩️',
      'video:published': '🎬',
      'video:milestone': '🎯',
      'live:started': '🔴',
      'live:scheduled': '📅',
      'live:gift_received': '🎁',
      'live:milestone': '🏆',
      'live:top_supporter': '👑',
      'flow:started': '▶️',
      'flow:completed': '✅',
      'flow:new': '🆕',
      'flow:recommendation': '✨',
      'gift:received': '🎁',
      'gift:badge_unlocked': '🏅',
      'gift:status_reached': '⭐',
      'gift:leaderboard': '📊',
      'wallet:purchase': '💰',
      'wallet:received': '💵',
      'wallet:sent': '💸',
      'wallet:low_balance': '⚠️',
      'wallet:earnings': '💎',
      'game:duel_started': '⚔️',
      'game:victory': '🏆',
      'game:leaderboard': '📈',
      'game:reward': '🎖️',
      'marketplace:order': '📦',
      'marketplace:payment': '💳',
      'marketplace:delivery': '🚚',
      'marketplace:dispute': '⚖️',
      'marketplace:review': '⭐',
      'moderation:warning': '⚠️',
      'moderation:suspension': '🚫',
      'moderation:report_resolved': '✅',
      'moderation:appeal': '📋',
      'studio:milestone': '🎯',
      'studio:monetization': '💰',
      'studio:analytics': '📊',
      'studio:verification': '✓',
      'premium:activated': '👑',
      'premium:expiring': '⏰',
      'premium:expired': '❌',
      'premium:content': '🌟',
      'community:post': '📝',
      'community:mention': '@',
      'community:role': '🎭',
      'system:announcement': '📢',
      'system:maintenance': '🔧',
      'system:security': '🔒'
    };

    return iconMap[type] || '📬';
  }

  getPriorityColor(priority: number): string {
    const colors: Record<number, string> = {
      1: 'bg-gray-500',
      2: 'bg-blue-500',
      3: 'bg-yellow-500',
      4: 'bg-orange-500',
      5: 'bg-red-500'
    };

    return colors[priority] || 'bg-gray-500';
  }
}

export const unifiedNotificationService = new UnifiedNotificationService();
export default unifiedNotificationService;
