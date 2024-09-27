import { IAction } from '../action';
import { IExpireGameDetails } from './details/expire-game';

export interface IExpireGameAction extends IAction {
  details: IExpireGameDetails;
}
