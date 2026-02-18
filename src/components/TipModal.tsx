import { useState } from 'react';
import { X, DollarSign, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';

interface TipModalProps {
  creator: User;
  videoId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TipModal({ creator, videoId, onClose, onSuccess }: TipModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(5);
  const [message, setMessage] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const presetAmounts = [1, 5, 10, 20, 50, 100];

  const handleSend = async () => {
    if (!user) {
      setError('You must be logged in to send tips');
      return;
    }

    const finalAmount = customAmount ? parseFloat(customAmount) : amount;

    if (finalAmount <= 0 || isNaN(finalAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (finalAmount < 1) {
      setError('Minimum tip amount is $1');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tip = await paymentService.sendTip(
        user.id,
        creator.id,
        finalAmount,
        message,
        videoId,
        isAnonymous,
        isPublic
      );

      if (tip) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setError('Failed to send tip. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Tip error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-800 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tip Sent!</h2>
          <p className="text-gray-400">Your support means the world to {creator.displayName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-white">Send a Tip</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors text-white disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <img
              src={creator.avatarUrl}
              alt={creator.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-white">{creator.displayName}</p>
              <p className="text-sm text-gray-400">@{creator.username || 'creator'}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-3">Select Amount</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount('');
                  }}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    amount === preset && !customAmount
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom amount"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Add a message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Thank you for your amazing content!"
              rows={3}
              disabled={loading}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none disabled:opacity-50"
            />
          </div>

          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50"
              />
              <span className="text-sm text-gray-300">Send anonymously</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50"
              />
              <span className="text-sm text-gray-300">Show publicly</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg font-medium transition-all shadow-lg disabled:opacity-50 text-white"
            >
              {loading ? 'Sending...' : `Send $${customAmount || amount}`}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            85% goes to the creator, 15% processing fee
          </p>
        </div>
      </div>
    </div>
  );
}
