import { IAction } from '../action';
import { IStartBiddingDetails } from './details/start-bidding';

export interface IStartBiddingAction extends IAction {
  details: IStartBiddingDetails;
}
