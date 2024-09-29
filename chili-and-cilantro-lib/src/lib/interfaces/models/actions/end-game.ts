import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IEndGameDetails } from './details/end-game';

export interface IEndGameAction<I = DefaultIdType>
  extends IAction<I, IEndGameDetails> {}
