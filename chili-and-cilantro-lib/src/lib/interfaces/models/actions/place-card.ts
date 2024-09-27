import { IAction } from '../action';
import { IPlaceCardDetails } from './details/place-card';

export interface IPlaceCardAction extends IAction {
  details: IPlaceCardDetails;
}
