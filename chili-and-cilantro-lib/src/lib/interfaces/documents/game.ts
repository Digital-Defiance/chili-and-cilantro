import { IGame } from '../models/game';
import { IBaseDocument } from './base';

export interface IGameDocument extends IGame, IBaseDocument<IGame> {}
