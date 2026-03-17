import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/i18n';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = SUPPORTED_LANGUAGES.find(
    lang => lang.code === i18n.language
  ) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = async (languageCode: SupportedLanguage) => {
    if (languageCode === i18n.language) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);

    try {
      await i18n.changeLanguage(languageCode);

      if (user) {
        await supabase
          .from('user_profiles')
          .update({ language_preference: languageCode })
          .eq('id', user.id);
      }

      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        aria-label="Change language"
        disabled={isChanging}
      >
        <Globe className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-300 hidden sm:inline">
          {currentLanguage.nativeName}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-white/10 z-50 overflow-hidden">
            <div className="p-2 border-b border-white/10">
              <p className="text-xs text-gray-400 px-2 py-1">Select Language</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  disabled={isChanging}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {language.nativeName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {language.name}
                    </span>
                  </div>
                  {i18n.language === language.code && (
                    <Check className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-white/10">
              <p className="text-xs text-gray-500 px-2 py-1">
                More languages coming soon
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
