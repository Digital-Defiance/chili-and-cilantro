import { IApiMessageResponse } from './api-message-response';

export interface IApiErrorResponse extends IApiMessageResponse {
  error: unknown;
}
