import { Types } from 'mongoose';
import { IAction } from '../action';
import { IFlipCardDetails } from './details/flip-card';

export interface IFlipCardAction<T = Types.ObjectId> extends IAction<T> {
  details: IFlipCardDetails;
}
