import { DefaultIdType } from '../../shared-types';
import { IGame } from '../models/game';
import { IBaseDocument } from './base';

export interface IGameDocument<I = DefaultIdType>
  extends IBaseDocument<IGame<I>, I>,
    IGame<I> {}
