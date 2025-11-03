import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import { loadPreferences } from './utils/preferences';

const resources = {
  en: {
    translation: enTranslation
  },
  fr: {
    translation: frTranslation
  }
};

// Load language from preferences
const preferences = loadPreferences();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: preferences.language,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
