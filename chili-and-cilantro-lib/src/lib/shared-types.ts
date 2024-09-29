import { ClientSession, Model, Types } from 'mongoose';
import ModelName from './enumerations/model-name';
import { StringLanguages } from './enumerations/string-languages';
import { StringNames } from './enumerations/string-names';
import { IBaseDocument } from './interfaces/documents/base';
import { IMakeBidAction } from './interfaces/models/actions/make-bid';
import { IMessageAction } from './interfaces/models/actions/message';
import { IPassAction } from './interfaces/models/actions/pass';
import { IPlaceCardAction } from './interfaces/models/actions/place-card';
import { IQuitGameAction } from './interfaces/models/actions/quit-game';
import { IStartBiddingAction } from './interfaces/models/actions/start-bidding';
import { IStartGameAction } from './interfaces/models/actions/start-game';
import { IStartNewRoundAction } from './interfaces/models/actions/start-new-round';
import { IChef } from './interfaces/models/chef';
import { IEmailToken } from './interfaces/models/email-token';
import { IGame } from './interfaces/models/game';
import { IUser } from './interfaces/models/user';

export type ChiliCilantroActions =
  | IBaseDocument<IMakeBidAction>
  | IBaseDocument<IMessageAction>
  | IBaseDocument<IPassAction>
  | IBaseDocument<IPlaceCardAction>
  | IBaseDocument<IQuitGameAction>
  | IBaseDocument<IStartBiddingAction>
  | IBaseDocument<IStartGameAction>
  | IBaseDocument<IStartNewRoundAction>;

export type ChiliCilantroDocuments =
  | ChiliCilantroActions
  | IBaseDocument<IChef>
  | IBaseDocument<IEmailToken>
  | IBaseDocument<IGame>
  | IBaseDocument<IUser>;

/**
 * Transaction callback type for withTransaction
 */
export type TransactionCallback<T> = (
  session: ClientSession | undefined,
  ...args: any
) => Promise<T>;
/**
 * Get model function type
 */
export type GetModelFunction = <T extends IBaseDocument<any>>(
  modelName: ModelName,
) => Model<T>;
/**
 * Validated body for express-validator
 */
export type ValidatedBody<T extends string> = {
  [K in T]: any;
};
export type DefaultIdType = Types.ObjectId;

export type StringsCollection = { [key in StringNames]: string };
export type MasterStringsCollection = {
  [key in StringLanguages]: StringsCollection;
};

export type LanguageFlagCollection = { [key in StringLanguages]: string };

export type LanguageCodeCollection = { [key in StringLanguages]: string };

export const DefaultLanguage: StringLanguages = StringLanguages.EnglishUS;
