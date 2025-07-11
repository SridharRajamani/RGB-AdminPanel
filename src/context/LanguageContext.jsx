import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Available languages
export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
];

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Initialize language from localStorage or default
  useEffect(() => {
    const savedLanguage = localStorage.getItem('rotary_language') || 'en';
    setCurrentLanguage(savedLanguage);
    if (savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Change language function
  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('rotary_language', langCode);
    i18n.changeLanguage(langCode);
  };

  // Get language info
  const getLanguageInfo = (langCode = i18n.language) => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === langCode) || AVAILABLE_LANGUAGES[0];
  };

  // Check if language is RTL (Right-to-Left)
  const isRTL = () => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(i18n.language);
  };

  // Format number based on language locale
  const formatNumber = (number, options = {}) => {
    const locale = getLocaleFromLanguage(i18n.language);
    return new Intl.NumberFormat(locale, options).format(number);
  };

  // Format date based on language locale
  const formatDate = (date, options = {}) => {
    const locale = getLocaleFromLanguage(i18n.language);
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
  };

  // Get locale string from language code
  const getLocaleFromLanguage = (langCode) => {
    const localeMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'kn': 'kn-IN'
    };
    return localeMap[langCode] || 'en-IN';
  };

  // Get text direction
  const getTextDirection = () => {
    return isRTL() ? 'rtl' : 'ltr';
  };

  const value = {
    currentLanguage: currentLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
    getLanguageInfo,
    isRTL,
    formatNumber,
    formatDate,
    getLocaleFromLanguage,
    getTextDirection,
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={getTextDirection()}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
