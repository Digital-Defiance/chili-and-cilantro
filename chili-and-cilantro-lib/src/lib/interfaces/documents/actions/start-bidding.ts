import { IStartBiddingAction } from '../../models/actions/start-bidding';
import { IBaseDocument } from '../base';

export interface IStartBiddingActionDocument
  extends IStartBiddingAction,
    IBaseDocument<IStartBiddingAction> {}
