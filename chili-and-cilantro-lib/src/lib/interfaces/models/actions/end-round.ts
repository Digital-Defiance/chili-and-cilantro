import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IEndRoundDetails } from './details/end-round';

export interface IEndRoundAction<I = DefaultIdType>
  extends IAction<I, IEndRoundDetails> {}
