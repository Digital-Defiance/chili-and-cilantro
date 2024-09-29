import { StringLanguages } from './enumerations/string-languages';
import { LanguageCodeCollection } from './shared-types';

export const LanguageCodes: LanguageCodeCollection = {
  [StringLanguages.EnglishUS]: 'en',
  [StringLanguages.EnglishUK]: 'en-GB',
  [StringLanguages.French]: 'fr',
  [StringLanguages.MandarinChinese]: 'zh-CN',
  [StringLanguages.Spanish]: 'es',
  [StringLanguages.Ukrainian]: 'uk',
};

export const LanguageCodeValues = Object.values(LanguageCodes);

export function languageCodeToStringLanguages(
  code: string,
  fallback?: StringLanguages,
): StringLanguages {
  for (const lang of Object.values(StringLanguages)) {
    if (LanguageCodes[lang] === code) {
      return lang;
    }
  }

  return fallback ?? StringLanguages.EnglishUS;
}
