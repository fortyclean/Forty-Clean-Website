import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

type SupportedLanguage = 'ar' | 'en';

const DEFAULT_LANGUAGE: SupportedLanguage = 'ar';
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ar', 'en'];
const loadedLanguages = new Set<SupportedLanguage>();

const normalizeLanguage = (value?: string | null): SupportedLanguage => {
  if (!value) {
    return DEFAULT_LANGUAGE;
  }

  const shortCode = value.toLowerCase().split('-')[0];
  return SUPPORTED_LANGUAGES.includes(shortCode as SupportedLanguage)
    ? (shortCode as SupportedLanguage)
    : DEFAULT_LANGUAGE;
};

const loadTranslations = async (language: SupportedLanguage) => {
  if (language === 'en') {
    const module = await import('./locales/en.json');
    return module.default;
  }

  const module = await import('./locales/ar.json');
  return module.default;
};

const ensureLanguageLoaded = async (language: SupportedLanguage) => {
  if (loadedLanguages.has(language)) {
    return;
  }

  const translations = await loadTranslations(language);
  loadedLanguages.add(language);

  if (i18n.isInitialized) {
    i18n.addResourceBundle(language, 'translation', translations, true, true);
  }

  return translations;
};

const initialLanguage = 'ar';
const initialTranslations = (await ensureLanguageLoaded(initialLanguage)) ?? {};
const initialResources = {
  [initialLanguage]: {
    translation: initialTranslations,
  },
} as Resource;

await i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'ar',
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    resources: initialResources,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

if (typeof window !== 'undefined' && !window.localStorage.getItem('i18nextLng')) {
  window.localStorage.setItem('i18nextLng', DEFAULT_LANGUAGE);
}

const baseChangeLanguage = i18n.changeLanguage.bind(i18n);

i18n.changeLanguage = async (language, callback) => {
  const nextLanguage = normalizeLanguage(language ?? initialLanguage);
  await ensureLanguageLoaded(nextLanguage);
  return baseChangeLanguage(nextLanguage, callback);
};

export default i18n;
