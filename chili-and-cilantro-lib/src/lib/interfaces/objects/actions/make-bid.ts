import { IHasID } from '../../has-id';
import { IMakeBidAction } from '../../models/actions/make-bid';

export interface IMakeBidActionObject
  extends IMakeBidAction<string>,
    IHasID<string> {}
