import { IAction } from './action';
import { ICreateGameDetails } from './createGameDetails';

export interface ICreateGameAction extends IAction {
  details: ICreateGameDetails;
}
