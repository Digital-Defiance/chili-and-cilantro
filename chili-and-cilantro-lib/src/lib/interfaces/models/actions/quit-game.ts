import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IQuitGameDetails } from './details/quit-game';

export interface IQuitGameAction<I = DefaultIdType>
  extends IAction<I, IQuitGameDetails> {}
