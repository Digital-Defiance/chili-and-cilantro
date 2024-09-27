import { IAction } from '../action';
import { IStartNewRoundDetails } from './details/start-new-round';

export interface IStartNewRoundAction extends IAction {
  details: IStartNewRoundDetails;
}
