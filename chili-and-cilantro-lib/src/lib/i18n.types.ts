import { AccountStatusTypeEnum } from './enumerations/account-status-type';
import ActionType from './enumerations/action-type';
import CardType from './enumerations/card-type';
import ChallengeResponse from './enumerations/challenge-response';
import ChefState from './enumerations/chef-state';
import { EmailTokenType } from './enumerations/email-token-type';
import GamePhase from './enumerations/game-phase';
import QuitGameReason from './enumerations/quit-game-reason';
import { StringLanguages } from './enumerations/string-languages';
import { TranslatableEnumType } from './enumerations/translatable-enum';
import TurnAction from './enumerations/turn-action';

/**
 * Enums that can be translated
 */
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

/**
 * Translations map
 */
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
