import { Types } from 'mongoose';
import { IAction } from '../action';
import { IStartGameDetails } from './details/start-game';

export interface IStartGameAction<T = Types.ObjectId> extends IAction<T> {
  details: IStartGameDetails;
}
