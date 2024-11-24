import { Types } from 'mongoose';
import { IAction } from '../action';
import { IStartNewRoundDetails } from './details/start-new-round';

export interface IStartNewRoundAction<T = Types.ObjectId> extends IAction<T> {
  details: IStartNewRoundDetails;
}
