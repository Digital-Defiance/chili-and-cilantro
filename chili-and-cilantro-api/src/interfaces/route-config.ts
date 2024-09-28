import { RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';

export interface RouteConfig {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  handler: RequestHandler;
  useAuthentication: boolean;
  middleware?: RequestHandler[];
  validation?: ValidationChain[];
}
