import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  category: 'live' | 'gifts' | 'games' | 'wallet' | 'moderation' | 'marketing';
  priority: number;
  title: string;
  body: string;
  data: Record<string, any>;
  action_url: string | null;
  is_read: boolean;
  is_actionable: boolean;
  expires_at: string | null;
  created_at: string;
  read_at: string | null;
}

export interface NotificationPreferences {
  user_id: string;
  // In-App
  live_in_app: boolean;
  gifts_in_app: boolean;
  games_in_app: boolean;
  wallet_in_app: boolean;
  moderation_in_app: boolean;
  marketing_in_app: boolean;
  // Push
  live_push: boolean;
  gifts_push: boolean;
  games_push: boolean;
  wallet_push: boolean;
  moderation_push: boolean;
  marketing_push: boolean;
  // Email
  live_email: boolean;
  gifts_email: boolean;
  games_email: boolean;
  wallet_email: boolean;
  moderation_email: boolean;
  marketing_email: boolean;
  // Device tokens
  fcm_token: string | null;
  apns_token: string | null;
  // Quiet hours
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

export interface UnreadCount {
  total: number;
  by_category: {
    live?: number;
    gifts?: number;
    games?: number;
    wallet?: number;
    moderation?: number;
    marketing?: number;
  };
}

export const notificationService = {
  /**
   * Create a notification with smart filtering
   */
  async createNotification(type: string, data: Record<string, any>, userId?: string) {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;

    if (!targetUserId) {
      throw new Error('User not authenticated');
    }

    const { data: result, error } = await supabase.rpc('rpc_create_notification', {
      p_user_id: targetUserId,
      p_type: type,
      p_data: data,
    });

    if (error) throw error;
    return result;
  },

  /**
   * Get notifications with pagination
   */
  async getNotifications(params: {
    category?: string;
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    const { category, unreadOnly = false, limit = 20, offset = 0 } = params;

    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    // Filter out expired notifications
    query = query.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    const { data, error } = await query;
    if (error) throw error;
    return data as Notification[];
  },

  /**
   * Mark notification as read/unread
   */
  async markAsRead(notificationId: string, isRead: boolean = true) {
    const { data, error } = await supabase.rpc('rpc_mark_notification_read', {
      p_notification_id: notificationId,
      p_is_read: isRead,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(category?: string) {
    const { data, error } = await supabase.rpc('rpc_mark_all_notifications_read', {
      p_category: category || null,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Get unread count
   */
  async getUnreadCount() {
    const { data, error } = await supabase.rpc('rpc_get_unread_notification_count');
    if (error) throw error;
    return data as UnreadCount;
  },

  /**
   * Get notification preferences
   */
  async getPreferences() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as NotificationPreferences | null;
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>) {
    const { data, error } = await supabase.rpc('rpc_update_notification_preferences', {
      p_preferences: preferences,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Register device token for push notifications
   */
  async registerDeviceToken(token: string, platform: 'android' | 'ios') {
    const field = platform === 'android' ? 'fcm_token' : 'apns_token';

    return this.updatePreferences({
      [field]: token,
    } as any);
  },

  /**
   * Track user behavior for smart filtering
   */
  async trackBehavior(
    creatorId: string,
    actionType: 'watch' | 'gift' | 'game' | 'favorite',
    actionData: Record<string, any> = {}
  ) {
    const { data, error } = await supabase.rpc('rpc_track_user_behavior', {
      p_creator_id: creatorId,
      p_action_type: actionType,
      p_action_data: actionData,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Delete old read notifications
   */
  async deleteOldNotifications(daysOld: number = 30) {
    const { data, error } = await supabase.rpc('rpc_delete_old_notifications', {
      p_days_old: daysOld,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Subscribe to real-time notifications
   */
  subscribeToNotifications(
    callback: (notification: Notification) => void,
    onError?: (error: any) => void
  ) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${supabase.auth.getUser().then(r => r.data.user?.id)}`,
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe((status, error) => {
        if (error && onError) {
          onError(error);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Helper functions for specific notification types

  /**
   * Notify live stream started
   */
  async notifyLiveStarted(creatorId: string, streamId: string, streamTitle: string, creatorName: string) {
    // Get all users who should be notified
    const { data: followers } = await supabase
      .from('user_notification_behavior')
      .select('user_id, engagement_score')
      .eq('creator_id', creatorId)
      .gte('engagement_score', 20); // Only notify engaged users

    if (!followers) return;

    const notifications = followers.map(follower =>
      this.createNotification(
        'live_started',
        {
          creator_id: creatorId,
          creator_name: creatorName,
          stream_id: streamId,
          stream_title: streamTitle,
        },
        follower.user_id
      )
    );

    await Promise.allSettled(notifications);
  },

  /**
   * Notify game launched
   */
  async notifyGameLaunched(streamId: string, gameType: string, creatorName: string) {
    // Get active stream viewers
    const { data: viewers } = await supabase
      .from('live_stream_viewers')
      .select('user_id')
      .eq('stream_id', streamId)
      .eq('is_active', true);

    if (!viewers) return;

    const notifications = viewers.map(viewer =>
      this.createNotification(
        'live_game_launched',
        {
          stream_id: streamId,
          game_type: gameType,
          creator_name: creatorName,
        },
        viewer.user_id
      )
    );

    await Promise.allSettled(notifications);
  },

  /**
   * Notify gift received
   */
  async notifyGiftReceived(recipientId: string, senderName: string, giftName: string, giftIcon: string) {
    return this.createNotification(
      'gift_received',
      {
        sender_name: senderName,
        gift_name: giftName,
        gift_icon: giftIcon,
      },
      recipientId
    );
  },

  /**
   * Notify badge unlocked
   */
  async notifyBadgeUnlocked(userId: string, badgeName: string, badgeIcon: string) {
    return this.createNotification(
      'gift_badge_unlocked',
      {
        badge_name: badgeName,
        badge_icon: badgeIcon,
        user_id: userId,
      },
      userId
    );
  },

  /**
   * Notify lottery win
   */
  async notifyLotteryWin(userId: string, prize: string, streamId: string) {
    return this.createNotification(
      'game_lottery_won',
      {
        prize: prize,
        stream_id: streamId,
      },
      userId
    );
  },

  /**
   * Notify wallet credited
   */
  async notifyWalletCredited(userId: string, amount: number) {
    return this.createNotification(
      'wallet_credited',
      {
        amount: amount.toString(),
      },
      userId
    );
  },

  /**
   * Notify suspicious activity
   */
  async notifySuspiciousActivity(userId: string, details: string) {
    return this.createNotification(
      'wallet_suspicious_activity',
      {
        details: details,
      },
      userId
    );
  },

  /**
   * Notify moderation warning
   */
  async notifyModerationWarning(userId: string, reason: string) {
    return this.createNotification(
      'moderation_warning',
      {
        reason: reason,
      },
      userId
    );
  },
};
