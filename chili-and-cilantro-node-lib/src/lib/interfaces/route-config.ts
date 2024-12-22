import { StringLanguages } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';
import { ApiRequestHandler, ApiResponse } from '../shared-types';

export interface RouteConfig<
  T extends ApiResponse,
  RawJsonResponse extends boolean = false,
  HandlerArgs extends Array<unknown> = Array<unknown>,
> {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  handler: ApiRequestHandler<T, RawJsonResponse, HandlerArgs>;
  handlerArgs?: HandlerArgs;
  useAuthentication: boolean;
  middleware?: RequestHandler[];
  validation?:
    | ValidationChain[]
    | ((lang: StringLanguages) => ValidationChain[]);
  rawJsonHandler?: RawJsonResponse;
  authFailureStatusCode?: number;
}

export function routeConfig<
  T extends ApiResponse,
  RawJsonResponse extends boolean = false,
  HandlerArgs extends Array<unknown> = Array<unknown>,
>(
  routeConfig: RouteConfig<T, RawJsonResponse, HandlerArgs>,
): RouteConfig<T, RawJsonResponse, HandlerArgs> {
  return routeConfig;
}
