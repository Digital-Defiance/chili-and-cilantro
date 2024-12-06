import { AccountStatusTypeTranslations } from './enumeration-translations/account-status-type';
import { ActionTypeTranslations } from './enumeration-translations/action-type';
import { ActionTypePastTenseTranslations } from './enumeration-translations/action-type-past-tense';
import { CardTypeTranslations } from './enumeration-translations/card-type';
import { ChallengeResponseTranslations } from './enumeration-translations/challenge-response';
import { ChallengeResponsePastTenseTranslations } from './enumeration-translations/challenge-response-past-tense';
import { ChefStateTranslations } from './enumeration-translations/chef-state';
import { EmailTokenTypeTranslations } from './enumeration-translations/email-token-type';
import { GamePhaseTranslations } from './enumeration-translations/game-phase';
import { QuitGameReasonTranslations } from './enumeration-translations/quit-game-reason';
import { TurnActionTranslations } from './enumeration-translations/turn-action';
import { TurnActionPastTenseTranslations } from './enumeration-translations/turn-action-past-tense';
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
import { ILanguageContext } from './interfaces/language-context';
import { LanguageCodes } from './language-codes';
import { DefaultLanguage, StringsCollection } from './shared-types';
import { Strings } from './strings';

export const buildNestedI18n = (
  strings: StringsCollection,
): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.entries(strings).forEach(([key, value]) => {
    const keys = key.split('_');
    let current = result;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        // Assign the value at the deepest level
        if (typeof current[k] === 'object' && current[k] !== null) {
          throw new Error(
            `Key conflict detected: Cannot assign string to key '${k}' because it's already used as an object.`,
          );
        }
        current[k] = value;
      } else {
        // Create nested objects if they don't exist
        if (!(k in current)) {
          current[k] = {};
        } else if (typeof current[k] !== 'object' || current[k] === null) {
          // Conflict detected
          throw new Error(
            `Key conflict detected: Key '${k}' is assigned both a value and an object.`,
          );
        }
        current = current[k];
      }
    });
  });

  return result;
};

export const buildNestedI18nForLanguage = (language: StringLanguages) => {
  if (!Strings[language]) {
    throw new Error(`Strings not found for language: ${language}`);
  }

  return buildNestedI18n(Strings[language]);
};

export const stringNameToI18nKey = (name: StringNames) =>
  name.replace('_', '.'); // only replace the first underscore

export const translate = (
  name: StringNames,
  language?: StringLanguages,
): string => {
  const lang = language ?? GlobalLanguageContext.language;
  if (!Strings[lang]) {
    console.warn(`Language ${lang} not found in Strings`);
    return name; // Fallback to the string name itself
  }
  if (!(name in Strings[lang])) {
    console.warn(`String ${name} not found for language ${lang}`);
    return name; // Fallback to the string name itself
  }
  return Strings[lang][name];
};

export type TranslatableEnum =
  | { type: TranslatableEnumType.AccountStatus; value: AccountStatusTypeEnum }
  | { type: TranslatableEnumType.ActionType; value: ActionType }
  | { type: TranslatableEnumType.ActionTypePastTense; value: ActionType }
  | { type: TranslatableEnumType.CardType; value: CardType }
  | { type: TranslatableEnumType.ChallengeResponse; value: ChallengeResponse }
  | {
      type: TranslatableEnumType.ChallengeResponsePastTense;
      value: ChallengeResponse;
    }
  | { type: TranslatableEnumType.ChefState; value: ChefState }
  | { type: TranslatableEnumType.EmailTokenType; value: EmailTokenType }
  | { type: TranslatableEnumType.GamePhase; value: GamePhase }
  | { type: TranslatableEnumType.QuitGameReason; value: QuitGameReason }
  | { type: TranslatableEnumType.TurnAction; value: TurnAction }
  | { type: TranslatableEnumType.TurnActionPastTense; value: TurnAction };

export type TranslationsMap = {
  [TranslatableEnumType.AccountStatus]: {
    [key in StringLanguages]: { [key in AccountStatusTypeEnum]: string };
  };
  [TranslatableEnumType.ActionType]: {
    [key in StringLanguages]: { [key in ActionType]: string };
  };
  [TranslatableEnumType.ActionTypePastTense]: {
    [key in StringLanguages]: { [key in ActionType]: string };
  };
  [TranslatableEnumType.CardType]: {
    [key in StringLanguages]: { [key in CardType]: string };
  };
  [TranslatableEnumType.ChallengeResponse]: {
    [key in StringLanguages]: {
      [key in ChallengeResponse]: string;
    };
  };
  [TranslatableEnumType.ChallengeResponsePastTense]: {
    [key in StringLanguages]: { [key in ChallengeResponse]: string };
  };
  [TranslatableEnumType.ChefState]: {
    [key in StringLanguages]: { [key in ChefState]: string };
  };
  [TranslatableEnumType.EmailTokenType]: {
    [key in StringLanguages]: { [key in EmailTokenType]: string };
  };
  [TranslatableEnumType.GamePhase]: {
    [key in StringLanguages]: { [key in GamePhase]: string };
  };
  [TranslatableEnumType.QuitGameReason]: {
    [key in StringLanguages]: { [key in QuitGameReason]: string };
  };
  [TranslatableEnumType.TurnAction]: {
    [key in StringLanguages]: { [key in TurnAction]: string };
  };
  [TranslatableEnumType.TurnActionPastTense]: {
    [key in StringLanguages]: { [key in TurnAction]: string };
  };
};

export const translationsMap: TranslationsMap = {
  [TranslatableEnumType.AccountStatus]: AccountStatusTypeTranslations,
  [TranslatableEnumType.ActionType]: ActionTypeTranslations,
  [TranslatableEnumType.ActionTypePastTense]: ActionTypePastTenseTranslations,
  [TranslatableEnumType.CardType]: CardTypeTranslations,
  [TranslatableEnumType.ChallengeResponse]: ChallengeResponseTranslations,
  [TranslatableEnumType.ChallengeResponsePastTense]:
    ChallengeResponsePastTenseTranslations,
  [TranslatableEnumType.ChefState]: ChefStateTranslations,
  [TranslatableEnumType.EmailTokenType]: EmailTokenTypeTranslations,
  [TranslatableEnumType.GamePhase]: GamePhaseTranslations,
  [TranslatableEnumType.QuitGameReason]: QuitGameReasonTranslations,
  [TranslatableEnumType.TurnAction]: TurnActionTranslations,
  [TranslatableEnumType.TurnActionPastTense]: TurnActionPastTenseTranslations,
};

export const translateEnum = (
  { type, value }: TranslatableEnum,
  language?: StringLanguages,
): string => {
  const lang = language ?? GlobalLanguageContext.language;
  const translations = translationsMap[type];
  if (translations && translations[lang]) {
    const enumTranslations = translations[lang] as Record<string, string>;
    if (enumTranslations[value]) {
      return enumTranslations[value];
    }
  }
  throw new Error(`Unknown enum value: ${value} for type: ${type}`);
};

export const GlobalLanguageContext: ILanguageContext = {
  language: DefaultLanguage,
};

export function getLanguageCode(language: string): StringLanguages {
  for (const [key, value] of Object.entries(LanguageCodes)) {
    if (value === language) {
      return key as StringLanguages;
    }
  }
  throw new Error(`Unknown language code: ${language}`);
}
