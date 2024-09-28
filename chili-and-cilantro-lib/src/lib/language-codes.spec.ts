import { StringLanguages } from './enumerations/string-languages';
import { LanguageCodes, languageCodeToStringLanguages } from './language-codes';

describe('languageCodeToStringLanguages', () => {
  it.each(Object.entries(LanguageCodes))(
    'should return the correct StringLanguages for code %s',
    (expectedLanguage, code) => {
      expect(languageCodeToStringLanguages(code)).toBe(expectedLanguage);
    },
  );

  it('should return the fallback language if code is not found', () => {
    expect(
      languageCodeToStringLanguages('unknown-code', StringLanguages.French),
    ).toBe(StringLanguages.French);
  });

  it('should return EnglishUS if code is not found and no fallback is provided', () => {
    expect(languageCodeToStringLanguages('unknown-code')).toBe(
      StringLanguages.EnglishUS,
    );
  });

  it('should handle empty string as code', () => {
    expect(languageCodeToStringLanguages('', StringLanguages.Spanish)).toBe(
      StringLanguages.Spanish,
    );
  });

  it('should handle null as code', () => {
    expect(
      languageCodeToStringLanguages(
        null as unknown as string,
        StringLanguages.Ukrainian,
      ),
    ).toBe(StringLanguages.Ukrainian);
  });

  it('should handle undefined as code', () => {
    expect(
      languageCodeToStringLanguages(
        undefined as unknown as string,
        StringLanguages.MandarinChinese,
      ),
    ).toBe(StringLanguages.MandarinChinese);
  });
});
