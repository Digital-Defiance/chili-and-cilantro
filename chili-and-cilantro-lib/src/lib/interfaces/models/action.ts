import { Types } from 'mongoose';
import { ActionType } from '../../enumerations/action-type';
import { IHasTimestamps } from '../has-timestamps';

export interface IAction<T = Types.ObjectId> extends IHasTimestamps {
  gameId: T;
  chefId: T;
  userId: T;
  type: ActionType;
  details: object;
  round: number;
}
