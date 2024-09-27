import { Schema } from 'mongoose';
import ModelName from '../enumerations/model-name';
import ModelNameCollection from '../enumerations/model-name-collection';

export interface IModelData {
  readonly name: ModelName;
  readonly description: string;
  readonly collection: ModelNameCollection;
  readonly schema: Schema;
  readonly path: string;
}
