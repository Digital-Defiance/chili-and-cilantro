import { IActionDocument } from '../documents/action';
import { IActionObject } from '../objects/action';
import { IApiMessageResponse } from './api-message-response';

export interface IActionResponse<T extends IActionDocument | IActionObject>
  extends IApiMessageResponse {
  action: T;
}
