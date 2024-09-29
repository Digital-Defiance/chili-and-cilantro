import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IJoinGameDetails } from './details/join-game';

export interface IJoinGameAction<I = DefaultIdType>
  extends IAction<I, IJoinGameDetails> {}
