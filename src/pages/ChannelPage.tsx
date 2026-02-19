import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import ChannelHeader from '../components/channel/ChannelHeader';
import ChannelTabs, { ChannelTabType } from '../components/channel/ChannelTabs';
import VideoCard from '../components/VideoCard';
import { ArrowUpDown, Clock, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

type SortOption = 'recent' | 'popular' | 'oldest';

export default function ChannelPage() {
  const { user } = useAuth();
  const [channelData, setChannelData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<ChannelTabType>('home');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [shorts, setShorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const channelUrl = window.location.pathname.split('/channel/')[1];

  useEffect(() => {
    loadChannelData();
  }, [channelUrl]);

  useEffect(() => {
    if (channelData) {
      loadContent();
    }
  }, [channelData, activeTab, sortBy]);

  const loadChannelData = async () => {
    try {
      const { data: channel, error } = await supabase
        .from('creator_channels')
        .select('*')
        .eq('channel_url', channelUrl)
        .maybeSingle();

      if (error) throw error;
      if (!channel) {
        window.location.href = '/404';
        return;
      }

      setChannelData(channel);

      if (user) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('channel_id', channel.id)
          .eq('status', 'active')
          .maybeSingle();

        setIsSubscribed(!!subscription);
      }
    } catch (error) {
      console.error('Erreur chargement chaîne:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    if (!channelData) return;

    try {
      let query = supabase
        .from('videos')
        .select('*')
        .eq('channel_id', channelData.id)
        .eq('status', 'published');

      if (activeTab === 'videos') {
        query = query.eq('is_short', false);
      } else if (activeTab === 'shorts') {
        query = query.eq('is_short', true);
      }

      if (sortBy === 'recent') {
        query = query.order('published_at', { ascending: false });
      } else if (sortBy === 'popular') {
        query = query.order('views', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('published_at', { ascending: true });
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      if (activeTab === 'shorts') {
        setShorts(data || []);
      } else {
        setVideos(data || []);
      }
    } catch (error) {
      console.error('Erreur chargement contenu:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    try {
      if (isSubscribed) {
        await supabase
          .from('subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('channel_id', channelData.id);

        await supabase.rpc('decrement_subscriber_count', {
          channel_id: channelData.id
        });

        setIsSubscribed(false);
      } else {
        await supabase.from('subscriptions').insert({
          user_id: user.id,
          channel_id: channelData.id,
          status: 'active'
        });

        await supabase.rpc('increment_subscriber_count', {
          channel_id: channelData.id
        });

        setIsSubscribed(true);
      }

      loadChannelData();
    } catch (error) {
      console.error('Erreur abonnement:', error);
    }
  };

  const handleEdit = () => {
    window.location.href = `/channel/${channelUrl}/edit`;
  };

  const isOwner = user && channelData && channelData.user_id === user.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!channelData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Chaîne introuvable</h1>
          <p className="text-neutral-400">Cette chaîne n'existe pas ou a été supprimée.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            {videos.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Vidéo mise en avant</h2>
                <div className="max-w-2xl">
                  <VideoCard video={videos[0]} />
                </div>
              </div>
            )}

            {videos.length > 1 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Dernières publications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {videos.slice(1, 9).map(video => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </div>
            )}

            {shorts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Shorts récents</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {shorts.slice(0, 6).map(short => (
                    <VideoCard key={short.id} video={short} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'videos':
      case 'shorts':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {activeTab === 'videos' ? 'Toutes les vidéos' : 'Tous les Shorts'}
              </h2>
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-sm">
                    {sortBy === 'recent' && 'Récentes'}
                    {sortBy === 'popular' && 'Populaires'}
                    {sortBy === 'oldest' && 'Anciennes'}
                  </span>
                </button>

                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-50">
                    <button
                      onClick={() => {
                        setSortBy('recent');
                        setShowSortMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700 transition-colors flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Récentes
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('popular');
                        setShowSortMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700 transition-colors flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Populaires
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('oldest');
                        setShowSortMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700 transition-colors flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Anciennes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {activeTab === 'videos' && videos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-400">Aucune vidéo publiée pour le moment.</p>
              </div>
            )}

            {activeTab === 'shorts' && shorts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-400">Aucun Short publié pour le moment.</p>
              </div>
            )}

            <div className={activeTab === 'shorts'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            }>
              {(activeTab === 'videos' ? videos : shorts).map(video => (
                <VideoCard key={video.id} video={video} compact={activeTab === 'shorts'} />
              ))}
            </div>
          </div>
        );

      case 'releases':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-white mb-2">Sorties Premium</h2>
            <p className="text-neutral-400">Albums et contenus premium à venir</p>
          </div>
        );

      case 'playlists':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-white mb-2">Playlists</h2>
            <p className="text-neutral-400">Collections de vidéos organisées</p>
          </div>
        );

      case 'posts':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-white mb-2">Posts Communauté</h2>
            <p className="text-neutral-400">Actualités et discussions</p>
          </div>
        );

      case 'events':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-white mb-2">Événements</h2>
            <p className="text-neutral-400">Lives passés et à venir</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <ChannelHeader
        channelData={channelData}
        isOwner={isOwner}
        isSubscribed={isSubscribed}
        onSubscribe={handleSubscribe}
        onEdit={handleEdit}
      />

      <ChannelTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          videos: videos.length,
          shorts: shorts.length,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}
