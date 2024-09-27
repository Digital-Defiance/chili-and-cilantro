import { IAction } from '../action';
import { IFlipCardDetails } from './details/flip-card';

export interface IFlipCardAction extends IAction {
  details: IFlipCardDetails;
}
