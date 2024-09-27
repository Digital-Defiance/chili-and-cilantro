import { IAction } from '../action';
import { IQuitGameDetails } from './details/quit-game';

export interface IQuitGameAction extends IAction {
  details: IQuitGameDetails;
}
