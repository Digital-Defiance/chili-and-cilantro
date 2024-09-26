import { IAction } from './action';
import { IMessageDetails } from './messageDetails';

export interface IMessageAction extends IAction {
  details: IMessageDetails;
}
