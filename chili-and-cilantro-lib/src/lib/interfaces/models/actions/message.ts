import { Types } from 'mongoose';
import { IAction } from '../action';
import { IMessageDetails } from './details/message';

export interface IMessageAction<T = Types.ObjectId> extends IAction<T> {
  details: IMessageDetails;
}
