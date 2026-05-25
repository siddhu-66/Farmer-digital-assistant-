import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from '../../public/locales/en/translation.json';
import hiTranslations from '../../public/locales/hi/translation.json';
import teTranslations from '../../public/locales/te/translation.json';
import guTranslations from '../../public/locales/gu/translation.json';

const resources = {
  en: { translation: enTranslations },
  hi: { translation: hiTranslations },
  te: { translation: teTranslations },
  gu: { translation: guTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
