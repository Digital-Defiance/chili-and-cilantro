import { DefaultIdType } from '../../../shared-types';
import { IStartBiddingDetails } from '../../models/actions/details/start-bidding';
import { IStartBiddingAction } from '../../models/actions/start-bidding';
import { IActionDocument } from '../action';

export interface IStartBiddingActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IStartBiddingDetails<I>>,
    IStartBiddingAction<I> {}
