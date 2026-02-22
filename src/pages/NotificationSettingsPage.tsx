import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Moon, Save } from 'lucide-react';
import { notificationService, NotificationPreferences } from '../services/notificationService';

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const prefs = await notificationService.getPreferences();
      if (prefs) {
        setPreferences(prefs);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      await notificationService.updatePreferences(preferences);
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
  };

  const categories = [
    {
      key: 'live',
      label: 'Live Streams',
      description: 'Stream starts, scheduled reminders, games launched',
      icon: '🔴',
    },
    {
      key: 'gifts',
      label: 'Gifts & Badges',
      description: 'Gift received, tier upgrades, badge unlocks',
      icon: '🎁',
    },
    {
      key: 'games',
      label: 'Games',
      description: 'Game starts, wins, leaderboard updates',
      icon: '🎮',
    },
    {
      key: 'wallet',
      label: 'Wallet & Payments',
      description: 'Credits, payments, low balance, security alerts',
      icon: '💰',
    },
    {
      key: 'moderation',
      label: 'Moderation & Legal',
      description: 'Warnings, terms updates, report status',
      icon: '⚖️',
    },
    {
      key: 'marketing',
      label: 'Updates & Promotions',
      description: 'New features, special offers',
      icon: '📢',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Failed to load preferences</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bell className="w-8 h-8" />
            Notification Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customize how and when you receive notifications
          </p>
        </div>

        <div className="space-y-6">
          {/* Notification Channels */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Notification Channels
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex flex-col items-center gap-1">
                        <Bell className="w-4 h-4" />
                        <span>In-App</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex flex-col items-center gap-1">
                        <Smartphone className="w-4 h-4" />
                        <span>Push</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex flex-col items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.key} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <span>{category.icon}</span>
                            {category.label}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {category.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={preferences[`${category.key}_in_app` as keyof NotificationPreferences] as boolean}
                          onChange={(e) =>
                            updatePreference(`${category.key}_in_app` as keyof NotificationPreferences, e.target.checked)
                          }
                          className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={preferences[`${category.key}_push` as keyof NotificationPreferences] as boolean}
                          onChange={(e) =>
                            updatePreference(`${category.key}_push` as keyof NotificationPreferences, e.target.checked)
                          }
                          className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={preferences[`${category.key}_email` as keyof NotificationPreferences] as boolean}
                          onChange={(e) =>
                            updatePreference(`${category.key}_email` as keyof NotificationPreferences, e.target.checked)
                          }
                          className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quiet Hours
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Mute non-urgent notifications during specific hours. Security alerts will always come through.
            </p>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.quiet_hours_enabled}
                  onChange={(e) => updatePreference('quiet_hours_enabled', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-900 dark:text-white font-medium">
                  Enable Quiet Hours
                </span>
              </label>

              {preferences.quiet_hours_enabled && (
                <div className="grid grid-cols-2 gap-4 pl-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={preferences.quiet_hours_start}
                      onChange={(e) => updatePreference('quiet_hours_start', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={preferences.quiet_hours_end}
                      onChange={(e) => updatePreference('quiet_hours_end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
