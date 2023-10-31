import { BaseModel, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IDatabase } from '../interfaces/database';
import { Model } from 'mongoose';

export class Database implements IDatabase {
  getModel<T>(modelName: ModelName): Model<T> {
    return BaseModel.getModel<T>(modelName);
  }
}