import { IApiMessageResponse } from './api-message-response';

export interface ITokenResponse extends IApiMessageResponse {
  token: string;
}
