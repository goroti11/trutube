import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Settings, Heart, MessageCircle, Gift, DollarSign, Trophy, ShoppingBag, AlertTriangle, Crown } from 'lucide-react';
import { notificationSystemService, type Notification } from '../services/notificationSystemService';
import { useAuth } from '../contexts/AuthContext';

export default function NotificationCenterAdvanced() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unseenCount, setUnseenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'priority'>('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadCounts();
      const result = subscribeToNotifications();
      return () => {
        if (result && typeof (result as any).then === 'function') {
          (result as Promise<() => void>).then(fn => fn());
        } else if (typeof result === 'function') {
          (result as () => void)();
        }
      };
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationSystemService.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCounts = async () => {
    if (!user) return;
    try {
      const [unread, unseen] = await Promise.all([
        notificationSystemService.getUnreadCount(user.id),
        notificationSystemService.getUnseenCount(user.id)
      ]);
      setUnreadCount(unread);
      setUnseenCount(unseen);
    } catch (error) {
      console.error('Failed to load counts:', error);
    }
  };

  const subscribeToNotifications = () => {
    if (!user) return () => {};

    return notificationSystemService.subscribeToNotifications(user.id, (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      setUnseenCount(prev => prev + 1);
    });
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationSystemService.markAsRead([notificationId]);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      await notificationSystemService.markAsRead(unreadIds);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type: string, priority: number) => {
    if (priority >= 4) return <Crown className="w-5 h-5 text-yellow-400" />;

    if (type.includes('video') || type.includes('comment')) return <MessageCircle className="w-5 h-5 text-blue-400" />;
    if (type.includes('like')) return <Heart className="w-5 h-5 text-red-400" />;
    if (type.includes('gift')) return <Gift className="w-5 h-5 text-purple-400" />;
    if (type.includes('trucoin') || type.includes('earnings')) return <DollarSign className="w-5 h-5 text-green-400" />;
    if (type.includes('gaming') || type.includes('duel') || type.includes('victory')) return <Trophy className="w-5 h-5 text-amber-400" />;
    if (type.includes('marketplace')) return <ShoppingBag className="w-5 h-5 text-indigo-400" />;
    if (type.includes('moderation') || type.includes('warning')) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (type.includes('premium')) return <Crown className="w-5 h-5 text-cyan-400" />;

    return <Bell className="w-5 h-5 text-gray-400" />;
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 5) return 'border-red-500/50 bg-red-500/5';
    if (priority >= 4) return 'border-yellow-500/50 bg-yellow-500/5';
    if (priority >= 3) return 'border-blue-500/50 bg-blue-500/5';
    return 'border-gray-700';
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'priority') return n.priority >= 4;
    return true;
  });

  if (!user) return null;

  return (
    <div className="fixed top-20 right-4 w-96 max-h-[600px] bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-cyan-400" />
              {unseenCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unseenCount > 9 ? '9+' : unseenCount}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white">Notifications</h3>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              filter === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              filter === 'unread' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('priority')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              filter === 'priority' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 inline mr-1" />
            Priority
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="w-full mt-3 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      <div className="overflow-y-auto max-h-[450px] custom-scrollbar">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-1">No notifications</p>
            <p className="text-sm">You're all caught up</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer border-l-4 ${
                  !notification.is_read ? 'bg-gray-800/30' : ''
                } ${getPriorityColor(notification.priority)}`}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.notification_type, notification.priority)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-white text-sm leading-tight mb-1">
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-cyan-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 leading-snug mb-2">
                      {notification.body}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                      {notification.priority >= 4 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold">
                          Priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
