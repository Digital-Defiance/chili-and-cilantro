import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IStartBiddingDetails } from './details/start-bidding';

export type IStartBiddingAction<I = DefaultIdType> = IAction<
  I,
  IStartBiddingDetails<I>
>;
