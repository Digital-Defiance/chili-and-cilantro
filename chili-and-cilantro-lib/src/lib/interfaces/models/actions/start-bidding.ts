import { Types } from 'mongoose';
import { IAction } from '../action';
import { IStartBiddingDetails } from './details/start-bidding';

export interface IStartBiddingAction<T = Types.ObjectId> extends IAction<T> {
  details: IStartBiddingDetails;
}
