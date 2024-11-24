import { Types } from 'mongoose';
import { IAction } from '../action';
import { IEndGameDetails } from './details/end-game';

export interface IEndGameAction<T = Types.ObjectId> extends IAction<T> {
  details: IEndGameDetails;
}
