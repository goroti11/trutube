import { ThumbsUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { CommunityFeedback } from '../../services/resourceService';

interface FeedbackCardProps {
  feedback: CommunityFeedback;
  onVote?: () => void;
  onClick?: () => void;
}

const statusStyles = {
  submitted: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Soumis' },
  reviewing: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'En révision' },
  planned: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Planifié' },
  in_progress: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'En cours' },
  completed: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Terminé' },
  declined: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Refusé' }
};

const typeLabels = {
  feature_request: 'Demande de fonctionnalité',
  bug_report: 'Bug',
  improvement: 'Amélioration',
  question: 'Question',
  praise: 'Compliment'
};

const priorityIcons = {
  low: null,
  medium: Clock,
  high: AlertTriangle,
  critical: AlertTriangle
};

export default function FeedbackCard({ feedback, onVote, onClick }: FeedbackCardProps) {
  const statusStyle = statusStyles[feedback.status];
  const PriorityIcon = priorityIcons[feedback.priority];

  return (
    <div
      onClick={onClick}
      className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-cyan-600/50 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVote?.();
          }}
          className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
            feedback.hasVoted
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm font-medium">{feedback.votes}</span>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">
              {typeLabels[feedback.type]}
            </span>
            <span className={`px-2 py-0.5 ${statusStyle.bg} rounded text-xs font-medium ${statusStyle.text}`}>
              {statusStyle.label}
            </span>
            {PriorityIcon && feedback.priority !== 'low' && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 rounded text-xs text-orange-400">
                <PriorityIcon className="w-3 h-3" />
                {feedback.priority === 'critical' && 'Critique'}
                {feedback.priority === 'high' && 'Important'}
                {feedback.priority === 'medium' && 'Moyen'}
              </span>
            )}
          </div>

          <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
            {feedback.title}
          </h3>

          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {feedback.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            {feedback.user && (
              <div className="flex items-center gap-2">
                {feedback.user.avatar_url ? (
                  <img
                    src={feedback.user.avatar_url}
                    alt={feedback.user.username}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs">
                    {feedback.user.username[0].toUpperCase()}
                  </div>
                )}
                <span>{feedback.user.username}</span>
              </div>
            )}
            <span>
              {new Date(feedback.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>

          {feedback.admin_response && (
            <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-blue-400">Réponse officielle</span>
              </div>
              <p className="text-sm text-gray-300">{feedback.admin_response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
