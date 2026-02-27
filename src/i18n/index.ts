import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en  from './locales/en.json';
import pid from './locales/pid.json';
import yo  from './locales/yo.json';
import ha  from './locales/ha.json';
import ig  from './locales/ig.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en:  { translation: en },
      pid: { translation: pid },
      yo:  { translation: yo },
      ha:  { translation: ha },
      ig:  { translation: ig },
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;