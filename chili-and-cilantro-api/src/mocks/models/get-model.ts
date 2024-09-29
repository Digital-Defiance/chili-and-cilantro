import {
  GetModelFunction,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Model } from 'mongoose';
import { ActionModel } from './action-model';
import { ChefModel } from './chef-model';
import { EmailTokenModel } from './email-token-model';
import { GameModel } from './game-model';
import { UserModel } from './user-model';

export const getModelTable: { [key in ModelName]: unknown } = {
  [ModelName.User]: UserModel,
  [ModelName.Chef]: ChefModel,
  [ModelName.EmailToken]: EmailTokenModel,
  [ModelName.Action]: ActionModel,
  [ModelName.Game]: GameModel,
};

export const getModel: GetModelFunction = <T>(modelName: ModelName) => {
  return getModelTable[modelName] as Model<T>;
};
