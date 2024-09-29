import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IFlipCardDetails } from './details/flip-card';

export interface IFlipCardAction<I = DefaultIdType>
  extends IAction<I, IFlipCardDetails> {}
