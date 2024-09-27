import { IAction } from '../action';
import { IMessageDetails } from './details/message';

export interface IMessageAction extends IAction {
  details: IMessageDetails;
}
