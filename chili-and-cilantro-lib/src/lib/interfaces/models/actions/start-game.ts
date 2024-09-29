import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IStartGameDetails } from './details/start-game';

export interface IStartGameAction<I = DefaultIdType>
  extends IAction<I, IStartGameDetails> {}
