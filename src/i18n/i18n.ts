import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../locales/en/common.json';
import frCommon from '../locales/fr/common.json';
import esCommon from '../locales/es/common.json';
import ptCommon from '../locales/pt/common.json';
import arCommon from '../locales/ar/common.json';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const resources = {
  en: { common: enCommon },
  fr: { common: frCommon },
  es: { common: esCommon },
  pt: { common: ptCommon },
  ar: { common: arCommon }
} as const;

export type SupportedLanguage = keyof typeof resources;

export const SUPPORTED_LANGUAGES: Array<{
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
];

export const isRTL = (language: string): boolean => {
  return RTL_LANGUAGES.includes(language);
};

export const updateDocumentDirection = (language: string): void => {
  const dir = isRTL(language) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = language;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  });

i18n.on('languageChanged', (lng) => {
  updateDocumentDirection(lng);
});

updateDocumentDirection(i18n.language);

export default i18n;
