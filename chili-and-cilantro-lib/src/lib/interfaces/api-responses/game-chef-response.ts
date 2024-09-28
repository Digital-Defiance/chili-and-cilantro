import { IChefObject } from '../objects/chef';
import { IGameObject } from '../objects/game';
import { IApiMessageResponse } from './api-message-response';

export interface IGameChefResponse extends IApiMessageResponse {
  game: IGameObject;
  chef: IChefObject;
}
