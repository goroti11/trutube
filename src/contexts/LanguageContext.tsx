import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language =
  | 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko'
  | 'ar' | 'hi' | 'bn' | 'tr' | 'nl' | 'pl' | 'sv' | 'no' | 'da' | 'fi'
  | 'cs' | 'el' | 'he' | 'th' | 'vi' | 'id' | 'ms' | 'tl' | 'uk' | 'ro';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('trutube_language');
    if (saved) return saved as Language;

    const browserLang = navigator.language.split('-')[0];
    const supportedLangs: Language[] = [
      'fr', 'en', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko',
      'ar', 'hi', 'bn', 'tr', 'nl', 'pl', 'sv', 'no', 'da', 'fi',
      'cs', 'el', 'he', 'th', 'vi', 'id', 'ms', 'tl', 'uk', 'ro'
    ];

    return supportedLangs.includes(browserLang as Language) ? (browserLang as Language) : 'en';
  });

  const [translations, setTranslations] = useState<Record<string, string>>({});

  const languages = [
    { code: 'fr' as Language, name: 'French', nativeName: 'Français' },
    { code: 'en' as Language, name: 'English', nativeName: 'English' },
    { code: 'es' as Language, name: 'Spanish', nativeName: 'Español' },
    { code: 'de' as Language, name: 'German', nativeName: 'Deutsch' },
    { code: 'it' as Language, name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt' as Language, name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru' as Language, name: 'Russian', nativeName: 'Русский' },
    { code: 'zh' as Language, name: 'Chinese', nativeName: '中文' },
    { code: 'ja' as Language, name: 'Japanese', nativeName: '日本語' },
    { code: 'ko' as Language, name: 'Korean', nativeName: '한국어' },
    { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn' as Language, name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'tr' as Language, name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'nl' as Language, name: 'Dutch', nativeName: 'Nederlands' },
    { code: 'pl' as Language, name: 'Polish', nativeName: 'Polski' },
    { code: 'sv' as Language, name: 'Swedish', nativeName: 'Svenska' },
    { code: 'no' as Language, name: 'Norwegian', nativeName: 'Norsk' },
    { code: 'da' as Language, name: 'Danish', nativeName: 'Dansk' },
    { code: 'fi' as Language, name: 'Finnish', nativeName: 'Suomi' },
    { code: 'cs' as Language, name: 'Czech', nativeName: 'Čeština' },
    { code: 'el' as Language, name: 'Greek', nativeName: 'Ελληνικά' },
    { code: 'he' as Language, name: 'Hebrew', nativeName: 'עברית' },
    { code: 'th' as Language, name: 'Thai', nativeName: 'ไทย' },
    { code: 'vi' as Language, name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'id' as Language, name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    { code: 'ms' as Language, name: 'Malay', nativeName: 'Bahasa Melayu' },
    { code: 'tl' as Language, name: 'Filipino', nativeName: 'Filipino' },
    { code: 'uk' as Language, name: 'Ukrainian', nativeName: 'Українська' },
    { code: 'ro' as Language, name: 'Romanian', nativeName: 'Română' }
  ];

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const module = await import(`../locales/${language}.ts`);
        setTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        const fallback = await import('../locales/en.ts');
        setTranslations(fallback.default);
      }
    };

    loadTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('trutube_language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
