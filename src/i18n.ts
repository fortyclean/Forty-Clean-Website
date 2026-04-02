import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationAR from './locales/ar.json';
import translationEN from './locales/en.json';

const resources = {
  ar: {
    translation: translationAR
  },
  en: {
    translation: translationEN
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['ar', 'en'],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
