import { X, Copy, Facebook, Twitter, MessageCircle, Mail, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { profileEnhancedService } from '../../services/profileEnhancedService';

interface ShareProfileModalProps {
  profileId: string;
  channelUrl: string;
  displayName: string;
  onClose: () => void;
}

export default function ShareProfileModal({
  profileId,
  channelUrl,
  displayName,
  onClose
}: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${window.location.origin}/channel/${channelUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      await profileEnhancedService.trackProfileShare(profileId, null, 'link');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleShare = async (method: 'facebook' | 'twitter' | 'whatsapp' | 'email') => {
    await profileEnhancedService.trackProfileShare(profileId, null, method);

    const text = `Découvrez la chaîne de ${displayName} sur GOROTI`;
    const encodedUrl = encodeURIComponent(profileUrl);
    const encodedText = encodeURIComponent(text);

    let shareUrl = '';
    switch (method) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedText}&body=${encodedText} ${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Partager la chaîne</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-2">Lien de la chaîne</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-3">Partager via</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Facebook className="w-5 h-5" />
                </div>
                <span className="font-medium">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                  <Twitter className="w-5 h-5" />
                </div>
                <span className="font-medium">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('email')}
                className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-medium">Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
