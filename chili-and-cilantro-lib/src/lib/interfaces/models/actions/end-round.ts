import { Types } from 'mongoose';
import { IAction } from '../action';
import { IEndRoundDetails } from './details/end-round';

export interface IEndRoundAction<T = Types.ObjectId> extends IAction<T> {
  details: IEndRoundDetails;
}
