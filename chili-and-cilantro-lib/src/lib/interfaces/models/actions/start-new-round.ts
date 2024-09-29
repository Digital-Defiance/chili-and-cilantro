import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IStartNewRoundDetails } from './details/start-new-round';

export interface IStartNewRoundAction<I = DefaultIdType>
  extends IAction<I, IStartNewRoundDetails> {}
