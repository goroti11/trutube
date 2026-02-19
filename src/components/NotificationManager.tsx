import { useState, useEffect } from 'react';
import { Bell, BellOff, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NOTIF_STORAGE_KEY = 'trutube_notif_prompt_dismissed';
const NOTIF_DELAY_MS = 8000;

type NotifStatus = 'default' | 'granted' | 'denied';

function getPermissionStatus(): NotifStatus {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission as NotifStatus;
}

export function sendNotification(title: string, body: string, icon?: string) {
  if (getPermissionStatus() !== 'granted') return;
  const notif = new Notification(title, {
    body,
    icon: icon ?? '/tru.jpeg',
    badge: '/tru.jpeg',
    tag: 'trutube',
  });
  notif.onclick = () => {
    window.focus();
    notif.close();
  };
}

export default function NotificationManager() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<NotifStatus>('default');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!('Notification' in window)) return;

    const currentStatus = getPermissionStatus();
    setStatus(currentStatus);

    if (currentStatus !== 'default') return;

    const dismissed = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), NOTIF_DELAY_MS);
    return () => clearTimeout(timer);
  }, [user]);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    setRequesting(true);
    try {
      const result = await Notification.requestPermission();
      setStatus(result as NotifStatus);
      if (result === 'granted') {
        setTimeout(() => {
          sendNotification(
            'Notifications activées !',
            'Vous recevrez des alertes pour les nouvelles vidéos, lives et messages.',
          );
        }, 500);
      }
    } catch {
    }
    setRequesting(false);
    setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem(NOTIF_STORAGE_KEY, 'true');
    setShow(false);
  };

  if (!show || status !== 'default') return null;

  return (
    <div className="fixed bottom-6 right-4 z-[9998] max-w-sm w-full sm:w-80 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white mb-0.5">Activer les notifications</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Soyez alerté en temps réel des nouvelles vidéos, lives et messages de vos créateurs favoris.
              </p>
            </div>
            <button onClick={dismiss} className="p-1 hover:bg-gray-800 rounded-lg text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={dismiss}
            className="flex-1 py-2 text-xs font-medium text-gray-500 hover:text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
          >
            Plus tard
          </button>
          <button
            onClick={requestPermission}
            disabled={requesting}
            className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:bg-gray-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            {requesting ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Bell className="w-3.5 h-3.5" /> Activer</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function NotificationStatusBadge() {
  const status = getPermissionStatus();

  if (status === 'granted') {
    return (
      <span className="flex items-center gap-1 text-xs text-green-400">
        <CheckCircle className="w-3.5 h-3.5" /> Activées
      </span>
    );
  }
  if (status === 'denied') {
    return (
      <span className="flex items-center gap-1 text-xs text-gray-500">
        <BellOff className="w-3.5 h-3.5" /> Bloquées par le navigateur
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-gray-400">
      <Bell className="w-3.5 h-3.5" /> Non configurées
    </span>
  );
}
