import { useState } from 'react';
import { Shield, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { ContentReport, ModerationVote as VoteType } from '../types';

interface ModerationVotePanelProps {
  report: ContentReport;
  userTrustScore: number;
  onVote: (vote: VoteType, comment: string) => void;
}

export default function ModerationVotePanel({
  report,
  userTrustScore,
  onVote,
}: ModerationVotePanelProps) {
  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canVote = userTrustScore >= 0.6;

  const handleSubmit = async () => {
    if (!selectedVote || !canVote) return;

    setIsSubmitting(true);
    await onVote(selectedVote, comment);
    setIsSubmitting(false);
  };

  const voteOptions: { value: VoteType; label: string; icon: any; color: string }[] = [
    {
      value: 'remove',
      label: 'Remove Content',
      icon: ThumbsDown,
      color: 'red',
    },
    {
      value: 'warn',
      label: 'Issue Warning',
      icon: AlertTriangle,
      color: 'yellow',
    },
    {
      value: 'keep',
      label: 'Keep Content',
      icon: ThumbsUp,
      color: 'green',
    },
  ];

  if (!canVote) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-6 h-6 text-gray-500" />
          <h3 className="text-lg font-semibold">Peer Moderation</h3>
        </div>
        <p className="text-gray-400">
          Your trust score is too low to vote on moderation decisions. Build your
          reputation by creating quality content and accurate reports.
        </p>
        <div className="mt-4 bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Your Trust Score</span>
            <span className="text-sm font-medium">{(userTrustScore * 100).toFixed(0)}%</span>
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-500 transition-all"
              style={{ width: `${userTrustScore * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Minimum 60% required to vote</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-primary-500" />
        <div>
          <h3 className="text-lg font-semibold">Peer Moderation Vote</h3>
          <p className="text-sm text-gray-400">
            Help the community decide on this report
          </p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Report Reason</span>
          <span className="text-xs px-2 py-1 bg-red-500/20 text-red-500 rounded-full">
            {report.reason}
          </span>
        </div>
        {report.description && (
          <p className="text-sm text-gray-400 mt-2">{report.description}</p>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <p className="text-sm font-medium">Your Decision</p>
        {voteOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedVote === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setSelectedVote(option.value)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `border-${option.color}-500 bg-${option.color}-500/10`
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSelected ? `bg-${option.color}-500/20` : 'bg-gray-800'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isSelected ? `text-${option.color}-500` : 'text-gray-400'
                  }`}
                />
              </div>
              <span className="font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      {selectedVote && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Explanation (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Explain your decision to help other moderators..."
            className="w-full h-24 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            maxLength={300}
          />
          <div className="text-xs text-gray-400 mt-1 text-right">
            {comment.length}/300
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedVote || isSubmitting}
        className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
      >
        {isSubmitting ? 'Submitting Vote...' : 'Submit Vote'}
      </button>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <Shield className="w-4 h-4" />
        <span>
          Your vote weight: {(userTrustScore * 100).toFixed(0)}% (based on trust score)
        </span>
      </div>
    </div>
  );
}
