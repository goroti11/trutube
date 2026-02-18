import { useState, useEffect } from 'react';
import { Link2, ExternalLink, TrendingUp } from 'lucide-react';
import { affiliationService, AffiliateLink } from '../../services/affiliationService';
import { useAuth } from '../../contexts/AuthContext';

interface VideoAffiliateLinksProps {
  videoId: string;
  creatorId: string;
}

export default function VideoAffiliateLinks({ videoId, creatorId }: VideoAffiliateLinksProps) {
  const { user } = useAuth();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAffiliateLinks();
  }, [videoId]);

  const loadAffiliateLinks = async () => {
    setLoading(true);
    const videoLinks = await affiliationService.getVideoAffiliateLinks(videoId);

    if (videoLinks.length === 0) {
      const creatorLinks = await affiliationService.getCreatorAffiliateLinks(creatorId);
      setLinks(creatorLinks.slice(0, 5));
    } else {
      setLinks(videoLinks);
    }

    setLoading(false);
  };

  const handleLinkClick = async (link: AffiliateLink) => {
    await affiliationService.trackAffiliateClick(link.id, user?.id, videoId);

    window.open(link.affiliate_url, '_blank', 'noopener,noreferrer');
  };

  const getPlatformBadge = (platform: string) => {
    const platforms: Record<string, { label: string; color: string }> = {
      amazon: { label: 'Amazon', color: 'bg-orange-500' },
      aliexpress: { label: 'AliExpress', color: 'bg-red-500' },
      clickbank: { label: 'ClickBank', color: 'bg-blue-500' },
      custom: { label: 'Partenaire', color: 'bg-purple-500' },
    };

    return platforms[platform] || platforms.custom;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-40 mb-3"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Link2 className="w-5 h-5 text-blue-400" />
        <h4 className="font-semibold">Liens recommandés</h4>
        <span className="text-xs text-gray-500">(Affiliation)</span>
      </div>

      <div className="space-y-2">
        {links.map((link) => {
          const platform = getPlatformBadge(link.platform);

          return (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="w-full bg-gray-900 hover:bg-gray-800 rounded-lg p-3 transition-all group text-left border border-gray-800 hover:border-blue-500"
            >
              <div className="flex items-start gap-3">
                {link.thumbnail_url && (
                  <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={link.thumbnail_url}
                      alt={link.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="font-medium text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {link.title}
                    </h5>
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>

                  {link.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                      {link.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <span className={`${platform.color} text-white text-xs px-2 py-0.5 rounded font-medium`}>
                      {platform.label}
                    </span>
                    {link.commission_rate > 0 && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        {link.commission_rate}% cashback
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 text-center">
        En tant que partenaire Amazon, le créateur peut percevoir une rémunération lorsque vous cliquez sur ces liens.
      </p>
    </div>
  );
}
