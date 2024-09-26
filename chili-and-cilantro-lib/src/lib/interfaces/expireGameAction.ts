import { IAction } from './action';
import { IExpireGameDetails } from './expireGameDetails';

export interface IExpireGameAction extends IAction {
  details: IExpireGameDetails;
}
