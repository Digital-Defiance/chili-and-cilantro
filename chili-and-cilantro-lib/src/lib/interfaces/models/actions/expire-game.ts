import { Types } from 'mongoose';
import { IAction } from '../action';
import { IExpireGameDetails } from './details/expire-game';

export interface IExpireGameAction<T = Types.ObjectId> extends IAction<T> {
  details: IExpireGameDetails;
}
