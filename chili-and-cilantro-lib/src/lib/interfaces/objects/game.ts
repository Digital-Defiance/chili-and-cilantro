import { IHasID } from '../has-id';
import { IGame } from '../models/game';

export interface IGameObject extends IGame, IHasID {}
