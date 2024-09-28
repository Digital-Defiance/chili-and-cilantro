import {
  ActionDocumentTypes,
  ActionType,
  ModelName,
  StringLanguages,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

import { IBaseDocument } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ValidationChain } from 'express-validator';
import { ClientSession, Document, Model } from 'mongoose';
import { ISchemaData } from './interfaces/schema-data';

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
export type SchemaMap = {
  /**
   * For each model name, contains the corresponding schema and model
   */
  [K in keyof typeof ModelName]: ISchemaData<IBaseDocument<any>>;
};

export type HandlerArgs<T extends unknown[]> = T;

export type ActionSchemaMapType = {
  [K in ActionType]: Schema<ActionDocumentTypes[K]>;
};

export type FlexibleValidationChain =
  | ValidationChain[]
  | ((lang: StringLanguages) => ValidationChain[]);
