import { Model } from 'mongoose';
import { IUser } from './user';
import { IGame } from './game';
import { IAction } from './action';
import { IPlayer } from './player';

export interface ISchemaModels {
  Action: Model<IAction>;
  Game: Model<IGame>;
  Player: Model<IPlayer>;
  User: Model<IUser>;
}
