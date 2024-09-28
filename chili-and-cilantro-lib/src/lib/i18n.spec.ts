import { faker } from '@faker-js/faker';
import { AccountStatusTypeEnum } from './enumerations/account-status-type';
import ActionType from './enumerations/action-type';
import CardType from './enumerations/card-type';
import ChallengeResponse from './enumerations/challenge-response';
import ChefState from './enumerations/chef-state';
import { EmailTokenType } from './enumerations/email-token-type';
import GamePhase from './enumerations/game-phase';
import QuitGameReason from './enumerations/quit-game-reason';
import { StringLanguages } from './enumerations/string-languages';
import { StringNames } from './enumerations/string-names';
import { TranslatableEnumType } from './enumerations/translatable-enum';
import TurnAction from './enumerations/turn-action';
import {
  buildNestedI18n,
  buildNestedI18nForLanguage,
  getLanguageCode,
  GlobalLanguageContext,
  stringNameToI18nKey,
  TranslatableEnum,
  translate,
  translateEnum,
  translationsMap,
} from './i18n';
import { LanguageCodes } from './language-codes';
import { StringsCollection } from './shared-types';
import { Strings } from './strings';

describe('buildNestedI18n', () => {
  it('should handle flat strings', () => {
    const input: StringsCollection = {
      [StringNames.Common_Site]: 'Chili and Cilantro',
      [StringNames.Common_Tagline]: 'A Spicy Bluffing Game',
    } as unknown as StringsCollection;
    const expected = {
      common: {
        site: 'Chili and Cilantro',
        tagline: 'A Spicy Bluffing Game',
      },
    };
    expect(buildNestedI18n(input)).toEqual(expected);
  });

  it('should create nested objects for keys with underscores', () => {
    const input = {
      dashboard_title: 'Dashboard',
      dashboard_yourDashboard: 'Your Dashboard',
    } as unknown as StringsCollection;
    const expected = {
      dashboard: {
        title: 'Dashboard',
        yourDashboard: 'Your Dashboard',
      },
    };
    expect(buildNestedI18n(input)).toEqual(expected);
  });

  it('should handle numeric keys', () => {
    const input = {
      keyFeatures_label: 'Key Features',
      keyFeatures_1: 'Feature 1',
      keyFeatures_2: 'Feature 2',
    } as unknown as StringsCollection;
    const expected = {
      keyFeatures: {
        label: 'Key Features',
        '1': 'Feature 1',
        '2': 'Feature 2',
      },
    };
    expect(buildNestedI18n(input)).toEqual(expected);
  });

  it('should handle mixed nested and flat keys', () => {
    const input = {
      site: 'CurseFund',
      validation_usernameMinLength: 'Username must be at least 3 characters',
      validation_passwordMinLength: 'Password must be at least 8 characters',
      errors_404: 'Page not found',
    } as unknown as StringsCollection;
    const expected = {
      site: 'CurseFund',
      validation: {
        usernameMinLength: 'Username must be at least 3 characters',
        passwordMinLength: 'Password must be at least 8 characters',
      },
      errors: {
        '404': 'Page not found',
      },
    };
    expect(buildNestedI18n(input)).toEqual(expected);
  });

  it('should handle empty input', () => {
    const input = {} as StringsCollection;
    const expected = {};
    expect(buildNestedI18n(input)).toEqual(expected);
  });

  it('should not modify original input', () => {
    const input = {
      a_b: 'Value',
      c: 'Another Value',
    } as unknown as StringsCollection;
    const originalInput = { ...input };
    buildNestedI18n(input);
    expect(input).toEqual(originalInput);
  });

  it('should throw an error when a key is both a string and an object', () => {
    const input = {
      keyFeatures: 'Key Features',
      keyFeatures_1: 'Feature 1',
      keyFeatures_2: 'Feature 2',
    } as unknown as StringsCollection;

    expect(() => buildNestedI18n(input)).toThrowError(
      "Key conflict detected: Key 'keyFeatures' is assigned both a value and an object.",
    );
  });

  it('should throw an error when a key is already used as an object', () => {
    const input = {
      keyFeatures_1: 'Feature 1',
      keyFeatures: { label: 'Key Features' },
    } as unknown as StringsCollection;

    expect(() => buildNestedI18n(input)).toThrowError(
      "Key conflict detected: Cannot assign string to key 'keyFeatures' because it's already used as an object.",
    );
  });

  it.each(Object.values(StringLanguages))(
    'should handle %s language',
    (language) => {
      const stringCollection = Strings[language];
      let nestedI18n;
      expect(() => {
        nestedI18n = buildNestedI18n(stringCollection);
      }).not.toThrow();
      expect(nestedI18n).toBeTruthy();
      expect(nestedI18n).toMatchSnapshot();
    },
  );
});

describe('buildNestedI18nForLanguage', () => {
  it('should throw when a language is not found', () => {
    expect(() => buildNestedI18nForLanguage('Foo' as StringLanguages)).toThrow(
      'Strings not found for language: Foo',
    );
  });

  it.each(Object.values(StringLanguages))(
    'should call buildNestedI18n with the correct language',
    (language) => {
      jest.mock('@chili-and-cilantro/chili-and-cilantro-lib', () => ({
        ...jest.requireActual('@chili-and-cilantro/chili-and-cilantro-lib'),
        buildNestedI18n: jest.fn(),
      }));
      let nestedI18n;
      expect(() => {
        nestedI18n = buildNestedI18nForLanguage(language);
      }).not.toThrow();
      expect(nestedI18n).toBeTruthy();
      expect(nestedI18n).toMatchSnapshot();
    },
  );
});

describe('stringNameToI18nKey', () => {
  it('should replace underscores with dots', () => {
    // note that the StringName value itself is camelCase
    expect(stringNameToI18nKey(StringNames.Common_ChangePassword)).toBe(
      'common.changePassword',
    );
  });
});

describe('translate', () => {
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    console.warn = jest.fn();
    GlobalLanguageContext.language = StringLanguages.EnglishUS;
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  it('should return the correct translation for a given string name', () => {
    const result = translate(StringNames.Common_Site);
    expect(result).toBe(
      Strings[StringLanguages.EnglishUS][StringNames.Common_Site],
    );
  });

  it('should use the provided language if specified', () => {
    const result = translate(StringNames.Common_Site, StringLanguages.French);
    expect(result).toBe(
      Strings[StringLanguages.French][StringNames.Common_Site],
    );
  });

  it('should fallback to GlobalLanguageContext.language if no language is provided', () => {
    GlobalLanguageContext.language = StringLanguages.Spanish;
    const result = translate(StringNames.Common_Site);
    expect(result).toBe(
      Strings[StringLanguages.Spanish][StringNames.Common_Site],
    );
  });

  it('should return the string name if the language is not found in Strings', () => {
    const result = translate(
      StringNames.Common_Site,
      'InvalidLanguage' as StringLanguages,
    );
    expect(result).toBe(StringNames.Common_Site);
    expect(console.warn).toHaveBeenCalledWith(
      'Language InvalidLanguage not found in Strings',
    );
  });

  it('should return the string name if the translation is not found for the given language', () => {
    const invalidStringName = 'InvalidStringName' as StringNames;
    const result = translate(invalidStringName);
    expect(result).toBe(invalidStringName);
    expect(console.warn).toHaveBeenCalledWith(
      `String ${invalidStringName} not found for language ${StringLanguages.EnglishUS}`,
    );
  });
});

describe('translateEnum', () => {
  const originalLanguage = GlobalLanguageContext.language;

  beforeEach(() => {
    GlobalLanguageContext.language = StringLanguages.EnglishUS;
  });

  afterEach(() => {
    GlobalLanguageContext.language = originalLanguage;
  });

  it('should translate an enum value correctly', () => {
    const value = faker.helpers.arrayElement(Object.values(ActionType));
    const input: TranslatableEnum = {
      type: TranslatableEnumType.ActionType,
      value: value,
    };
    const language = faker.helpers.arrayElement(Object.values(StringLanguages));
    expect(translateEnum(input, language)).toBe(
      translationsMap[TranslatableEnumType.ActionType][language][value],
    );
  });

  it('should use the provided language if specified', () => {
    const input: TranslatableEnum = {
      type: TranslatableEnumType.CardType,
      value: faker.helpers.arrayElement(Object.values(CardType)),
    };
    const language = faker.helpers.arrayElement(Object.values(StringLanguages));
    expect(translateEnum(input, language)).toBe(
      translationsMap[TranslatableEnumType.CardType][language][input.value],
    );
  });

  it('should fall back to GlobalLanguageContext.language if no language is provided', () => {
    GlobalLanguageContext.language = faker.helpers.arrayElement(
      Object.values(StringLanguages),
    );
    const input: TranslatableEnum = {
      type: TranslatableEnumType.ActionType,
      value: ActionType.PASS,
    };
    expect(translateEnum(input)).toBe(
      translationsMap[TranslatableEnumType.ActionType][
        GlobalLanguageContext.language
      ][input.value],
    );
  });

  it('should throw an error for an unknown enum type', () => {
    const language = faker.helpers.arrayElement(Object.values(StringLanguages));
    const input = {
      type: 'UnknownType',
      value: 'SomeValue',
    } as unknown as TranslatableEnum;
    expect(() => translateEnum(input, language)).toThrow(
      `Unknown enum value: SomeValue for type: UnknownType and language: ${language}`,
    );
  });

  it('should throw an error for an unknown enum value', () => {
    const language = faker.helpers.arrayElement(Object.values(StringLanguages));
    const input = {
      type: TranslatableEnumType.ActionType,
      value: 'UnknownValue',
    } as unknown as TranslatableEnum;
    expect(() => translateEnum(input, language)).toThrow(
      `Unknown enum value: UnknownValue for type: ActionType and language: ${language}`,
    );
  });

  it('should throw an error if translations are not available for the specified language', () => {
    const value = faker.helpers.arrayElement(Object.values(CardType));
    const input: TranslatableEnum = {
      type: TranslatableEnumType.CardType,
      value: value,
    };
    expect(() =>
      translateEnum(input, 'InvalidLanguage' as StringLanguages),
    ).toThrow(
      `Unknown enum value: ${value} for type: CardType and language: InvalidLanguage`,
    );
  });

  it('should handle all TranslatableEnumTypes', () => {
    const language = faker.helpers.arrayElement(Object.values(StringLanguages));
    const enumTypes = Object.values(TranslatableEnumType);
    enumTypes.forEach((type) => {
      let value;
      switch (type) {
        case TranslatableEnumType.AccountStatus:
          value = faker.helpers.arrayElement(
            Object.values(AccountStatusTypeEnum),
          );
          break;
        case TranslatableEnumType.ActionType:
        case TranslatableEnumType.ActionTypePastTense:
          value = faker.helpers.arrayElement(Object.values(ActionType));
          break;
        case TranslatableEnumType.CardType:
          value = faker.helpers.arrayElement(Object.values(CardType));
          break;
        case TranslatableEnumType.ChallengeResponse:
        case TranslatableEnumType.ChallengeResponsePastTense:
          value = faker.helpers.arrayElement(Object.values(ChallengeResponse));
          break;
        case TranslatableEnumType.ChefState:
          value = faker.helpers.arrayElement(Object.values(ChefState));
          break;
        case TranslatableEnumType.EmailTokenType:
          value = faker.helpers.arrayElement(Object.values(EmailTokenType));
          break;
        case TranslatableEnumType.GamePhase:
          value = faker.helpers.arrayElement(Object.values(GamePhase));
          break;
        case TranslatableEnumType.QuitGameReason:
          value = faker.helpers.arrayElement(Object.values(QuitGameReason));
          break;
        case TranslatableEnumType.TurnAction:
        case TranslatableEnumType.TurnActionPastTense:
          value = faker.helpers.arrayElement(Object.values(TurnAction));
          break;
      }
      const input: TranslatableEnum = { type, value } as TranslatableEnum;
      expect(() => translateEnum(input, language)).not.toThrow();
    });
  });
});

describe('getLanguageCode', () => {
  it.each(Object.entries(LanguageCodes))(
    'should return the correct language code for %s',
    (expectedCode, language) => {
      expect(getLanguageCode(language)).toBe(expectedCode);
    },
  );

  it('should throw an error for an unknown language code', () => {
    expect(() => getLanguageCode('unknown-language')).toThrow(
      'Unknown language code: unknown-language',
    );
  });

  it('should handle empty string as language code', () => {
    expect(() => getLanguageCode('')).toThrow('Unknown language code: ');
  });

  it('should handle null as language code', () => {
    expect(() => getLanguageCode(null as unknown as string)).toThrow(
      'Unknown language code: null',
    );
  });

  it('should handle undefined as language code', () => {
    expect(() => getLanguageCode(undefined as unknown as string)).toThrow(
      'Unknown language code: undefined',
    );
  });
});
