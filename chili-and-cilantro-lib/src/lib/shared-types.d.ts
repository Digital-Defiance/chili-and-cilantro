import { IAction, IBaseDocument, IChef, IEmailToken, IGame, IMakeBidAction, IMessageAction, IPassAction, IPlaceCardAction, IQuitGameAction, IStartBiddingAction, IStartGameAction, IStartNewRoundAction, IUser } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ClientSession, Model, Types } from 'mongoose';
export type ChiliCilantroDocuments = IBaseDocument<IAction> | IBaseDocument<IMakeBidAction> | IBaseDocument<IMessageAction> | IBaseDocument<IPassAction> | IBaseDocument<IPlaceCardAction> | IBaseDocument<IQuitGameAction> | IBaseDocument<IStartBiddingAction> | IBaseDocument<IStartGameAction> | IBaseDocument<IStartNewRoundAction> | IBaseDocument<IChef> | IBaseDocument<IEmailToken> | IBaseDocument<IGame> | IBaseDocument<IUser>;
/**
 * Transaction callback type for withTransaction
 */
export type TransactionCallback<T> = (session: ClientSession | undefined, ...args: any) => Promise<T>;
/**
 * Get model function type
 */
export type GetModelFunction = <T extends IBaseDocument<any>>(modelName: string) => Model<T>;
/**
 * Validated body for express-validator
 */
export type ValidatedBody<T extends string> = {
    [K in T]: any;
};
export type DefaultIdType = Types.ObjectId;
