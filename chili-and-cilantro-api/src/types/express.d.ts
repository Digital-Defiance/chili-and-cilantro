import {
  IRequestUser,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ChiliCilantroDocuments } from '@chili-and-cilantro/chili-and-cilantro-node-lib';

/**
 * Validated body for express-validator
 */
export type ValidatedBody<T extends string> = {
  [K in T]: any;
};

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
