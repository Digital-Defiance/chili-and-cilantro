import { IAction } from '../action';
import { IPassDetails } from './details/pass';

export interface IPassAction extends IAction {
  details: IPassDetails;
}
