import { Types } from 'mongoose';
import { ActionType } from '../../enumerations/action-type';
import { IHasTimestamps } from '../has-timestamps';

export interface IAction extends IHasTimestamps {
  gameId: Types.ObjectId;
  chefId: Types.ObjectId;
  userId: Types.ObjectId;
  type: ActionType;
  details: object;
  round: number;
}
