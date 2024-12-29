import { RequestHandler } from 'express';
import {
  ApiRequestHandler,
  ApiResponse,
  FlexibleValidationChain,
} from '../shared-types';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type RouteHandlers<
  T extends ApiResponse,
  RawJsonResponse extends boolean = false,
  HandlerArgs extends Array<unknown> = Array<unknown>,
> = Record<string, ApiRequestHandler<T, RawJsonResponse, HandlerArgs>>;

export interface RouteConfig<
  T extends ApiResponse,
  RawJsonResponse extends boolean = false,
  HandlerArgs extends Array<unknown> = Array<unknown>,
> {
  method: HttpMethod;
  path: string;
  handlerKey: keyof RouteHandlers<T, RawJsonResponse, HandlerArgs>;
  handlerArgs?: HandlerArgs;
  useAuthentication: boolean;
  middleware?: RequestHandler[];
  validation?: FlexibleValidationChain;
  rawJsonHandler?: RawJsonResponse;
  authFailureStatusCode?: number;
}

export const routeConfig = <
  T extends ApiResponse,
  RawJsonResponse extends boolean = false,
  HandlerArgs extends Array<unknown> = Array<unknown>,
>(
  method: HttpMethod,
  path: string,
  config: Omit<RouteConfig<T, RawJsonResponse, HandlerArgs>, 'method' | 'path'>,
): RouteConfig<T, RawJsonResponse, HandlerArgs> => ({
  ...config,
  method,
  path,
});
