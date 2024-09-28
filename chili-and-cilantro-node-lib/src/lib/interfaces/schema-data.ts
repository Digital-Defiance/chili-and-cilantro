import {
  IBaseDocument,
  ModelName,
  ModelNameCollection,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { IDiscriminatorCollections } from './discriminator-collections';

export interface ISchemaData<T extends IBaseDocument<any>> {
  name: ModelName;
  description: string;
  collection: ModelNameCollection;
  schema: Schema<T>;
  path: string;
  discriminators?: IDiscriminatorCollections<T>;
}
