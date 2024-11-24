import { Types } from 'mongoose';
import { IAction } from '../action';
import { IPlaceCardDetails } from './details/place-card';

export interface IPlaceCardAction<T = Types.ObjectId> extends IAction<T> {
  details: IPlaceCardDetails;
}
