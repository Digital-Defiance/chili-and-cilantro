import { Model } from 'mongoose';
import { IUser } from './user';
import { IGame } from './game';

export interface ISchemaModels {
  User: Model<IUser>;
  Game: Model<IGame>;
}
