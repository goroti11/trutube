import { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, Link2, Facebook, Twitter, MessageCircle, Send, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { referralService } from '../../services/referralService';

interface ShareVideoModalProps {
  videoId: string;
  videoTitle: string;
  onClose: () => void;
}

interface SharePlatform {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  getUrl: (link: string, title: string, code: string) => string;
}

const PLATFORMS: SharePlatform[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    color: 'bg-blue-700 hover:bg-blue-800',
    icon: <Facebook className="w-5 h-5" />,
    getUrl: (link, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(title)}`
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    color: 'bg-gray-800 hover:bg-gray-700',
    icon: <Twitter className="w-5 h-5" />,
    getUrl: (link, title) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(link)}`
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: 'bg-green-600 hover:bg-green-700',
    icon: <MessageCircle className="w-5 h-5" />,
    getUrl: (link, title) => `https://wa.me/?text=${encodeURIComponent(title + '\n' + link)}`
  },
  {
    id: 'telegram',
    label: 'Telegram',
    color: 'bg-sky-600 hover:bg-sky-700',
    icon: <Send className="w-5 h-5" />,
    getUrl: (link, title) => `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title)}`
  },
  {
    id: 'email',
    label: 'Email',
    color: 'bg-gray-700 hover:bg-gray-600',
    icon: <Mail className="w-5 h-5" />,
    getUrl: (link, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Regardez cette vidéo sur GOROTI :\n' + link)}`
  },
];

export default function ShareVideoModal({ videoId, videoTitle, onClose }: ShareVideoModalProps) {
  const { user } = useAuth();
  const [refCode, setRefCode] = useState<string | null>(null);
  const [includeRef, setIncludeRef] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'embed'>('link');

  useEffect(() => {
    if (user) {
      referralService.getOrCreateReferralCode(user.id).then(code => {
        if (code) setRefCode(code.code);
      });
    }
  }, [user]);

  const shareLink = includeRef && refCode
    ? referralService.getVideoShareLink(videoId, refCode)
    : referralService.getVideoShareLink(videoId);

  const embedCode = `<iframe src="${shareLink}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;

  const copyText = activeTab === 'embed' ? embedCode : shareLink;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (user) {
      referralService.logShareEvent(videoId, 'copy', user.id, includeRef && refCode ? refCode : undefined);
    }
  };

  const handlePlatformShare = (platform: SharePlatform) => {
    const url = platform.getUrl(shareLink, videoTitle, refCode || '');
    window.open(url, '_blank', 'noopener,noreferrer');
    if (user) {
      referralService.logShareEvent(videoId, platform.id, user.id, includeRef && refCode ? refCode : undefined);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: videoTitle, url: shareLink });
      if (user) {
        referralService.logShareEvent(videoId, 'native', user.id, includeRef && refCode ? refCode : undefined);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gray-900 border border-gray-800 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md mx-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-lg font-bold">Partager la vidéo</h3>
          <button onClick={onClose} className="w-8 h-8 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-5 gap-2">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => handlePlatformShare(p)}
                className={`${p.color} text-white rounded-xl p-3 flex flex-col items-center gap-1.5 transition-colors`}
                title={p.label}
              >
                {p.icon}
                <span className="text-xs font-medium hidden sm:block">{p.label}</span>
              </button>
            ))}
          </div>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors text-sm"
            >
              Partager via l'application...
            </button>
          )}

          <div className="flex gap-2 bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'link' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Lien
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'embed' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Intégrer
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5">
              <Link2 className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="flex-1 text-xs text-gray-300 truncate font-mono">
                {activeTab === 'embed' ? embedCode.slice(0, 60) + '...' : copyText}
              </span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                  copied ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copié!' : 'Copier'}
              </button>
            </div>

            {user && refCode && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setIncludeRef(!includeRef)}
                  className={`w-9 h-5 rounded-full transition-colors relative ${includeRef ? 'bg-red-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${includeRef ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-gray-300">
                  Inclure mon code de parrainage <span className="text-yellow-400 font-mono font-bold">{refCode}</span>
                </span>
              </label>
            )}
          </div>

          {user && refCode && includeRef && (
            <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-3 text-sm text-yellow-300">
              Chaque ami qui s'inscrit via votre lien vous rapporte <strong>{referralService.REWARD_PER_REFERRAL} TC</strong> !
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
