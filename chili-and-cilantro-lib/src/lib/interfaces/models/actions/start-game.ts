import { IAction } from '../action';
import { IStartGameDetails } from './details/start-game';

export interface IStartGameAction extends IAction {
  details: IStartGameDetails;
}
