import { useState } from 'react';
import { X, AlertCircle, Flag } from 'lucide-react';
import { ReportReason, ContentType } from '../types';

interface ReportContentModalProps {
  contentType: ContentType;
  contentId: string;
  contentTitle?: string;
  onSubmit: (reason: ReportReason, description: string) => void;
  onClose: () => void;
}

const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  {
    value: 'spam',
    label: 'Spam',
    description: 'Repetitive, misleading, or promotional content',
  },
  {
    value: 'harassment',
    label: 'Harassment',
    description: 'Bullying, threats, or hateful content',
  },
  {
    value: 'misinformation',
    label: 'Misinformation',
    description: 'False or misleading information',
  },
  {
    value: 'copyright',
    label: 'Copyright',
    description: 'Unauthorized use of copyrighted content',
  },
  {
    value: 'inappropriate',
    label: 'Inappropriate',
    description: 'Sexual, violent, or otherwise inappropriate content',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other violation of community guidelines',
  },
];

export default function ReportContentModal({
  contentType,
  contentId: _contentId,
  contentTitle,
  onSubmit,
  onClose,
}: ReportContentModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    await onSubmit(selectedReason, description);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Report Content</h2>
              {contentTitle && (
                <p className="text-sm text-gray-400 mt-0.5">{contentTitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-white mb-1">Community Moderation</p>
              <p>
                Your report will be reviewed by the community and peer creators. False
                reports may affect your trust score.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Why are you reporting this {contentType}?</h3>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => setSelectedReason(reason.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedReason === reason.value
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="font-medium">{reason.label}</div>
                  <div className="text-sm text-gray-400 mt-1">{reason.description}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedReason && (
            <div>
              <label className="block font-semibold mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide any additional context that might help reviewers..."
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                maxLength={500}
              />
              <div className="text-sm text-gray-400 mt-1 text-right">
                {description.length}/500
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
