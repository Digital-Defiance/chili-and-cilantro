import { IGameObject } from '../objects/game';
import { IApiMessageResponse } from './api-message-response';

export interface IGameListResponse extends IApiMessageResponse {
  participatingGames: IGameObject[];
  createdGames: IGameObject[];
}
