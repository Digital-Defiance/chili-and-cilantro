import {
  ActionDocumentTypes,
  ActionType,
  IApiErrorResponse,
  IApiExpressValidationErrorResponse,
  IApiMessageResponse,
  IApiMongoValidationErrorResponse,
  IBaseDocument,
  ModelName,
  StringLanguages,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Request, RequestHandler, Response } from 'express';
import { ValidationChain } from 'express-validator';
import { ClientSession, Document, Model, Schema } from 'mongoose';
import pusher from 'pusher';
import { ISchemaData } from './interfaces/schema-data';
import { IStatusCodeResponse } from './interfaces/status-code-response';

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

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface TypedHandlers<T extends ApiResponse> {
  [key: string]: ApiRequestHandler<T>;
}

export type RouteHandlers = Record<string, ApiRequestHandler<ApiResponse>>;

export interface RouteConfig<
  T extends ApiResponse,
  H extends TypedHandlers<T>,
> {
  method: HttpMethod;
  path: string;
  handlerKey: keyof H;
  handlerArgs?: Array<unknown>;
  useAuthentication: boolean;
  middleware?: RequestHandler[];
  validation?: FlexibleValidationChain;
  rawJsonHandler?: boolean;
  authFailureStatusCode?: number;
}

export const routeConfig = <T extends ApiResponse, H extends TypedHandlers<T>>(
  method: HttpMethod,
  path: string,
  config: Omit<RouteConfig<T, H>, 'method' | 'path'>,
): RouteConfig<T, H> => ({
  ...config,
  method,
  path,
});

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

export type ApiErrorResponse =
  | IApiErrorResponse
  | IApiExpressValidationErrorResponse
  | IApiMongoValidationErrorResponse;

export type ApiResponse =
  | IApiMessageResponse
  | ApiErrorResponse
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
export type ApiRequestHandler<T extends ApiResponse> = (
  req: Request,
  ...args: Array<unknown>
) => Promise<IStatusCodeResponse<T>>;
