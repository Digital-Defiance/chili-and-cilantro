import { Types } from 'mongoose';
import { IAction } from '../action';
import { IQuitGameDetails } from './details/quit-game';

export interface IQuitGameAction<T = Types.ObjectId> extends IAction<T> {
  details: IQuitGameDetails;
}
