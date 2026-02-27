import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  actor_id?: string;
  entity_type: string;
  entity_id?: string;
  notification_type: string;
  title: string;
  body: string;
  data: Record<string, any>;
  channel: 'in_app' | 'push' | 'email';
  priority: number;
  is_read: boolean;
  is_seen: boolean;
  is_grouped: boolean;
  group_id?: string;
  created_at: string;
  expires_at: string;
  actor?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface NotificationPreferences {
  user_id: string;
  video_enabled: boolean;
  video_likes_enabled: boolean;
  video_comments_enabled: boolean;
  flow_enabled: boolean;
  live_enabled: boolean;
  gift_enabled: boolean;
  wallet_enabled: boolean;
  gaming_enabled: boolean;
  marketplace_enabled: boolean;
  studio_enabled: boolean;
  premium_enabled: boolean;
  moderation_enabled: boolean;
  system_enabled: boolean;
  marketing_enabled: boolean;
  in_app_enabled: boolean;
  push_enabled: boolean;
  email_enabled: boolean;
  email_digest_frequency: 'never' | 'daily' | 'weekly' | 'monthly';
  smart_notifications_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

export interface NotificationRule {
  notification_type: string;
  entity_type: string;
  priority: number;
  cooldown_seconds: number;
  groupable: boolean;
  group_window_seconds: number;
  max_per_hour: number;
  title_template: string;
  body_template: string;
}

class NotificationSystemService {
  async getNotifications(userId: string, limit = 50, offset = 0): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:actor_id (
          id,
          username,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data as Notification[];
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }

  async getUnseenCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_seen', false);

    if (error) throw error;
    return count || 0;
  }

  async markAsRead(notificationIds: string[]): Promise<void> {
    const { error } = await supabase.rpc('mark_notifications_read', {
      p_notification_ids: notificationIds
    });

    if (error) throw error;
  }

  async markAllAsSeen(): Promise<void> {
    const { error } = await supabase.rpc('mark_all_notifications_seen');
    if (error) throw error;
  }

  async getPreferences(userId: string): Promise<NotificationPreferences | null> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async updatePreferences(userId: string, preferences: Partial<NotificationPreferences>) {
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        ...preferences
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async sendNotification(params: {
    userId: string;
    actorId?: string;
    entityType: string;
    entityId?: string;
    notificationType: string;
    data?: Record<string, any>;
    channel?: 'in_app' | 'push' | 'email';
  }) {
    const { userId, actorId, entityType, entityId, notificationType, data = {}, channel = 'in_app' } = params;

    const shouldSend = await this.shouldSendNotification(userId, notificationType, entityType);
    if (!shouldSend) {
      return null;
    }

    const rule = await this.getNotificationRule(notificationType);
    if (!rule) {
      throw new Error(`Notification rule not found for type: ${notificationType}`);
    }

    if (rule.groupable) {
      return this.addToGroup(params, rule);
    }

    const title = this.interpolateTemplate(rule.title_template, data);
    const body = this.interpolateTemplate(rule.body_template, data);

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: userId,
        actor_id: actorId,
        entity_type: entityType,
        entity_id: entityId,
        notification_type: notificationType,
        title,
        body,
        data,
        channel,
        priority: rule.priority
      }])
      .select()
      .single();

    if (error) throw error;
    return notification;
  }

  private async shouldSendNotification(userId: string, notificationType: string, entityType: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('should_send_notification', {
      p_user_id: userId,
      p_notification_type: notificationType,
      p_entity_type: entityType
    });

    if (error) return true;
    return data;
  }

  private async getNotificationRule(notificationType: string): Promise<NotificationRule | null> {
    const { data, error } = await supabase
      .from('notification_rules')
      .select('*')
      .eq('notification_type', notificationType)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  private async addToGroup(params: {
    userId: string;
    actorId?: string;
    entityType: string;
    entityId?: string;
    notificationType: string;
    data?: Record<string, any>;
  }, rule: NotificationRule) {
    const { userId, actorId, entityType, entityId, notificationType } = params;

    const windowStart = new Date(Date.now() - rule.group_window_seconds * 1000).toISOString();

    const { data: existingGroup, error: groupError } = await supabase
      .from('notification_groups')
      .select('*')
      .eq('user_id', userId)
      .eq('notification_type', notificationType)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId || '')
      .gte('last_updated_at', windowStart)
      .eq('is_sent', false)
      .maybeSingle();

    if (groupError && groupError.code !== 'PGRST116') throw groupError;

    if (existingGroup) {
      const actorIds = existingGroup.actor_ids || [];
      if (actorId && !actorIds.includes(actorId)) {
        actorIds.push(actorId);
      }

      const { error: updateError } = await supabase
        .from('notification_groups')
        .update({
          count: existingGroup.count + 1,
          actor_ids: actorIds,
          last_actor_id: actorId,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', existingGroup.id);

      if (updateError) throw updateError;
      return existingGroup;
    } else {
      const { data: newGroup, error: insertError } = await supabase
        .from('notification_groups')
        .insert([{
          user_id: userId,
          notification_type: notificationType,
          entity_type: entityType,
          entity_id: entityId,
          count: 1,
          actor_ids: actorId ? [actorId] : [],
          last_actor_id: actorId
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      return newGroup;
    }
  }

  private interpolateTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  async subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
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
      supabase.removeChannel(channel);
    };
  }

  async getNotificationStats(userId: string) {
    const { data, error } = await supabase
      .from('notification_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async sendVideoUploadNotification(videoId: string, creatorId: string, videoTitle: string) {
    const { data: subscribers } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('channel_id', creatorId);

    if (!subscribers) return;

    for (const sub of subscribers) {
      await this.sendNotification({
        userId: sub.user_id,
        actorId: creatorId,
        entityType: 'video',
        entityId: videoId,
        notificationType: 'video_uploaded',
        data: { title: videoTitle }
      });
    }
  }

  async sendLiveStartNotification(liveId: string, creatorId: string, liveTitle: string) {
    const { data: subscribers } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('channel_id', creatorId);

    if (!subscribers) return;

    for (const sub of subscribers) {
      await this.sendNotification({
        userId: sub.user_id,
        actorId: creatorId,
        entityType: 'live',
        entityId: liveId,
        notificationType: 'live_started',
        data: { title: liveTitle },
        channel: 'push'
      });
    }
  }

  async sendGiftReceivedNotification(recipientId: string, senderId: string, giftName: string, amount: number) {
    await this.sendNotification({
      userId: recipientId,
      actorId: senderId,
      entityType: 'gift',
      notificationType: 'gift_received',
      data: {
        gift: giftName,
        amount: amount,
        count: 1
      }
    });
  }

  async sendCommentNotification(videoOwnerId: string, commenterId: string, videoId: string, videoTitle: string, commentText: string) {
    await this.sendNotification({
      userId: videoOwnerId,
      actorId: commenterId,
      entityType: 'video',
      entityId: videoId,
      notificationType: 'video_comment',
      data: {
        title: videoTitle,
        body: commentText,
        count: 1
      }
    });
  }

  async sendMilestoneNotification(userId: string, milestone: string, value: number) {
    await this.sendNotification({
      userId,
      entityType: 'studio',
      notificationType: 'studio_milestone',
      data: {
        milestone: `${value} ${milestone}`
      },
      channel: 'push'
    });
  }
}

export const notificationSystemService = new NotificationSystemService();
