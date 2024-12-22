import { IGameAction } from '../game-action';
import { IActionObject } from '../objects/action';
import { IGameObject } from '../objects/game';
import { IApiMessageResponse } from './api-message-response';

export interface IGameActionResponse
  extends IApiMessageResponse,
    IGameAction<IGameObject, IActionObject> {}
