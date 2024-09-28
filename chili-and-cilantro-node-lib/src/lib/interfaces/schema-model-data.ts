import {
  IBaseDocument,
  ModelName,
  ModelNameCollection,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Model, Schema } from 'mongoose';

export interface ISchemaModelData<T extends IBaseDocument<T>> {
  name: ModelName;
  description: string;
  collection: ModelNameCollection;
  model: Model<T>;
  schema: Schema<T>;
  path: string;
  discriminators?: Array<Model<any>>;
}
