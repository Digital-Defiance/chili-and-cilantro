import { IAction } from '../action';
import { IEndRoundDetails } from './details/end-round';

export interface IEndRoundAction extends IAction {
  details: IEndRoundDetails;
}
