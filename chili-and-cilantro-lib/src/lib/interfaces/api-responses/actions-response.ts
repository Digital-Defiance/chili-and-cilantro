import { IActionObject } from '../objects/action';
import { IApiMessageResponse } from './api-message-response';

export interface IActionsResponse extends IApiMessageResponse {
  actions: IActionObject[];
}
