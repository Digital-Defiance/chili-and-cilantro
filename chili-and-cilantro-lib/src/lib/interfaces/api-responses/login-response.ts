import { IRequestUser } from '../request-user';
import { IApiMessageResponse } from './api-message-response';

export interface ILoginResponse extends IApiMessageResponse {
  user: IRequestUser;
  token: string;
}
