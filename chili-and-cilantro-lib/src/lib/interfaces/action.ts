import { Schema } from 'mongoose';
import { Action } from '../enumerations/action';
import { IHasID } from './hasId';
import { IHasTimestamps } from './hasTimestamps';

export interface IAction extends IHasID, IHasTimestamps {
  gameId: Schema.Types.ObjectId;
  chefId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  type: Action;
  details: object;
  round: number;
}
