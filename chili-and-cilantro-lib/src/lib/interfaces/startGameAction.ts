import { IAction } from './action';
import { IStartGameDetails } from './startGameDetails';

export interface IStartGameAction extends IAction {
  details: IStartGameDetails;
}
