import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, Rocket, Globe, Lightbulb, Radio, Video, Zap, Trophy,
  Calendar, Star, Crown, Flame, Music, Gamepad2, BookOpen, Theater,
  Heart, Brain, Code, Film, Users, ShoppingBag, Baby, Newspaper,
  Utensils, Plane, Shirt, Microscope, FileText, Play, ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { videoService, VideoWithCreator } from '../services/videoService';
import { universeService } from '../services/universeService';
import { profileService } from '../services/profileService';
import VideoCard from '../components/VideoCard';

interface Creator {
  id: string;
  username: string;
  avatar_url: string | null;
  subscribers_count: number;
  is_verified: boolean;
  creator_tier?: string;
}

interface Event {
  id: string;
  title: string;
  type: string;
  start_date: string;
  universe?: string;
  thumbnail?: string;
}

const iconMap: Record<string, any> = {
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
  'know': 'from-blue-600 to-blue-800',
  'culture': 'from-purple-600 to-purple-800',
  'life': 'from-rose-600 to-rose-800',
  'mind': 'from-amber-600 to-amber-800',
  'lean': 'from-emerald-600 to-emerald-800',
  'tech': 'from-cyan-600 to-cyan-800',
  'movie': 'from-violet-600 to-violet-800',
  'sport': 'from-orange-600 to-orange-800',
  'food': 'from-red-600 to-red-800',
  'travel': 'from-sky-600 to-sky-800',
  'fashion': 'from-fuchsia-600 to-fuchsia-800',
  'science': 'from-indigo-600 to-indigo-800',
  'documentary': 'from-amber-700 to-amber-900',
  'marketplace': 'from-orange-500 to-orange-700',
  'kids': 'from-yellow-500 to-yellow-700',
  'news': 'from-red-700 to-red-900',
  'community': 'from-teal-600 to-teal-800',
};

const trendingCategories = [
  { id: 'now', name: 'Trending Now', icon: Flame, color: 'from-red-500 to-orange-500' },
  { id: 'rising', name: 'Rising Creators', icon: Rocket, color: 'from-green-500 to-emerald-500' },
  { id: 'global', name: 'Global Trends', icon: Globe, color: 'from-blue-500 to-cyan-500' },
  { id: 'topics', name: 'Trending Topics', icon: Lightbulb, color: 'from-purple-500 to-pink-500' },
];

const formats = [
  { id: 'live', name: 'Live Now', icon: Radio, color: 'bg-red-600', path: '/live' },
  { id: 'new', name: 'New Videos', icon: Video, color: 'bg-blue-600', path: '/browse?sort=new' },
  { id: 'shorts', name: 'Shorts', icon: Zap, color: 'bg-yellow-600', path: '/shorts' },
  { id: 'competitions', name: 'Competitions', icon: Trophy, color: 'bg-purple-600', path: '/gaming/tournaments' },
  { id: 'premieres', name: 'Premieres', icon: Calendar, color: 'bg-pink-600', path: '/premieres' },
];

const popularTags = [
  'AI', 'Afrobeat', 'Warzone', 'Travel Africa', 'Stand-up', 'Entrepreneurship',
  'Space', 'Anime', 'Fitness', 'Crypto', 'Football', 'Rap', 'Cooking',
  'Fashion', 'Tech News', 'Gaming', 'Documentary', 'Comedy'
];

export default function ExplorePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedTrending, setSelectedTrending] = useState('now');

  const [trendingVideos, setTrendingVideos] = useState<VideoWithCreator[]>([]);
  const [risingCreators, setRisingCreators] = useState<Creator[]>([]);
  const [universes, setUniverses] = useState<any[]>([]);
  const [liveVideos, setLiveVideos] = useState<VideoWithCreator[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<VideoWithCreator[]>([]);
  const [featuredCreators, setFeaturedCreators] = useState<Creator[]>([]);

  useEffect(() => {
    loadExploreContent();
  }, [user, selectedTrending]);

  const loadExploreContent = async () => {
    try {
      setLoading(true);

      const [trending, universesData, live, recommended] = await Promise.all([
        videoService.getTrendingVideos(8),
        universeService.getAllUniverses(),
        videoService.getLiveVideos(4),
        user ? videoService.getRecommendedVideos(user.id, 8) : videoService.getTrendingVideos(8),
      ]);

      setTrendingVideos(trending);
      setUniverses(universesData);
      setLiveVideos(live);
      setRecommendedVideos(recommended);

    } catch (error) {
      console.error('Error loading explore content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black">Explorer</h1>
        </div>

        <section>
          <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
            {trendingCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedTrending(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
                    selectedTrending === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.name}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black">Univers</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {universes.map((universe) => {
              const Icon = iconMap[universe.slug] || BookOpen;
              const color = colorMap[universe.slug] || 'from-gray-600 to-gray-800';

              return (
                <button
                  key={universe.id}
                  onClick={() => navigate(`/universe/${universe.slug}`)}
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity`} />

                  <div className="relative p-6 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-lg font-black">{universe.name}</h3>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black">Formats populaires</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {formats.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() => navigate(format.path)}
                  className={`${format.color} hover:opacity-90 rounded-xl p-6 flex flex-col items-center gap-3 transition-all hover:scale-105`}
                >
                  <Icon className="w-10 h-10" />
                  <span className="font-bold text-lg">{format.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {liveVideos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <h2 className="text-3xl font-black">Live maintenant</h2>
              </div>
              <Link
                to="/live"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                Voir tout
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {liveVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black">Topics populaires</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 rounded-full font-semibold transition-all hover:scale-105 border border-gray-800 hover:border-gray-700"
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-black">Créateurs en vedette</h2>
            </div>
            <Link
              to="/creators"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              Voir tout
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Users className="w-12 h-12" />
                </div>
                <div className="text-center">
                  <div className="font-bold">Créateur {i}</div>
                  <div className="text-sm text-gray-400">1.2M abonnés</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-black">Événements à venir</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-900/20 to-green-600/10 border border-green-600/30 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Gaming Tournament</h3>
                  <p className="text-sm text-gray-400 mb-2">Warzone Championship</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Dans 2 jours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-900/20 to-pink-600/10 border border-pink-600/30 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Live Concert</h3>
                  <p className="text-sm text-gray-400 mb-2">Afrobeat Night</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Ce soir 21h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-purple-600/10 border border-purple-600/30 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Film className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Film Premiere</h3>
                  <p className="text-sm text-gray-400 mb-2">Exclusive Screening</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Vendredi 20h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {user && recommendedVideos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-yellow-500" />
                <h2 className="text-3xl font-black">Recommandé pour vous</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
