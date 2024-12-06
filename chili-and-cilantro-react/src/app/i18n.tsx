// src/i18n.ts
import {
  LanguageCodes,
  StringLanguages,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

(async () => {
  await i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: LanguageCodes[StringLanguages.EnglishUS],
      debug: process.env['NODE_ENV'] === 'development',
      interpolation: {
        escapeValue: false, // not needed for React
      },
      supportedLngs: Object.values(StringLanguages).map(
        (lang) => LanguageCodes[lang],
      ),
      backend: {
        loadPath: '/api/i18n/{{lng}}',
      },
    });
})();

export default i18n;
