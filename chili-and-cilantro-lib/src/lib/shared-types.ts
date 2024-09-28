import { ClientSession, Model, Types } from 'mongoose';
import ModelName from './enumerations/model-name';
import { StringLanguages } from './enumerations/string-languages';
import { StringNames } from './enumerations/string-names';
import { ICreateGameActionDocument } from './interfaces/documents/actions/create-game';
import { IEndGameActionDocument } from './interfaces/documents/actions/end-game';
import { IEndRoundActionDocument } from './interfaces/documents/actions/end-round';
import { IExpireGameActionDocument } from './interfaces/documents/actions/expire-game';
import { IFlipCardActionDocument } from './interfaces/documents/actions/flip-card';
import { IJoinGameActionDocument } from './interfaces/documents/actions/join-game';
import { IMakeBidActionDocument } from './interfaces/documents/actions/make-bid';
import { IMessageActionDocument } from './interfaces/documents/actions/message';
import { IPassActionDocument } from './interfaces/documents/actions/pass';
import { IPlaceCardActionDocument } from './interfaces/documents/actions/place-card';
import { IQuitGameActionDocument } from './interfaces/documents/actions/quit-game';
import { IStartBiddingActionDocument } from './interfaces/documents/actions/start-bidding';
import { IStartGameActionDocument } from './interfaces/documents/actions/start-game';
import { IStartNewRoundActionDocument } from './interfaces/documents/actions/start-new-round';
import { IBaseDocument } from './interfaces/documents/base';
import { IChef } from './interfaces/models/chef';
import { IEmailToken } from './interfaces/models/email-token';
import { IGame } from './interfaces/models/game';
import { IUser } from './interfaces/models/user';

export type ChiliCilantroActions =
  | ICreateGameActionDocument
  | IEndGameActionDocument
  | IEndRoundActionDocument
  | IExpireGameActionDocument
  | IFlipCardActionDocument
  | IJoinGameActionDocument
  | IMakeBidActionDocument
  | IMessageActionDocument
  | IPassActionDocument
  | IPlaceCardActionDocument
  | IQuitGameActionDocument
  | IStartBiddingActionDocument
  | IStartGameActionDocument
  | IStartNewRoundActionDocument;

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
