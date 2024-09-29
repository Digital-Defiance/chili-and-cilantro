import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IStartBiddingDetails } from './details/start-bidding';

export interface IStartBiddingAction<I = DefaultIdType>
  extends IAction<I, IStartBiddingDetails> {}
