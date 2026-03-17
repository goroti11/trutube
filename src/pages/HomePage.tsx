import { useState, useEffect } from 'react';
import { Music, Gamepad2, BookOpen, Theater, Heart, Brain, Code, Film, Trophy, Crown, Sparkles, Utensils, Plane, Shirt, Microscope, FileText, ShoppingBag, Baby, Newspaper, Users, Video as LucideIcon } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import FreeTrialBanner from '../components/FreeTrialBanner';
import TrendingSection from '../components/TrendingSection';
import VideoCard from '../components/VideoCard';
import { videoService, VideoWithCreator } from '../services/videoService';
import { legendFeedService, LegendFeedItem } from '../services/legendFeedService';
import { universeService } from '../services/universeService';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onUniverseClick: (universeId: string) => void;
}

interface Universe {
  id: string;
  slug: string;
  name: string;
  description: string;
  color_primary: string;
  color_secondary: string;
  icon: LucideIcon;
  color: string;
}

const iconMap: Record<string, LucideIcon> = {
  'music': Music,
  'game': Gamepad2,
  'gaming': Gamepad2,
  'learn': BookOpen,
  'know': BookOpen,
  'culture': Theater,
  'life': Heart,
  'mind': Brain,
  'lean': Code,
  'tech': Code,
  'movie': Film,
  'sport': Trophy,
  'food': Utensils,
  'travel': Plane,
  'fashion': Shirt,
  'science': Microscope,
  'documentary': FileText,
  'marketplace': ShoppingBag,
  'kids': Baby,
  'news': Newspaper,
  'community': Users,
};

const colorMap: Record<string, string> = {
  'music': 'from-pink-600 to-pink-800',
  'game': 'from-green-600 to-green-800',
  'gaming': 'from-green-600 to-green-800',
  'learn': 'from-yellow-600 to-yellow-800',
  'know': 'from-amber-600 to-amber-800',
  'culture': 'from-purple-600 to-purple-800',
  'life': 'from-rose-600 to-rose-800',
  'mind': 'from-indigo-600 to-indigo-800',
  'lean': 'from-emerald-600 to-emerald-800',
  'tech': 'from-blue-600 to-blue-800',
  'movie': 'from-violet-600 to-violet-800',
  'sport': 'from-orange-600 to-orange-800',
  'food': 'from-red-600 to-red-800',
  'travel': 'from-cyan-600 to-cyan-800',
  'fashion': 'from-fuchsia-600 to-fuchsia-800',
  'science': 'from-purple-600 to-purple-800',
  'documentary': 'from-amber-700 to-amber-900',
  'marketplace': 'from-orange-500 to-orange-700',
  'kids': 'from-yellow-500 to-yellow-700',
  'news': 'from-red-700 to-red-900',
  'community': 'from-teal-600 to-teal-800',
};

export default function HomePage({ onUniverseClick }: HomePageProps) {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(() => {
    return !sessionStorage.getItem('trialBannerDismissed');
  });
  const [trendingVideos, setTrendingVideos] = useState<VideoWithCreator[]>([]);
  const [legendVideos, setLegendVideos] = useState<LegendFeedItem[]>([]);
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [user]);

  const loadContent = async () => {
    try {
      setLoading(true);

      const [videos, legendContent, universesData] = await Promise.all([
        videoService.getTrendingVideos(12),
        user ? legendFeedService.getLegendFeedRecommendations(user.id, undefined, 6) : Promise.resolve([]),
        universeService.getAllUniverses()
      ]);

      const mappedUniverses = universesData.map(u => {
        const slug = u.slug || u.id;
        return {
          id: u.id,
          slug: slug,
          name: u.name,
          description: u.description || '',
          color_primary: u.color_primary,
          color_secondary: u.color_secondary,
          icon: iconMap[slug] || BookOpen,
          color: colorMap[slug] || 'from-gray-600 to-gray-800',
        };
      });

      console.log('🌍 Total universes loaded:', mappedUniverses.length);
      console.log('🌍 Universes:', mappedUniverses.map(u => u.name).join(', '));

      setTrendingVideos(videos);
      setLegendVideos(legendContent);
      setUniverses(mappedUniverses);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBanner = () => {
    sessionStorage.setItem('trialBannerDismissed', 'true');
    setShowBanner(false);
  };

  return (
    <div className="min-h-screen">
      {showBanner && (
        <div className="sticky top-0 z-50">
          <FreeTrialBanner
            onClose={handleCloseBanner}
            onStartTrial={() => {
              console.log('Starting trial...');
            }}
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4 tracking-tight">
            Choisis ton univers
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pas de chaos. Pas de scroll infini. Juste le contenu que tu veux, dans l'univers que tu choisis.
          </p>
          {!loading && universes.length > 0 && (
            <p className="text-sm text-gray-500 mt-4">
              {universes.length} univers disponibles
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {universes.map((universe) => {
              const Icon = universe.icon;
              return (
                <button
                  key={universe.id}
                  onClick={() => onUniverseClick(universe.slug)}
                  className="group relative overflow-hidden rounded-2xl border-2 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${universe.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

                  <div className="relative p-8 flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${universe.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-3xl font-black mb-2">
                      {universe.name}
                    </h2>

                    <p className="text-sm text-gray-400">
                      {universe.description}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <AdUnit
            slot="1234567890"
            format="horizontal"
            className="max-w-4xl w-full"
          />
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Entre dans un univers. Découvre. Reviens quand tu veux.
          </p>
        </div>
        </div>
      </div>

      {/* Legend Promoted Content Section */}
      {!loading && legendVideos.length > 0 && (
        <div className="container mx-auto px-6 py-12 border-t border-gray-800">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-black">
                Legend Content
              </h2>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-gray-400">
              Community-validated content boosted by performance, engagement, and economic impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legendVideos.map((item) => (
              <VideoCard
                key={item.entity_id}
                video={{
                  id: item.entity_id,
                  userId: '',
                  creatorId: '',
                  title: item.video_title,
                  description: '',
                  thumbnailUrl: item.video_thumbnail,
                  videoUrl: '',
                  duration: 0,
                  isShort: false,
                  isPremium: false,
                  viewCount: item.view_count,
                  likeCount: item.like_count,
                  commentCount: 0,
                  avgWatchTime: 0,
                  createdAt: item.created_at,
                  user: {
                    id: '',
                    displayName: item.creator_name,
                    avatarUrl: '',
                    bio: '',
                    userStatus: 'viewer' as const,
                    subscriberCount: 0,
                    uploadFrequency: 0,
                    createdAt: item.created_at,
                    updatedAt: item.created_at
                  }
                }}
                legendLevel={item.legend_level}
                legendScore={item.legend_score}
                isLegendPromoted={item.is_legend_promoted}
                onClick={(video) => {
                  legendFeedService.trackLegendImpression('video', video.id, true);
                  window.location.hash = 'watch/' + video.id;
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trending Videos Section */}
      {!loading && trendingVideos.length > 0 && (
        <div className="container mx-auto px-6 py-16">
          <TrendingSection videos={trendingVideos} />
        </div>
      )}
    </div>
  );
}
