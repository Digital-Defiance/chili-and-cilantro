import { StringLanguages } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';
import { HandlerArgs } from '../shared-types';

export interface RouteConfig<T extends unknown[]> {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  handler: RequestHandler;
  handlerArgs?: HandlerArgs<T>;
  useAuthentication: boolean;
  middleware?: RequestHandler[];
  validation?:
    | ValidationChain[]
    | ((lang: StringLanguages) => ValidationChain[]);
}

export function routeConfig<T extends unknown[] = unknown[]>(
  routeConfig: RouteConfig<T>,
): RouteConfig<T> {
  return routeConfig;
}
