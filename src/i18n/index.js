import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language files
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';
import knTranslations from '../locales/kn.json';

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  kn: {
    translation: knTranslations
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],

    // React specific options
    react: {
      useSuspense: false,
    },
  });

export default i18n;
