import { useEffect, useState } from 'react';
import { Users, TrendingUp, Lock, Globe, ChevronRight, Crown, Check, Plus } from 'lucide-react';
import { communityService, Community } from '../services/communityService';
import { profileService } from '../services/profileService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

export default function CommunityListPage() {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [userCommunityIds, setUserCommunityIds] = useState<Set<string>>(new Set());
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'universe' | 'creator' | 'premium'>('all');

  useEffect(() => {
    loadCommunities();
  }, [filter, user]);

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const allCommunities = await communityService.getCommunities(
        filter === 'all' ? undefined : filter
      );
      setCommunities(allCommunities);

      if (user) {
        const joined = await communityService.getUserCommunities(user.id);
        setUserCommunities(joined);
        setUserCommunityIds(new Set(joined.map(c => c.id)));

        const premiumStatus = await profileService.isPremium(user.id);
        setIsPremium(premiumStatus);
      }
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (e: React.MouseEvent, community: Community) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.hash = 'auth';
      return;
    }

    if (community.is_premium && !isPremium) {
      if (confirm('Cette communauté est réservée aux membres Premium. Voulez-vous vous abonner?')) {
        window.location.hash = 'premium';
      }
      return;
    }

    setJoiningId(community.id);
    try {
      const success = await communityService.joinCommunity(user.id, community.id);
      if (success) {
        setUserCommunityIds(prev => new Set([...prev, community.id]));
        await loadCommunities();
      }
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Erreur lors de la jonction à la communauté');
    } finally {
      setJoiningId(null);
    }
  };

  const isJoined = (communityId: string) => {
    return userCommunityIds.has(communityId);
  };

  const getCommunityIcon = (type: Community['type']) => {
    switch (type) {
      case 'universe':
        return <Globe className="w-5 h-5" />;
      case 'creator':
        return <Users className="w-5 h-5" />;
      case 'premium':
        return <Lock className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const getCommunityTypeLabel = (type: Community['type']) => {
    switch (type) {
      case 'universe':
        return 'Univers';
      case 'creator':
        return 'Créateur';
      case 'premium':
        return 'Premium';
      case 'private':
        return 'Privée';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 mt-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">GOROTI Communauté</h1>
            <p className="text-lg text-gray-600">
              Rejoignez des communautés actives et créez de vraies relations
            </p>
          </div>
          {user && (
            <a
              href="#create-community"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Users className="w-5 h-5" />
              Créer une communauté
            </a>
          )}
        </div>

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              Connectez-vous pour rejoindre des communautés
            </h3>
            <p className="text-blue-800 mb-4">
              Créez un compte gratuit pour participer aux discussions, créer des posts et rejoindre des communautés.
            </p>
            <a
              href="#auth"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Se connecter / S'inscrire
            </a>
          </div>
        )}

        {user && userCommunities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mes Communautés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userCommunities.map((community) => (
                <a
                  key={community.id}
                  href={`#community/${community.slug}`}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all text-left group block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {community.avatar_url ? (
                        <img
                          src={community.avatar_url}
                          alt={community.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {getCommunityIcon(community.type)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {community.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {getCommunityTypeLabel(community.type)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {community.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {community.member_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {community.post_count.toLocaleString()}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-4 border-b border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-3 font-medium transition-colors ${
                filter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('universe')}
              className={`px-4 py-3 font-medium transition-colors ${
                filter === 'universe'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Univers
            </button>
            <button
              onClick={() => setFilter('creator')}
              className={`px-4 py-3 font-medium transition-colors ${
                filter === 'creator'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Créateurs
            </button>
            <button
              onClick={() => setFilter('premium')}
              className={`px-4 py-3 font-medium transition-colors ${
                filter === 'premium'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Premium
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-20">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune communauté trouvée
            </h3>
            <p className="text-gray-600">
              Revenez bientôt, de nouvelles communautés arrivent!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <div
                key={community.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                {community.banner_url && (
                  <div className="h-32 overflow-hidden">
                    <img
                      src={community.banner_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    {community.avatar_url ? (
                      <img
                        src={community.avatar_url}
                        alt={community.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {getCommunityIcon(community.type)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {community.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {getCommunityTypeLabel(community.type)}
                        {community.is_premium && (
                          <Crown className="w-3 h-3 text-yellow-600" />
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {community.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {community.member_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {community.post_count.toLocaleString()}
                    </span>
                    {community.is_premium && (
                      <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                        <Crown className="w-4 h-4" />
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`#community/${community.slug}`}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors text-center"
                    >
                      Voir
                    </a>
                    {user && !isJoined(community.id) && (
                      <button
                        onClick={(e) => handleJoinCommunity(e, community)}
                        disabled={joiningId === community.id}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                          community.is_premium && !isPremium
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {joiningId === community.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Rejoindre
                          </>
                        )}
                      </button>
                    )}
                    {user && isJoined(community.id) && (
                      <button
                        disabled
                        className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <Check className="w-4 h-4" />
                        Membre
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
