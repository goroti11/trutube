import { useState, useEffect, useRef } from 'react';
import { Bell, X, Settings, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { unifiedNotificationService, Notification } from '../services/unifiedNotificationService';
import { formatDistanceToNow } from '../utils/dateUtils';

interface NotificationCenterProps {
  onNavigate?: (page: string, data?: any) => void;
}

export default function NotificationCenter({ onNavigate }: NotificationCenterProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();

      const unsubscribe = unifiedNotificationService.subscribeToNotifications(
        user.id,
        (newNotification) => {
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      );

      return () => unsubscribe();
    }
  }, [user, filter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await unifiedNotificationService.getNotifications({
      limit: 20,
      unread_only: filter === 'unread'
    });
    setNotifications(data);
    setLoading(false);
  };

  const loadUnreadCount = async () => {
    const count = await unifiedNotificationService.getUnreadCount();
    setUnreadCount(count);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await unifiedNotificationService.markAsRead([notificationId]);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length > 0) {
      await unifiedNotificationService.markAsRead(unreadIds);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const handleDelete = async (notificationId: string) => {
    await unifiedNotificationService.deleteNotification(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }

    if (notification.entity_type === 'video' && notification.entity_id) {
      onNavigate?.('watch', { videoId: notification.entity_id });
    } else if (notification.entity_type === 'live' && notification.entity_id) {
      onNavigate?.('live-streaming', { liveId: notification.entity_id });
    } else if (notification.entity_type === 'community' && notification.entity_id) {
      onNavigate?.('community-view', { communityId: notification.entity_id });
    } else if (notification.entity_type === 'wallet') {
      onNavigate?.('trucoin-wallet');
    } else if (notification.entity_type === 'studio') {
      onNavigate?.('creator-dashboard');
    }

    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    return unifiedNotificationService.getNotificationIcon(type);
  };

  const getPriorityColor = (priority: number) => {
    const colors: Record<number, string> = {
      1: 'border-gray-500',
      2: 'border-blue-500',
      3: 'border-yellow-500',
      4: 'border-orange-500',
      5: 'border-red-500'
    };
    return colors[priority] || 'border-gray-500';
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50 max-h-[600px] flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate?.('notification-settings')}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Paramètres"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    filter === 'all'
                      ? 'bg-red-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    filter === 'unread'
                      ? 'bg-red-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Non lues
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="ml-auto text-sm text-red-500 hover:text-red-400 transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="w-12 h-12 text-gray-600 mb-3" />
                <p className="text-gray-400 text-center">
                  {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer group ${
                      !notification.is_read ? 'bg-gray-800/30' : ''
                    } border-l-2 ${getPriorityColor(notification.priority)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-xl">
                        {notification.actor?.avatar_url ? (
                          <img
                            src={notification.actor.avatar_url}
                            alt={notification.actor.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getNotificationIcon(notification.type)
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm mb-1 ${!notification.is_read ? 'font-semibold text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.created_at))}
                        </p>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
