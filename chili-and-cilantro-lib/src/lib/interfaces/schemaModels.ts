import { Model } from 'mongoose';
import { IUser } from './user';
import { IGame } from './game';
import { IAction } from './action';
import { IChef } from './chef';

export interface ISchemaModels {
  Action: Model<IAction>;
  Chef: Model<IChef>;
  Game: Model<IGame>;
  User: Model<IUser>;
}
