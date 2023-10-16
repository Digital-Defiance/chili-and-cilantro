import { Schema } from 'mongoose';
import ModelName from '../enumerations/modelName';
import ModelNameCollection from '../enumerations/modelNameCollection';

export interface IModelData {
  readonly name: ModelName;
  readonly description: string;
  readonly collection: ModelNameCollection;
  readonly schema: Schema;
  readonly path: string;
}
