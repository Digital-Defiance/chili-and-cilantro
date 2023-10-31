import { Model } from "mongoose";
import { ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';

export interface IDatabase {
  getModel<T>(modelName: ModelName): Model<T>;
}