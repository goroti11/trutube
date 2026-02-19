import { useState } from 'react';
import { Users, Search, X, TrendingUp, Calendar, Crown, Star } from 'lucide-react';
import Header from '../components/Header';

interface SubscribersPageProps {
  onNavigate: (page: string) => void;
}

type SortType = 'recent' | 'oldest' | 'most-active';

export default function SubscribersPage({ onNavigate }: SubscribersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [selectedTier, setSelectedTier] = useState<'all' | 'free' | 'premium'>('all');

  // Mock subscribers data
  const subscribers = [
    {
      id: '1',
      username: 'marie_laurent',
      displayName: 'Marie Laurent',
      avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      subscribedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tier: 'premium' as const,
      tierName: 'Gold Member',
      activityScore: 95,
      videosWatched: 127,
      commentsCount: 45,
      likesGiven: 234
    },
    {
      id: '2',
      username: 'thomas_dubois',
      displayName: 'Thomas Dubois',
      avatarUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
      subscribedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      tier: 'free' as const,
      activityScore: 78,
      videosWatched: 89,
      commentsCount: 23,
      likesGiven: 156
    },
    {
      id: '3',
      username: 'sophie_martin',
      displayName: 'Sophie Martin',
      avatarUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      subscribedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      tier: 'premium' as const,
      tierName: 'Platinum VIP',
      activityScore: 98,
      videosWatched: 245,
      commentsCount: 89,
      likesGiven: 567
    },
    {
      id: '4',
      username: 'lucas_bernard',
      displayName: 'Lucas Bernard',
      avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      subscribedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      tier: 'free' as const,
      activityScore: 45,
      videosWatched: 34,
      commentsCount: 8,
      likesGiven: 67
    },
    {
      id: '5',
      username: 'emma_petit',
      displayName: 'Emma Petit',
      avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      subscribedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      tier: 'premium' as const,
      tierName: 'Silver Supporter',
      activityScore: 82,
      videosWatched: 156,
      commentsCount: 34,
      likesGiven: 289
    },
    {
      id: '6',
      username: 'alex_rousseau',
      displayName: 'Alex Rousseau',
      avatarUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=100',
      subscribedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      tier: 'free' as const,
      activityScore: 62,
      videosWatched: 72,
      commentsCount: 15,
      likesGiven: 123
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)}j`;
    if (seconds < 2592000) return `Il y a ${Math.floor(seconds / 604800)} sem`;
    return `Il y a ${Math.floor(seconds / 2592000)} mois`;
  };

  const _getTierColor = (tier: 'free' | 'premium') => {
    return tier === 'premium' ? 'text-yellow-400' : 'text-gray-400';
  };

  const getTierBadge = (tier: 'free' | 'premium', tierName?: string) => {
    if (tier === 'free') return null;
    return (
      <span className="px-2 py-1 bg-yellow-900 text-yellow-300 rounded text-xs font-semibold flex items-center gap-1">
        <Crown className="w-3 h-3" />
        {tierName || 'Premium'}
      </span>
    );
  };

  const filteredSubscribers = subscribers
    .filter(sub => {
      const matchesSearch = sub.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           sub.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = selectedTier === 'all' ||
                         (selectedTier === 'premium' && sub.tier === 'premium') ||
                         (selectedTier === 'free' && sub.tier === 'free');
      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return b.subscribedAt.getTime() - a.subscribedAt.getTime();
      if (sortBy === 'oldest') return a.subscribedAt.getTime() - b.subscribedAt.getTime();
      if (sortBy === 'most-active') return b.activityScore - a.activityScore;
      return 0;
    });

  const stats = {
    total: subscribers.length,
    premium: subscribers.filter(s => s.tier === 'premium').length,
    free: subscribers.filter(s => s.tier === 'free').length,
    avgActivity: Math.round(subscribers.reduce((acc, s) => acc + s.activityScore, 0) / subscribers.length)
  };

  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="min-h-screen bg-gray-950 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mes abonnés</h1>
            <p className="text-gray-400">Gérez et interagissez avec votre communauté</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-gray-400 text-sm">Total abonnés</span>
              </div>
              <div className="text-3xl font-bold">{stats.total.toLocaleString()}</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-400 text-sm">Membres premium</span>
              </div>
              <div className="text-3xl font-bold">{stats.premium}</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-gray-400 text-sm">Abonnés gratuits</span>
              </div>
              <div className="text-3xl font-bold">{stats.free}</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-gray-400 text-sm">Activité moyenne</span>
              </div>
              <div className="text-3xl font-bold">{stats.avgActivity}%</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un abonné..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Tier Filter */}
            <div className="flex gap-2">
              {(['all', 'premium', 'free'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    selectedTier === tier
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {tier === 'all' && 'Tous'}
                  {tier === 'premium' && 'Premium'}
                  {tier === 'free' && 'Gratuit'}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="recent">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="most-active">Plus actifs</option>
            </select>
          </div>

          {/* Subscribers List */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-800">
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="p-4 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <img
                      src={subscriber.avatarUrl}
                      alt={subscriber.displayName}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base truncate">
                          {subscriber.displayName}
                        </h3>
                        {getTierBadge(subscriber.tier, subscriber.tierName)}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">@{subscriber.username}</p>

                      {/* Activity Stats */}
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatTimeAgo(subscriber.subscribedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {subscriber.activityScore}% actif
                        </span>
                        <span>{subscriber.videosWatched} vidéos vues</span>
                        <span>{subscriber.commentsCount} commentaires</span>
                      </div>
                    </div>

                    {/* Activity Score */}
                    <div className="flex-shrink-0 text-center hidden md:block">
                      <div className="relative w-20 h-20">
                        <svg className="transform -rotate-90 w-20 h-20">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-gray-700"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${2 * Math.PI * 32 * (1 - subscriber.activityScore / 100)}`}
                            className={subscriber.activityScore >= 80 ? 'text-green-500' : subscriber.activityScore >= 50 ? 'text-yellow-500' : 'text-red-500'}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{subscriber.activityScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onNavigate(`profile/${subscriber.username}`)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex-shrink-0"
                    >
                      Voir le profil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-16 bg-gray-900 rounded-lg">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Aucun abonné trouvé</h3>
              <p className="text-gray-400">
                {searchQuery
                  ? 'Aucun abonné ne correspond à votre recherche'
                  : 'Vous n\'avez pas encore d\'abonnés'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredSubscribers.length > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors">
                Précédent
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium">
                1
              </button>
              <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors">
                2
              </button>
              <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors">
                3
              </button>
              <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors">
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
