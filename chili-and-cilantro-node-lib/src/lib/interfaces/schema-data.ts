import {
  IBaseDocument,
  ModelName,
  ModelNameCollection,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Model, Schema } from 'mongoose';

export interface ISchemaData<T extends IBaseDocument<any>> {
  name: ModelName;
  description: string;
  collection: ModelNameCollection;
  schema: Schema<T>;
  path: string;
  discriminators?: Array<Model<any>>;
}
