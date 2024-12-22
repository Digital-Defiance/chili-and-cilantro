import { IRequestUser } from '../request-user';
import { IApiMessageResponse } from './api-message-response';

export interface IRequestUserResponse extends IApiMessageResponse {
  user: IRequestUser;
}
