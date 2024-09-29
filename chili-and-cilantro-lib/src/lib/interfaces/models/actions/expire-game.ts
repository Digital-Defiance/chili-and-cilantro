import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IExpireGameDetails } from './details/expire-game';

export interface IExpireGameAction<I = DefaultIdType>
  extends IAction<I, IExpireGameDetails> {}
