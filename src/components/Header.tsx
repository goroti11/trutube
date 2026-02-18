import { useState } from 'react';
import { Upload, LogIn, Compass, Settings, Sparkles, User, LogOut, ChevronDown, HelpCircle, Play, Users, Wallet, Crown, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  showNavigation?: boolean;
}

export default function Header({ onNavigate, showNavigation = true }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
    return 'Utilisateur';
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
                  onClick={() => onNavigate('universes')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Explore Universes"
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
                  onClick={() => onNavigate('preferences')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Feed Preferences"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('creator-setup')}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Creator Setup"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              </>
            )}

            {user && (
              <button
                onClick={() => onNavigate?.('trucoin-wallet')}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg font-bold transition-all shadow-md"
                title="TruCoin Wallet"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden md:inline text-sm">TruCoins</span>
              </button>
            )}

            <button
              onClick={() => onNavigate?.('premium')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold transition-all shadow-lg"
              title="TruTube Premium"
            >
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Premium</span>
            </button>

            {user && (
              <button
                onClick={() => onNavigate?.('upload')}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
                >
                  {getUserAvatar() ? (
                    <img
                      src={getUserAvatar()!}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm">{getUserDisplayName()}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                      <div className="p-3 border-b border-gray-700">
                        <p className="text-sm text-white font-medium">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            onNavigate?.('my-profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Mon profil
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.('trucoin-wallet');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700 flex items-center gap-2 font-semibold"
                        >
                          <Wallet className="w-4 h-4" />
                          TruCoin Wallet
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.('dashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Dashboard créateur
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.('studio');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2 font-semibold"
                        >
                          <Play className="w-4 h-4" />
                          TruTube Studio
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.('premium-offers');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-gray-700 flex items-center gap-2 font-semibold"
                        >
                          <Crown className="w-4 h-4" />
                          Gérer Premium
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.('settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Paramètres
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.('security-dashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Sécurité
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.('preferences');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Préférences de feed
                        </button>
                        <button
                          onClick={() => {
                            onNavigate?.('help');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Centre d'aide
                        </button>
                      </div>
                      <div className="border-t border-gray-700 py-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate?.('auth')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors border border-gray-700"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Connexion</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
