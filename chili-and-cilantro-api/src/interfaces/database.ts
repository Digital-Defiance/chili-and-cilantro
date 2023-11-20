import { Model } from "mongoose";
import { Action, IAction, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';

export interface IDatabase {
  getModel<T>(modelName: ModelName): Model<T>;
  getActionModel<T extends IAction>(actionType: Action): Model<T>;
}