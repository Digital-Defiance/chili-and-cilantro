import { IGameChefsHistory } from '../game-chefs-history';
import { IActionObject } from '../objects/action';
import { IChefObject } from '../objects/chef';
import { IGameObject } from '../objects/game';
import { IApiMessageResponse } from './api-message-response';

export interface IGameChefsHistoryResponse
  extends IApiMessageResponse,
    IGameChefsHistory<IGameObject, IChefObject, IActionObject> {}
