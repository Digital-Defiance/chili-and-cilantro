import { IAction } from '../action';
import { IEndGameDetails } from './details/end-game';

export interface IEndGameAction extends IAction {
  details: IEndGameDetails;
}
