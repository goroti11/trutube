import { useState, useEffect } from 'react';
import { Bell, Settings, Trash2, Filter } from 'lucide-react';
import { notificationService, Notification } from '../services/notificationService';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const categories = [
    { value: 'live', label: 'Live', color: 'red', icon: '🔴' },
    { value: 'gifts', label: 'Gifts', color: 'pink', icon: '🎁' },
    { value: 'games', label: 'Games', color: 'purple', icon: '🎮' },
    { value: 'wallet', label: 'Wallet', color: 'green', icon: '💰' },
    { value: 'moderation', label: 'Moderation', color: 'yellow', icon: '⚖️' },
    { value: 'marketing', label: 'Updates', color: 'blue', icon: '📢' },
  ];

  useEffect(() => {
    loadNotifications();
  }, [selectedCategory, showUnreadOnly]);

  const loadNotifications = async (append = false) => {
    setLoading(true);
    try {
      const offset = append ? page * 20 : 0;
      const data = await notificationService.getNotifications({
        category: selectedCategory || undefined,
        unreadOnly: showUnreadOnly,
        limit: 20,
        offset,
      });

      if (append) {
        setNotifications(prev => [...prev, ...data]);
      } else {
        setNotifications(data);
      }

      setHasMore(data.length === 20);
      if (!append) setPage(0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    loadNotifications(true);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(selectedCategory || undefined);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDeleteOld = async () => {
    if (!confirm('Delete all read notifications older than 30 days?')) return;

    try {
      await notificationService.deleteOldNotifications(30);
      loadNotifications();
    } catch (error) {
      console.error('Failed to delete old notifications:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? `text-${cat.color}-500` : 'text-gray-500';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 5) return { label: 'Urgent', color: 'bg-red-500' };
    if (priority === 4) return { label: 'High', color: 'bg-orange-500' };
    if (priority === 3) return { label: 'Normal', color: 'bg-blue-500' };
    if (priority === 2) return { label: 'Low', color: 'bg-gray-500' };
    return { label: 'Info', color: 'bg-gray-400' };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Bell className="w-8 h-8" />
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Stay updated with everything happening on GOROTI
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteOld}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clean Up
            </button>
            <a
              href="/notifications/settings"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by category:
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show unread only
              </span>
            </label>

            {!showUnreadOnly && notifications.some(n => !n.is_read) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading && notifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm mt-2">
                {showUnreadOnly
                  ? "You're all caught up!"
                  : 'Notifications will appear here'}
              </p>
            </div>
          ) : (
            <>
              {notifications.map(notification => {
                const priority = getPriorityLabel(notification.priority);

                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.is_read) {
                        handleMarkAsRead(notification.id);
                      }
                      if (notification.action_url) {
                        window.location.href = notification.action_url;
                      }
                    }}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-all cursor-pointer ${
                      !notification.is_read ? 'border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 ${getCategoryColor(notification.category)}`}>
                        <Bell className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {notification.title}
                              </h3>
                              {notification.priority >= 4 && (
                                <span className={`text-xs ${priority.color} text-white px-2 py-0.5 rounded`}>
                                  {priority.label}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {notification.body}
                            </p>
                          </div>

                          {!notification.is_read && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                          <span>{new Date(notification.created_at).toLocaleString()}</span>
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                            {notification.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all text-blue-500 font-medium disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
