import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IMakeBidDetails } from './details/make-bid';

export interface IMakeBidAction<I = DefaultIdType>
  extends IAction<I, IMakeBidDetails> {}
