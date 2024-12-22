import { IApiMessageResponse } from './api-message-response';

export interface IPusherAppInfoResponse extends IApiMessageResponse {
  appKey: string;
  cluster: string;
}
