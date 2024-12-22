import { IHasID } from '../../has-id';
import { IStartBiddingAction } from '../../models/actions/start-bidding';

export interface IStartBiddingActionObject
  extends IStartBiddingAction<string>,
    IHasID<string> {}
