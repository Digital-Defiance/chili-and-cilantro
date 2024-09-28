import { IRequestUser } from '../request-user';
import { IApiMessageResponse } from './api-message-response';

export interface IUserResponse extends IApiMessageResponse {
  user: IRequestUser;
}
