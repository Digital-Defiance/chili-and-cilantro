import { IChefObject } from '../objects/chef';
import { IGameObject } from '../objects/game';
import { IApiMessageResponse } from './api-message-response';

export interface IGameChefsResponse extends IApiMessageResponse {
  game: IGameObject;
  chefs: IChefObject[];
}
