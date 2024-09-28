import { StringLanguages } from './enumerations/string-languages';
import { StringNames } from './enumerations/string-names';
import { buildNestedI18n } from './i18n'; // Adjust the import path as needed
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
