import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { ICreateGameDetails } from './details/create-game';

export interface ICreateGameAction<I = DefaultIdType>
  extends IAction<I, ICreateGameDetails> {}
