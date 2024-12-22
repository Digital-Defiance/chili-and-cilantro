import { TurnAction } from '../../enumerations/turn-action';
import { IApiMessageResponse } from './api-message-response';

export interface ITurnActionsResponse extends IApiMessageResponse {
  actions: TurnAction[];
}
