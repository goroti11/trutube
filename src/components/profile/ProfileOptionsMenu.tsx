import { useState, useRef, useEffect } from 'react';
import {
  MoreVertical, Settings, Share2, Info, HelpCircle,
  Tv, Bell, Shield, Users, Database, Flag, Search
} from 'lucide-react';

interface ProfileOptionsMenuProps {
  isOwnProfile: boolean;
  onNavigate: (page: string) => void;
  onShare: () => void;
  onReport?: () => void;
}

export default function ProfileOptionsMenu({
  isOwnProfile,
  onNavigate,
  onShare,
  onReport
}: ProfileOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
      >
        <MoreVertical className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
          {isOwnProfile ? (
            <>
              <button
                onClick={() => handleOptionClick(() => onNavigate('settings'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Settings className="w-5 h-5" />
                <span>Paramètres</span>
              </button>

              <button
                onClick={() => handleOptionClick(onShare)}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Share2 className="w-5 h-5" />
                <span>Partager ma chaîne</span>
              </button>

              <div className="border-t border-gray-800 my-1"></div>

              <button
                onClick={() => handleOptionClick(() => onNavigate('edit-profile'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Users className="w-5 h-5" />
                <span>Ma communauté</span>
              </button>

              <button
                onClick={() => handleOptionClick(() => onNavigate('privacy'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Shield className="w-5 h-5" />
                <span>Confidentialité</span>
              </button>

              <button
                onClick={() => handleOptionClick(() => onNavigate('data'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Database className="w-5 h-5" />
                <span>Mes données</span>
              </button>

              <button
                onClick={() => handleOptionClick(() => onNavigate('notifications'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>

              <div className="border-t border-gray-800 my-1"></div>

              <button
                onClick={() => handleOptionClick(() => onNavigate('about'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Info className="w-5 h-5" />
                <span>À propos de la chaîne</span>
              </button>

              <button
                onClick={() => handleOptionClick(() => onNavigate('help'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Aide et commentaires</span>
              </button>

              <button
                onClick={() => handleOptionClick(() => alert('Fonctionnalité de diffusion TV à venir'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Tv className="w-5 h-5" />
                <span>Regarder sur téléviseur</span>
              </button>

              <button
                onClick={() => handleOptionClick(() => onNavigate('search'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Search className="w-5 h-5" />
                <span>Rechercher dans la chaîne</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleOptionClick(onShare)}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Share2 className="w-5 h-5" />
                <span>Partager la chaîne</span>
              </button>

              <button
                onClick={() => handleOptionClick(() => onNavigate('about'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Info className="w-5 h-5" />
                <span>À propos de la chaîne</span>
              </button>

              <button
                onClick={() => handleOptionClick(() => onNavigate('search'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Search className="w-5 h-5" />
                <span>Rechercher dans la chaîne</span>
              </button>

              <div className="border-t border-gray-800 my-1"></div>

              <button
                onClick={() => handleOptionClick(() => alert('Fonctionnalité de diffusion TV à venir'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <Tv className="w-5 h-5" />
                <span>Regarder sur téléviseur</span>
              </button>

              <button
                onClick={() => handleOptionClick(() => onNavigate('help'))}
                className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Aide et commentaires</span>
              </button>

              {onReport && (
                <>
                  <div className="border-t border-gray-800 my-1"></div>
                  <button
                    onClick={() => handleOptionClick(onReport)}
                    className="w-full px-4 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors text-left text-red-400"
                  >
                    <Flag className="w-5 h-5" />
                    <span>Signaler la chaîne</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
