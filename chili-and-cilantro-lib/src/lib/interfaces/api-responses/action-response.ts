import { IActionDocument } from '../documents/action';
import { IApiMessageResponse } from './api-message-response';

export interface IActionResponse<T extends IActionDocument>
  extends IApiMessageResponse {
  action: T;
}
