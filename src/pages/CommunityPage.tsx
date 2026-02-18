import { useEffect, useState } from 'react';
import { Users, Plus, TrendingUp, Clock, MessageSquare, UserPlus, UserMinus, Crown, Settings, Lock } from 'lucide-react';
import { communityService, Community, CommunityPost } from '../services/communityService';
import { profileService } from '../services/profileService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import CommunityPostCard from '../components/community/CommunityPostCard';
import { supabase } from '../lib/supabase';

interface CommunityPageProps {
  slug?: string;
}

export default function CommunityPage({ slug = 'music-afrobeat' }: CommunityPageProps) {
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [filter, setFilter] = useState<'top' | 'recent'>('recent');

  useEffect(() => {
    if (slug) {
      loadCommunity();
    }
  }, [slug]);

  const loadCommunity = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const communityData = await communityService.getCommunityBySlug(slug);
      if (!communityData) {
        return;
      }
      setCommunity(communityData);

      if (user) {
        const memberStatus = await communityService.isMember(user.id, communityData.id);
        setIsMember(memberStatus);

        const premiumStatus = await profileService.isPremium(user.id);
        setIsPremium(premiumStatus);

        const { data: roleData } = await supabase
          .from('community_members')
          .select('role')
          .eq('user_id', user.id)
          .eq('community_id', communityData.id)
          .maybeSingle();

        if (roleData) {
          setUserRole(roleData.role);
        }
      }

      const postsData = await communityService.getCommunityPosts(communityData.id);
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading community:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!user || !community) {
      window.location.hash = 'auth';
      return;
    }

    if (isMember) {
      const success = await communityService.leaveCommunity(user.id, community.id);
      if (success) {
        setIsMember(false);
        setCommunity({ ...community, member_count: community.member_count - 1 });
      }
    } else {
      if (community.is_premium && !isPremium) {
        if (confirm('Cette communauté est réservée aux membres Premium. Voulez-vous vous abonner?')) {
          window.location.hash = 'premium';
        }
        return;
      }

      const success = await communityService.joinCommunity(user.id, community.id);
      if (success) {
        setIsMember(true);
        setCommunity({ ...community, member_count: community.member_count + 1 });
        await loadCommunity();
      }
    }
  };

  const filteredPosts = [...posts].sort((a, b) => {
    if (filter === 'top') {
      return b.engagement_score - a.engagement_score;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20 mt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!community) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 mt-16">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {community.banner_url && (
            <div className="h-48 overflow-hidden">
              <img
                src={community.banner_url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {community.avatar_url ? (
                  <img
                    src={community.avatar_url}
                    alt={community.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Users className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {community.name}
                    </h1>
                    {community.is_premium && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-semibold">
                        <Crown className="w-4 h-4" />
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {community.member_count.toLocaleString()} membres
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {community.post_count.toLocaleString()} posts
                    </span>
                    {community.is_premium && (
                      <span className="flex items-center gap-1 font-semibold text-yellow-600">
                        <Crown className="w-4 h-4" />
                        {community.premium_price}€/mois
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {(userRole === 'owner' || userRole === 'admin') && (
                  <a
                    href={`#community-settings/${slug}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    title="Paramètres de la communauté"
                  >
                    <Settings className="w-5 h-5" />
                  </a>
                )}
                <button
                  onClick={handleJoinLeave}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                    isMember
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : community.is_premium && !isPremium
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isMember ? (
                    <>
                      <UserMinus className="w-5 h-5" />
                      Quitter
                    </>
                  ) : (
                    <>
                      {community.is_premium && !isPremium ? (
                        <>
                          <Crown className="w-5 h-5" />
                          Rejoindre (Premium)
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          Rejoindre
                        </>
                      )}
                    </>
                  )}
                </button>
                {isMember && (
                  <a
                    href={`#create-post/${slug}`}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Nouveau post
                  </a>
                )}
              </div>
            </div>
            {community.description && (
              <p className="text-gray-600 mb-4">{community.description}</p>
            )}
            {community.rules && community.rules.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer text-blue-600 font-medium mb-2">
                  Règles de la communauté
                </summary>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  {community.rules.map((rule: any, index: number) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="flex items-center gap-4 p-4 border-b border-gray-200">
                <button
                  onClick={() => setFilter('recent')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'recent'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  Récents
                </button>
                <button
                  onClick={() => setFilter('top')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'top'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  Populaires
                </button>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun post pour le moment
                </h3>
                <p className="text-gray-600 mb-6">
                  Soyez le premier à poster dans cette communauté!
                </p>
                {isMember && (
                  <a
                    href={`#create-post/${slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Créer le premier post
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <CommunityPostCard key={post.id} post={post} communitySlug={slug!} />
                ))}
              </div>
            )}
          </div>

          <div className="w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">À propos</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-600">Type</span>
                  <p className="font-medium text-gray-900 capitalize">
                    {community.type === 'universe' && 'Communauté Univers'}
                    {community.type === 'creator' && 'Communauté Créateur'}
                    {community.type === 'premium' && 'Communauté Premium'}
                    {community.type === 'private' && 'Communauté Privée'}
                  </p>
                </div>
                {community.is_premium && (
                  <div>
                    <span className="text-gray-600">Prix</span>
                    <p className="font-bold text-blue-600">
                      {community.premium_price}€/mois
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Créée le</span>
                  <p className="font-medium text-gray-900">
                    {new Date(community.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
