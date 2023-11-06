import { Model } from "mongoose";
import { Action, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';

export interface IDatabase {
  getModel<T>(modelName: ModelName): Model<T>;
  getActionModel(actionType: Action): Model<unknown>;
}