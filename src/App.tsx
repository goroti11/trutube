import { useState, useEffect } from 'react';
import Header from './components/Header';
import { Footer } from './components/Footer';
import HomePage from './pages/HomePage';
import UniverseViewPage from './pages/UniverseViewPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import ProfilePage from './pages/ProfilePage';
import { UserProfilePage } from './pages/UserProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import UniverseBrowsePage from './pages/UniverseBrowsePage';
import CreatorSetupPage from './pages/CreatorSetupPage';
import FeedPreferencesPage from './pages/FeedPreferencesPage';
import { AuthPage } from './pages/AuthPage';
import { SettingsPage } from './pages/SettingsPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SupportPage } from './pages/SupportPage';
import { AboutPage } from './pages/AboutPage';
import AdCampaignPage from './pages/AdCampaignPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { LegalPage } from './pages/LegalPage';
import { LoadingScreen } from './components/LoadingScreen';
import SplashScreen from './components/SplashScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Video, User } from './types';
import { users } from './data/mockData';
import MobileVideoPage from './pages/MobileVideoPage';
import VideoUploadPage from './pages/VideoUploadPage';
import CreatorDashboardV2Page from './pages/CreatorDashboardV2Page';
import CreatorStudioPage from './pages/CreatorStudioPage';
import WatchPage from './pages/WatchPage';
import PartnerProgramPage from './pages/PartnerProgramPage';
import CommunityListPage from './pages/CommunityListPage';
import CommunityPage from './pages/CommunityPage';
import CreatePostPage from './pages/CreatePostPage';
import CreateCommunityPage from './pages/CreateCommunityPage';
import CommunitySettingsPage from './pages/CommunitySettingsPage';
import TruCoinWalletPage from './pages/TruCoinWalletPage';
import PremiumPage from './pages/PremiumPage';
import MyProfileTestPage from './pages/MyProfileTestPage';
import GlobalMiniPlayer from './components/video/GlobalMiniPlayer';
import { usePlayerStore } from './store/playerStore';
import EnhancedCreatorProfilePage from './pages/EnhancedCreatorProfilePage';
import WatchHistoryPage from './pages/WatchHistoryPage';
import SubscribersPage from './pages/SubscribersPage';
import PremiumOffersPage from './pages/PremiumOffersPage';
import CommunityPremiumPricingPage from './pages/CommunityPremiumPricingPage';
import AppearanceSettingsPage from './pages/AppearanceSettingsPage';
import SecurityDashboardPage from './pages/SecurityDashboardPage';
import LiveStreamingPage from './pages/LiveStreamingPage';

type Page = 'home' | 'universe' | 'video' | 'watch' | 'profile' | 'my-profile' | 'subscription' | 'universes' | 'creator-setup' | 'preferences' | 'auth' | 'upload' | 'dashboard' | 'creator-dashboard' | 'studio' | 'studio-v3' | 'ad-campaign' | 'settings' | 'terms' | 'privacy' | 'support' | 'about' | 'help' | 'legal' | 'mobile-demo' | 'partner-program' | 'community' | 'community-view' | 'create-post' | 'trucoin-wallet' | 'premium' | 'premium-offers' | 'community-premium-pricing' | 'appearance-settings' | 'create-community' | 'community-settings' | 'profile-test' | 'enhanced-profile' | 'watch-history' | 'subscribers' | 'security-dashboard' | 'live-streaming';

export const navigate = (page: string) => {
  window.location.hash = page;
};

function AppContent() {
  const { loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [communitySlug, setCommunitySlug] = useState<string | null>(null);
  const [postCommunitySlug, setPostCommunitySlug] = useState<string | null>(null);
  const [settingsCommunitySlug, setSettingsCommunitySlug] = useState<string | null>(null);

  const { setIsMiniPlayer, currentVideo } = usePlayerStore();

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);

      if (hash === 'mobile') {
        setCurrentPage('mobile-demo');
        setShowSplash(false);
        return;
      }

      if (hash.startsWith('community/')) {
        const slug = hash.split('/')[1];
        if (slug) {
          setCommunitySlug(slug);
          setCurrentPage('community-view');
          setShowSplash(false);
        }
        return;
      }

      if (hash.startsWith('create-post/')) {
        const slug = hash.split('/')[1];
        if (slug) {
          setPostCommunitySlug(slug);
          setCurrentPage('create-post');
          setShowSplash(false);
        }
        return;
      }

      if (hash === 'community') {
        setCurrentPage('community');
        setCommunitySlug(null);
        setShowSplash(false);
        return;
      }

      if (hash === 'create-community') {
        setCurrentPage('create-community');
        setShowSplash(false);
        return;
      }

      if (hash === 'profile-test') {
        setCurrentPage('profile-test');
        setShowSplash(false);
        return;
      }

      if (hash.startsWith('community-settings/')) {
        const slug = hash.split('/')[1];
        if (slug) {
          setSettingsCommunitySlug(slug);
          setCurrentPage('community-settings');
          setShowSplash(false);
        }
        return;
      }

      // Handle generic page routes
      const pageMap: Record<string, Page> = {
        'premium': 'premium',
        'auth': 'auth',
        'settings': 'settings',
        'trucoin-wallet': 'trucoin-wallet',
        'partner-program': 'partner-program',
        'upload': 'upload',
        'dashboard': 'dashboard',
        'creator-dashboard': 'creator-dashboard',
        'studio': 'studio',
        'studio-v3': 'studio-v3',
        'ad-campaign': 'ad-campaign',
        'premium-offers': 'premium-offers',
        'community-premium-pricing': 'community-premium-pricing',
        'appearance-settings': 'appearance-settings',
        'security-dashboard': 'security-dashboard',
        'terms': 'terms',
        'privacy': 'privacy',
        'support': 'support',
        'about': 'about',
        'help': 'help',
        'legal': 'legal',
        'subscription': 'subscription',
        'universes': 'universes',
        'creator-setup': 'creator-setup',
        'preferences': 'preferences',
        'my-profile': 'my-profile',
        'enhanced-profile': 'enhanced-profile',
        'watch-history': 'watch-history',
        'subscribers': 'subscribers',
      };

      if (hash in pageMap) {
        setCurrentPage(pageMap[hash]);
        setShowSplash(false);
        return;
      }

      // Handle routes with parameters
      if (hash.startsWith('universe/')) {
        const universeId = hash.split('/')[1];
        if (universeId) {
          setSelectedUniverse(universeId);
          setCurrentPage('universe');
          setShowSplash(false);
        }
        return;
      }

      if (hash.startsWith('watch/')) {
        const videoId = hash.split('/')[1];
        if (videoId) {
          setSelectedVideoId(videoId);
          setCurrentPage('watch');
          setShowSplash(false);
        }
        return;
      }

      if (hash.startsWith('profile/')) {
        const username = hash.split('/')[1];
        if (username) {
          setCurrentPage('profile');
          setShowSplash(false);
        }
        return;
      }

      // Default to home if no match
      if (hash === '' || hash === 'home') {
        setCurrentPage('home');
        setShowSplash(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle MiniPlayer when leaving watch page
  useEffect(() => {
    if (currentPage !== 'watch' && currentVideo && currentPage !== 'mobile-demo') {
      setIsMiniPlayer(true);
    } else if (currentPage === 'watch') {
      setIsMiniPlayer(false);
    }
  }, [currentPage, currentVideo, setIsMiniPlayer]);

  if (currentPage === 'mobile-demo') {
    return <MobileVideoPage />;
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  const handleUniverseClick = (universeId: string) => {
    setSelectedUniverse(universeId);
    setCurrentPage('universe');
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setSelectedVideoId(video.id);
    setCurrentPage('watch');
  };

  const handleProfileClick = (user: User) => {
    setSelectedUser(user);
    setCurrentPage('profile');
  };

  const handleSupportClick = (user: User) => {
    setSelectedUser(user);
    setCurrentPage('subscription');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedUniverse(null);
    setSelectedVideo(null);
    setSelectedUser(null);
  };

  const handleBackToUniverse = () => {
    setCurrentPage('universe');
    setSelectedVideo(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {currentPage === 'auth' && <AuthPage />}

      {currentPage === 'studio' && (
        <CreatorStudioPage onNavigate={(page) => setCurrentPage(page as Page)} />
      )}

      {currentPage === 'live-streaming' && (
        <LiveStreamingPage onNavigate={(page) => setCurrentPage(page as Page)} />
      )}

      {currentPage === 'partner-program' && <PartnerProgramPage />}

        {currentPage === 'home' && (
          <>
            <Header
              onNavigate={(page) => setCurrentPage(page as Page)}
              showNavigation={false}
            />
            <HomePage onUniverseClick={handleUniverseClick} />
          </>
        )}

        {currentPage === 'universe' && selectedUniverse && (
          <>
            <Header
              onNavigate={(page) => setCurrentPage(page as Page)}
              showNavigation={true}
            />
            <UniverseViewPage
              universeId={selectedUniverse}
              onBack={handleBackToHome}
              onVideoClick={handleVideoClick}
            />
          </>
        )}

        {currentPage === 'watch' && selectedVideoId && (
          <WatchPage
            videoId={selectedVideoId}
            onNavigate={(page, data) => {
              if (page === 'watch' && data?.videoId) {
                setSelectedVideoId(data.videoId);
              } else if (page === 'profile' && data?.userId) {
                setCurrentPage('my-profile');
              } else {
                setCurrentPage(page as Page);
              }
            }}
          />
        )}

        {currentPage === 'video' && selectedVideo && (
          <VideoPlayerPage
            video={selectedVideo}
            relatedVideos={[]}
            onBack={selectedUniverse ? handleBackToUniverse : handleBackToHome}
            onVideoClick={(videoId) => {
              setSelectedVideoId(videoId);
              setCurrentPage('watch');
            }}
            onNavigateHome={handleBackToHome}
          />
        )}

        {currentPage === 'profile' && selectedUser && (
          <ProfilePage
            user={selectedUser}
            onBack={handleBackToHome}
            onVideoClick={handleVideoClick}
            onSupportClick={() => handleSupportClick(selectedUser)}
          />
        )}

        {currentPage === 'my-profile' && (
          <UserProfilePage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'subscription' && selectedUser && (
          <SubscriptionPage user={selectedUser} onBack={handleBackToHome} />
        )}

        {currentPage === 'universes' && <UniverseBrowsePage />}

        {currentPage === 'creator-setup' && <CreatorSetupPage />}

        {currentPage === 'preferences' && <FeedPreferencesPage />}

        {currentPage === 'upload' && (
          <VideoUploadPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {(currentPage === 'dashboard' || currentPage === 'creator-dashboard') && (
          <CreatorDashboardV2Page onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'ad-campaign' && <AdCampaignPage />}

        {currentPage === 'settings' && (
          <SettingsPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'terms' && (
          <TermsPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'support' && (
          <SupportPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'help' && (
          <HelpCenterPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'legal' && (
          <LegalPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'community' && <CommunityListPage />}

        {currentPage === 'community-view' && communitySlug && (
          <CommunityPage slug={communitySlug} />
        )}

        {currentPage === 'create-post' && postCommunitySlug && (
          <CreatePostPage slug={postCommunitySlug} />
        )}

        {currentPage === 'create-community' && <CreateCommunityPage />}

        {currentPage === 'community-settings' && settingsCommunitySlug && (
          <CommunitySettingsPage slug={settingsCommunitySlug} />
        )}

        {currentPage === 'trucoin-wallet' && <TruCoinWalletPage />}

        {currentPage === 'premium' && <PremiumPage />}

        {currentPage === 'profile-test' && <MyProfileTestPage />}

        {currentPage === 'enhanced-profile' && (
          <EnhancedCreatorProfilePage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'watch-history' && (
          <WatchHistoryPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'subscribers' && (
          <SubscribersPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'premium-offers' && (
          <PremiumOffersPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'community-premium-pricing' && (
          <CommunityPremiumPricingPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'appearance-settings' && (
          <AppearanceSettingsPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {currentPage === 'security-dashboard' && (
          <SecurityDashboardPage onNavigate={(page) => setCurrentPage(page as Page)} />
        )}

        {/* Global MiniPlayer */}
        {currentVideo && currentPage !== 'watch' && currentPage !== 'mobile-demo' && (
          <GlobalMiniPlayer
            onNavigateToPlayer={() => {
              if (currentVideo.id) {
                setSelectedVideoId(currentVideo.id);
                setCurrentPage('watch');
              }
            }}
          />
        )}

        {currentPage !== 'auth' && currentPage !== 'video' && currentPage !== 'watch' && (
          <Footer onNavigate={(page) => setCurrentPage(page as Page)} />
        )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
