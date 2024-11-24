import {
  IRequestUser,
  ModelName,
  ValidatedBody,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ChiliCilantroDocuments } from '@chili-and-cilantro/chili-and-cilantro-node-lib';

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
