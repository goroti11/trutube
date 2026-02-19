import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { CommunityAnnouncement } from '../../services/resourceService';

interface AnnouncementBannerProps {
  announcement: CommunityAnnouncement;
  onDismiss?: () => void;
}

const severityStyles = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: Info
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: AlertTriangle
  },
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: AlertCircle
  }
};

const typeLabels = {
  feature: 'Nouvelle fonctionnalité',
  maintenance: 'Maintenance',
  incident: 'Incident',
  update: 'Mise à jour',
  general: 'Annonce'
};

export default function AnnouncementBanner({ announcement, onDismiss }: AnnouncementBannerProps) {
  const style = severityStyles[announcement.severity];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-5`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 bg-gray-900/50 rounded-lg shrink-0`}>
          <Icon className={`w-5 h-5 ${style.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 ${style.bg} border ${style.border} rounded text-xs font-medium ${style.text}`}>
              {typeLabels[announcement.type]}
            </span>
            {announcement.is_pinned && (
              <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs font-medium text-cyan-400">
                Épinglé
              </span>
            )}
          </div>
          <h3 className="font-semibold text-white mb-2">{announcement.title}</h3>
          <div className="text-gray-300 text-sm whitespace-pre-line">
            {announcement.content}
          </div>
          {announcement.published_at && (
            <div className="text-xs text-gray-500 mt-3">
              {new Date(announcement.published_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-500 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
