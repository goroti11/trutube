import { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Video as VideoIcon,
  Radio,
  List,
  MessageSquare,
  Clock,
  Users,
  Bell,
  BellOff,
  MoreVertical,
  Play,
  Camera,
  Image as ImageIcon,
  Grid3x3,
  PlaySquare
} from 'lucide-react';
import Header from '../components/Header';

interface EnhancedCreatorProfilePageProps {
  onNavigate: (page: string) => void;
}

type TabType = 'videos' | 'shorts' | 'live' | 'playlists' | 'posts' | 'releases' | 'about';

export default function EnhancedCreatorProfilePage({ onNavigate }: EnhancedCreatorProfilePageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showEditBanner, setShowEditBanner] = useState(false);

  // Mock data - replace with real data from props/API
  const creator = {
    id: '1',
    username: 'alexbeats',
    displayName: 'Alex Beats',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    bannerUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920',
    bio: 'Music producer and beat maker. Creating authentic content for music lovers worldwide. 🎵',
    subscriberCount: 84000,
    videoCount: 247,
    totalViews: 12400000,
    isVerified: true,
    joinedDate: '2020-03-15',
    links: [
      { name: 'Instagram', url: 'https://instagram.com/alexbeats' },
      { name: 'Twitter', url: 'https://twitter.com/alexbeats' },
      { name: 'Website', url: 'https://alexbeats.com' }
    ]
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const tabs = [
    { id: 'videos', label: 'Vidéos', icon: VideoIcon },
    { id: 'shorts', label: 'Shorts', icon: PlaySquare },
    { id: 'live', label: 'Live', icon: Radio },
    { id: 'releases', label: 'Sorties', icon: Play },
    { id: 'playlists', label: 'Playlists', icon: List },
    { id: 'posts', label: 'Posts', icon: MessageSquare },
    { id: 'about', label: 'À propos', icon: Users }
  ];

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    if (!isSubscribed) {
      setNotificationsEnabled(false);
    }
  };

  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="min-h-screen bg-gray-950 text-white">
        {/* Banner */}
        <div
          className="relative h-48 md:h-64 bg-gradient-to-br from-red-900 to-gray-900 bg-cover bg-center"
          style={creator.bannerUrl ? { backgroundImage: `url(${creator.bannerUrl})` } : {}}
          onMouseEnter={() => setShowEditBanner(true)}
          onMouseLeave={() => setShowEditBanner(false)}
        >
          <button
            onClick={() => onNavigate('home')}
            className="absolute top-4 left-4 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {showEditBanner && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                <Camera className="w-5 h-5" />
                Modifier la bannière
              </button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-12 md:-mt-16 mb-6">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={creator.avatarUrl}
                alt={creator.displayName}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-950 object-cover"
              />
              <button className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Camera className="w-8 h-8 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 pt-4 md:pt-8">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl md:text-4xl font-bold">{creator.displayName}</h1>
                    {creator.isVerified && (
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 mb-2">@{creator.username}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span>{formatNumber(creator.subscriberCount)} abonnés</span>
                    <span>•</span>
                    <span>{creator.videoCount} vidéos</span>
                    <span>•</span>
                    <span>{formatNumber(creator.totalViews)} vues</span>
                  </div>
                </div>

                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-300 mb-4 max-w-2xl">{creator.bio}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSubscribe}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                    isSubscribed
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isSubscribed ? 'Abonné' : "S'abonner"}
                </button>

                {isSubscribed && (
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-full font-semibold transition-colors flex items-center gap-2"
                  >
                    {notificationsEnabled ? (
                      <>
                        <Bell className="w-4 h-4" />
                        Toutes
                      </>
                    ) : (
                      <>
                        <BellOff className="w-4 h-4" />
                        Aucune
                      </>
                    )}
                  </button>
                )}

                <button className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-full font-semibold transition-colors flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Soutenir
                </button>

                <button className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-full font-semibold transition-colors flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Tabs */}
          <div className="border-b border-gray-800 mb-6 -mx-4 md:mx-0">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide px-4 md:px-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-6 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-red-600 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="pb-12">
            {activeTab === 'videos' && <VideosTab />}
            {activeTab === 'shorts' && <ShortsTab />}
            {activeTab === 'live' && <LiveTab />}
            {activeTab === 'releases' && <ReleasesTab />}
            {activeTab === 'playlists' && <PlaylistsTab />}
            {activeTab === 'posts' && <PostsTab />}
            {activeTab === 'about' && <AboutTab creator={creator} />}
          </div>
        </div>
      </div>
    </>
  );
}

// Videos Tab
function VideosTab() {
  const videos = [
    {
      id: '1',
      title: 'Comment créer du contenu authentique',
      thumbnail: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=500',
      views: 12450,
      uploadedAt: 'Il y a 2 jours',
      duration: '12:34'
    },
    {
      id: '2',
      title: 'Les secrets d\'une bonne miniature',
      thumbnail: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=500',
      views: 8230,
      uploadedAt: 'Il y a 1 semaine',
      duration: '8:45'
    },
    {
      id: '3',
      title: 'Tutoriel production musicale avancée',
      thumbnail: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=500',
      views: 15670,
      uploadedAt: 'Il y a 2 semaines',
      duration: '24:18'
    },
    {
      id: '4',
      title: 'Mon setup studio 2024',
      thumbnail: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=500',
      views: 9820,
      uploadedAt: 'Il y a 3 semaines',
      duration: '15:22'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Vidéos récentes</h2>
        <div className="flex gap-2">
          <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="cursor-pointer group">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-90 px-2 py-1 rounded text-xs font-semibold">
                {video.duration}
              </div>
            </div>
            <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
              {video.title}
            </h3>
            <p className="text-xs text-gray-400">
              {video.views.toLocaleString()} vues • {video.uploadedAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shorts Tab
function ShortsTab() {
  const shorts = [
    {
      id: '1',
      thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300&h=500',
      views: 45000,
      title: 'Quick beat making'
    },
    {
      id: '2',
      thumbnail: 'https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=300&h=500',
      views: 67000,
      title: 'Studio tour'
    },
    {
      id: '3',
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=500',
      views: 89000,
      title: 'Music tips'
    },
    {
      id: '4',
      thumbnail: 'https://images.pexels.com/photos/1649690/pexels-photo-1649690.jpeg?auto=compress&cs=tinysrgb&w=300&h=500',
      views: 34000,
      title: 'Behind the scenes'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Shorts</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {shorts.map((short) => (
          <div key={short.id} className="cursor-pointer group">
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden">
              <img
                src={short.thumbnail}
                alt={short.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-semibold text-sm mb-1 line-clamp-2">
                  {short.title}
                </p>
                <p className="text-white text-xs">
                  {(short.views / 1000).toFixed(0)}K vues
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Live Tab
function LiveTab() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Lives</h2>
      <div className="bg-gray-900 rounded-lg p-12 text-center">
        <Radio className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Aucun live disponible pour le moment</p>
        <p className="text-gray-500 text-sm mt-2">Abonnez-vous pour être notifié du prochain live</p>
      </div>
    </div>
  );
}

// Releases Tab
function ReleasesTab() {
  const releases = [
    {
      id: '1',
      title: 'Summer Vibes 2024',
      type: 'Album',
      thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
      date: 'Il y a 1 mois',
      tracks: 12
    },
    {
      id: '2',
      title: 'Midnight Sessions',
      type: 'EP',
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      date: 'Il y a 3 mois',
      tracks: 6
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Sorties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {releases.map((release) => (
          <div key={release.id} className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer group hover:bg-gray-800 transition-colors">
            <img
              src={release.thumbnail}
              alt={release.title}
              className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
            />
            <div className="p-4">
              <span className="text-xs text-gray-400 uppercase font-semibold">{release.type}</span>
              <h3 className="font-bold text-lg mt-1 mb-2">{release.title}</h3>
              <p className="text-sm text-gray-400">{release.tracks} titres • {release.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Playlists Tab
function PlaylistsTab() {
  const playlists = [
    {
      id: '1',
      title: 'Best of 2024',
      thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
      videoCount: 24,
      isPublic: true
    },
    {
      id: '2',
      title: 'Tutorials',
      thumbnail: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=300',
      videoCount: 18,
      isPublic: true
    },
    {
      id: '3',
      title: 'Behind the Scenes',
      thumbnail: 'https://images.pexels.com/photos/1649690/pexels-photo-1649690.jpeg?auto=compress&cs=tinysrgb&w=300',
      videoCount: 12,
      isPublic: true
    },
    {
      id: '4',
      title: 'Collaborations',
      thumbnail: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=300',
      videoCount: 8,
      isPublic: true
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Playlists créées</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="cursor-pointer group">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-gray-900">
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center">
                  <List className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm font-semibold">{playlist.videoCount} vidéos</p>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-sm mb-1 group-hover:text-red-500 transition-colors">
              {playlist.title}
            </h3>
            <p className="text-xs text-gray-400">
              {playlist.isPublic ? 'Publique' : 'Privée'} • Voir la playlist complète
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Posts Tab
function PostsTab() {
  const posts = [
    {
      id: '1',
      content: 'Nouveau beat en cours de production ! 🔥 Sortie prévue la semaine prochaine. Restez connectés !',
      image: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg?auto=compress&cs=tinysrgb&w=600',
      likes: 2340,
      comments: 145,
      postedAt: 'Il y a 2 heures'
    },
    {
      id: '2',
      content: 'Merci pour les 80K abonnés ! 🎉 Session live ce soir à 20h pour célébrer ça avec vous !',
      likes: 5670,
      comments: 432,
      postedAt: 'Il y a 1 jour'
    },
    {
      id: '3',
      content: 'Petit aperçu de mon nouveau setup studio. Qu\'en pensez-vous ?',
      image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=600',
      likes: 1890,
      comments: 87,
      postedAt: 'Il y a 3 jours'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Posts de la communauté</h2>
      <div className="space-y-4 max-w-2xl">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-900 rounded-lg p-6">
            <p className="text-gray-300 mb-3">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full rounded-lg mb-4"
              />
            )}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
                {post.likes.toLocaleString()}
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                <MessageSquare className="w-4 h-4" />
                {post.comments}
              </button>
              <span className="ml-auto">{post.postedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// About Tab
function AboutTab({ creator }: any) {
  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Description */}
        <div>
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="text-gray-300 mb-6">{creator.bio}</p>

          <h3 className="font-bold mb-3">Statistiques</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Membre depuis</span>
              <span className="text-white">{new Date(creator.joinedDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Vues totales</span>
              <span className="text-white">{creator.totalViews.toLocaleString()} vues</span>
            </div>
            <div className="flex justify-between">
              <span>Pays</span>
              <span className="text-white">France</span>
            </div>
          </div>
        </div>

        {/* Links & Details */}
        <div>
          <h2 className="text-xl font-bold mb-4">Liens</h2>
          <div className="space-y-3">
            {creator.links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{link.name}</p>
                  <p className="text-xs text-gray-400">{link.url}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-bold mb-3">Contact</h3>
            <p className="text-sm text-gray-400">
              Pour toute demande professionnelle, contactez-moi via mes réseaux sociaux ou mon site web.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
