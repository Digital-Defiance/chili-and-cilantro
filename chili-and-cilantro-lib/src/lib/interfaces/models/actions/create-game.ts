import { Types } from 'mongoose';
import { IAction } from '../action';
import { ICreateGameDetails } from './details/create-game';

export interface ICreateGameAction<T = Types.ObjectId> extends IAction<T> {
  details: ICreateGameDetails;
}
