import { IAction } from '../action';
import { ICreateGameDetails } from './details/create-game';

export interface ICreateGameAction extends IAction {
  details: ICreateGameDetails;
}
