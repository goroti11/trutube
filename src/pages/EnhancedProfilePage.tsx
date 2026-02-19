import { useState, useEffect } from 'react';
import {
  ArrowLeft, Edit, Star, Users, Video, Eye, Share2,
  MapPin, Calendar, Link2, ExternalLink, Bell, BellOff, Check, Heart, Play
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileEnhancedService, EnhancedProfile, SocialLink } from '../services/profileEnhancedService';
import { videoService } from '../services/videoService';
import { channelService, CreatorChannel } from '../services/channelService';
import ShareProfileModal from '../components/profile/ShareProfileModal';
import ProfileReviewsSection from '../components/profile/ProfileReviewsSection';
import ProfileOptionsMenu from '../components/profile/ProfileOptionsMenu';
import SupportCreatorModal from '../components/SupportCreatorModal';
import SupportLeaderboardSection from '../components/SupportLeaderboardSection';
import VideoCard from '../components/VideoCard';
import PremiumBadge from '../components/PremiumBadge';

interface EnhancedProfilePageProps {
  userId?: string;
  onNavigate: (page: string, data?: any) => void;
}

export default function EnhancedProfilePage({ userId, onNavigate }: EnhancedProfilePageProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EnhancedProfile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [channels, setChannels] = useState<CreatorChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'channels' | 'about' | 'reviews' | 'supporters'>('videos');

  const isOwnProfile = !userId || userId === user?.id;
  const profileId = userId || user?.id || '';

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profileData = await profileEnhancedService.getEnhancedProfile(profileId);
      if (profileData) {
        setProfile(profileData);
      }

      const links = await profileEnhancedService.getSocialLinks(profileId);
      setSocialLinks(links);

      const videoData = await videoService.getVideosByCreator(profileId);
      setVideos(videoData);

      const channelsData = await channelService.getChannels(profileId);
      setChannels(channelsData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribed(!isSubscribed);
  };

  const getPlatformIcon = (platform: string) => {
    return <Link2 className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Profil non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 bg-gray-950 bg-opacity-95 backdrop-blur border-b border-gray-800 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{profile.display_name}</h1>
              <p className="text-sm text-gray-400">@{profile.username}</p>
            </div>
          </div>
          <ProfileOptionsMenu
            isOwnProfile={isOwnProfile}
            onNavigate={onNavigate}
            onShare={() => setShowShareModal(true)}
            onReport={() => alert('Signaler la chaîne')}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="relative h-64 bg-gradient-to-r from-primary-500/20 to-accent-500/20">
          {profile.banner_url && (
            <img
              src={profile.banner_url}
              alt="Bannière"
              className="w-full h-full object-cover"
            />
          )}
          {isOwnProfile && (
            <button
              onClick={() => onNavigate('edit-profile')}
              className="absolute top-4 right-4 px-4 py-2 bg-gray-900/90 hover:bg-gray-800 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          )}
        </div>

        <div className="px-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-20 relative z-10">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 bg-gray-800 rounded-full border-4 border-gray-950 overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
                    {profile.display_name?.[0] || '?'}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 mt-4 md:mt-16">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold">{profile.display_name}</h2>
                    {profile.is_premium && (
                      <PremiumBadge tier="premium" size="md" />
                    )}
                  </div>
                  <p className="text-gray-400 mb-2">@{profile.username}</p>
                  {profile.average_rating > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{profile.average_rating.toFixed(1)}</span>
                      </div>
                      <span className="text-gray-400">({profile.total_reviews} avis)</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {!isOwnProfile ? (
                    <>
                      <button
                        onClick={handleSubscribe}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                          isSubscribed
                            ? 'bg-gray-800 hover:bg-gray-700'
                            : 'bg-primary-500 hover:bg-primary-600'
                        }`}
                      >
                        {isSubscribed ? (
                          <>
                            <Check className="w-5 h-5" />
                            Abonné
                          </>
                        ) : (
                          'S\'abonner'
                        )}
                      </button>
                      <button
                        onClick={handleSubscribe}
                        className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                      >
                        {isSubscribed ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => setShowSupportModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-pink-500/20"
                      >
                        <Heart className="w-5 h-5" />
                        Soutenir
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onNavigate('edit-profile')}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-5 h-5" />
                      Modifier le profil
                    </button>
                  )}
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span><strong>{profile.subscriber_count || 0}</strong> abonnés</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-gray-400" />
                  <span><strong>{profile.video_count || 0}</strong> vidéos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>

              {profile.bio && (
                <p className="text-gray-300 mb-4">{profile.bio}</p>
              )}

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-750 rounded-lg flex items-center gap-2 text-sm transition-colors"
                    >
                      {getPlatformIcon(link.platform)}
                      <span className="capitalize">{link.platform}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-b border-gray-800 mt-8 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('videos')}
                className={`pb-4 font-semibold transition-colors border-b-2 ${
                  activeTab === 'videos'
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Vidéos
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                className={`pb-4 font-semibold transition-colors border-b-2 ${
                  activeTab === 'channels'
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Chaînes ({channels.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-4 font-semibold transition-colors border-b-2 ${
                  activeTab === 'about'
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                À propos
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 font-semibold transition-colors border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Avis ({profile.total_reviews})
              </button>
              {!isOwnProfile && (
                <button
                  onClick={() => setActiveTab('supporters')}
                  className={`pb-4 font-semibold transition-colors border-b-2 ${
                    activeTab === 'supporters'
                      ? 'border-primary-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Supporters
                </button>
              )}
            </div>
          </div>

          <div className="pb-12">
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune vidéo publiée</p>
                  </div>
                ) : (
                  videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onClick={() => onNavigate('video', { videoId: video.id })}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'channels' && (
              <div className="space-y-4">
                {channels.length === 0 ? (
                  <div className="text-center py-12 bg-gray-900 rounded-xl">
                    <Play className="w-12 h-12 mx-auto mb-3 opacity-50 text-gray-400" />
                    <p className="text-gray-400 mb-4">Aucune chaîne créée</p>
                    {isOwnProfile && (
                      <button
                        onClick={() => onNavigate('creator-setup')}
                        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        Créer une chaîne
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {channels.map((channel) => (
                      <div
                        key={channel.id}
                        onClick={() => onNavigate('channel', { channelId: channel.id })}
                        className="bg-gray-900 hover:bg-gray-850 rounded-xl overflow-hidden cursor-pointer transition-all group"
                      >
                        <div className="relative h-32 bg-gradient-to-r from-primary-500/20 to-accent-500/20">
                          {channel.banner_url ? (
                            <img
                              src={channel.banner_url}
                              alt={channel.channel_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-12 h-12 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              {channel.avatar_url ? (
                                <img
                                  src={channel.avatar_url}
                                  alt={channel.channel_name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400">
                                  {channel.channel_name[0]}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg truncate group-hover:text-primary-400 transition-colors">
                                  {channel.channel_name}
                                </h3>
                                {channel.is_verified && (
                                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                                {channel.description || 'Aucune description'}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{channel.subscriber_count.toLocaleString()} abonnés</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  <span>{channel.video_count} vidéos</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{(channel.total_views / 1000000).toFixed(1)}M vues</span>
                                </div>
                              </div>
                              {channel.channel_type && (
                                <div className="mt-2">
                                  <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded-full border border-primary-500/30 capitalize">
                                    {channel.channel_type}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {isOwnProfile && channels.length > 0 && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => onNavigate('my-channels')}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Gérer mes chaînes
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Description</h3>
                {profile.about ? (
                  <p className="text-gray-300 whitespace-pre-line">{profile.about}</p>
                ) : (
                  <p className="text-gray-400">Aucune description</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProfileReviewsSection
                profileId={profileId}
                isOwnProfile={isOwnProfile}
              />
            )}

            {activeTab === 'supporters' && !isOwnProfile && (
              <SupportLeaderboardSection creatorId={profileId} />
            )}
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareProfileModal
          profileId={profileId}
          channelUrl={profile.channel_url || profile.username}
          displayName={profile.display_name}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showSupportModal && (
        <SupportCreatorModal
          creatorId={profileId}
          creatorName={profile.display_name}
          creatorAvatar={profile.avatar_url}
          onClose={() => setShowSupportModal(false)}
          onSuccess={() => {
            setShowSupportModal(false);
            loadProfile();
          }}
        />
      )}
    </div>
  );
}
