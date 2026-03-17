import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, LogIn, Compass, Settings, Sparkles, User, LogOut, ChevronDown, HelpCircle, Play, Users, Wallet, Crown, Shield, MoreVertical, Book, Briefcase, Info, MessageCircle, Gamepad2, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import NotificationCenter from './NotificationCenter';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  showNavigation?: boolean;
}

export default function Header({ onNavigate, showNavigation = true }: HeaderProps) {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.username) {
      return user.user_metadata.username;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserAvatar = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    return null;
  };

  return (
    <header className="bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate?.('home')}
            className="hover:opacity-80 transition-opacity"
          >
            <Logo size="sm" showText={true} />
          </button>

          <div className="flex items-center gap-3">
            {showNavigation && onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('explore')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title={t('navigation.explore')}
                >
                  <Compass className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('community')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Community"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('gaming-hub')}
                  className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  title={t('navigation.gaming')}
                >
                  <Gamepad2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('legends-ranking')}
                  className="flex items-center gap-2 px-3 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 rounded-lg transition-colors"
                  title={t('navigation.legend')}
                >
                  <Trophy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('preferences')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Feed Preferences"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('creator-setup')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title={t('navigation.creator_studio')}
                >
                  <Sparkles className="w-5 h-5" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title={t('common.more')}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {showMoreMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMoreMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                        <div className="py-2">
                          <button
                            onClick={() => {
                              onNavigate('about');
                              setShowMoreMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Info className="w-4 h-4" />
                            About
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('resources');
                              setShowMoreMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Book className="w-4 h-4" />
                            Resources
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('careers');
                              setShowMoreMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Briefcase className="w-4 h-4" />
                            Careers
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('enterprise');
                              setShowMoreMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Briefcase className="w-4 h-4" />
                            Enterprise
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('help');
                              setShowMoreMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                          >
                            <HelpCircle className="w-4 h-4" />
                            Help Center
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('support');
                              setShowMoreMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Support
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <LanguageSwitcher />

            {user && (
              <>
                <NotificationCenter onNavigate={onNavigate} />
                <button
                  onClick={() => onNavigate?.('trucoin-wallet')}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg font-bold transition-all shadow-md"
                  title="TruCoin Wallet"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden md:inline text-sm">TruCoins</span>
                </button>
              </>
            )}

            <button
              onClick={() => onNavigate?.('premium')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold transition-all shadow-lg"
              title="Goroti Premium"
            >
              <Crown className="w-5 h-5" />
              <span className="hidden md:inline">{t('navigation.premium')}</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {getUserAvatar() ? (
                    <img
                      src={getUserAvatar()!}
                      alt={getUserDisplayName()}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                      <div className="p-3 border-b border-gray-700">
                        <p className="font-medium text-white">{getUserDisplayName()}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            onNavigate?.('my-profile-test');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          {t('settings.profile')}
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.('creator-studio');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          {t('navigation.creator_studio')}
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.('settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          {t('navigation.settings')}
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('auth.sign_out')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate?.('auth')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('auth.sign_in')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
