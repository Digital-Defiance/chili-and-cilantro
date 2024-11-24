import { Types } from 'mongoose';
import { IAction } from '../action';
import { IMakeBidDetails } from './details/make-bid';

export interface IMakeBidAction<T = Types.ObjectId> extends IAction<T> {
  details: IMakeBidDetails;
}
