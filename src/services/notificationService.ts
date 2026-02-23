import { supabase } from '../lib/supabase';
import type { Notification, NotificationPreference } from '../types/database';

export const notificationService = {
  async getNotifications(limit = 50, offset = 0): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  async getUnreadCount(): Promise<number> {
    const { data, error } = await supabase.rpc('rpc_get_unread_notification_count');

    if (error) throw error;
    return data || 0;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase.rpc('rpc_mark_notification_read', {
      p_notification_id: notificationId,
    });

    if (error) throw error;
  },

  async markAllAsRead(): Promise<void> {
    const { error } = await supabase.rpc('rpc_mark_all_notifications_read');

    if (error) throw error;
  },

  async getPreferences(): Promise<NotificationPreference[]> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  async updatePreference(domain: string, enabled: boolean, pushEnabled?: boolean, emailEnabled?: boolean): Promise<void> {
    const { error } = await supabase.rpc('rpc_update_notification_preferences', {
      p_domain: domain,
      p_enabled: enabled,
      p_push_enabled: pushEnabled ?? null,
      p_email_enabled: emailEnabled ?? null,
    });

    if (error) throw error;
  },

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();
  },
};
