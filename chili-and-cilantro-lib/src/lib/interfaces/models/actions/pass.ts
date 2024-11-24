import { Types } from 'mongoose';
import { IAction } from '../action';
import { IPassDetails } from './details/pass';

export interface IPassAction<T = Types.ObjectId> extends IAction<T> {
  details: IPassDetails;
}
