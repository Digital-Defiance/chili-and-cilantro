import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IPassDetails } from './details/pass';

export interface IPassAction<I = DefaultIdType>
  extends IAction<I, IPassDetails> {}
