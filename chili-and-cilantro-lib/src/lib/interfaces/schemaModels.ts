import { Model } from 'mongoose';
import { IUser } from './user';

export interface ISchemaModels {
  User: Model<IUser>;
}
