import {
  ActionDocumentTypes,
  ActionType,
  IApiMessageResponse,
  IBaseDocument,
  ModelName,
  StringLanguages,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { NextFunction, Request, Response } from 'express';
import { ValidationChain } from 'express-validator';
import { ClientSession, Document, Model, Schema } from 'mongoose';
import pusher from 'pusher';
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

export type JsonPrimitive = string | number | boolean | null | undefined;

export type JsonResponse =
  | JsonPrimitive
  | { [key: string]: JsonResponse }
  | JsonResponse[];

export type ApiResponse =
  | IApiMessageResponse
  | JsonResponse
  | pusher.UserAuthResponse;

export type SendFunction<T extends ApiResponse> = (
  statusCode: number,
  data: T,
  res: Response<T>,
) => void;

/**
 * Response type for API requests
 */
export type ApiRequestHandler<
  T extends ApiResponse,
  RawJsonResponse extends boolean = false,
  AdditionalArgs extends Array<unknown> = Array<unknown>,
> = (
  req: Request,
  res: Response<RawJsonResponse extends true ? JsonResponse : T>,
  send: SendFunction<T>,
  next: NextFunction,
  ...args: AdditionalArgs
) => Promise<void>;
