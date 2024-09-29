import {
  IActionDocument,
  IChefDocument,
  IEmailTokenDocument,
  IGameDocument,
  IRequestUser,
  IUserDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ClientSession, Document, Model } from 'mongoose';

export type ChiliCilantroDocuments =
  | IActionDocument
  | IChefDocument
  | IEmailTokenDocument
  | IGameDocument
  | IUserDocument;

/**
 * Transaction callback type for withTransaction
 */
export type TransactionCallback<T> = (
  session: ClientSession | undefined,
  ...args: any
) => Promise<T>;

/**
 * Validated body for express-validator
 */
export type ValidatedBody<T extends string> = {
  [K in T]: any;
};

/**
 * Get model function type
 */
export type GetModelFunction = <T extends Document>(
  modelName: string,
) => Model<T>;

/**
 * Schema map interface
 */
export type SchemaMap = Record<ModelName, ISchemaData<ChiliCilantroDocuments>>;

declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
      validatedBody?: ValidatedBody<string>;
    }
  }
}
