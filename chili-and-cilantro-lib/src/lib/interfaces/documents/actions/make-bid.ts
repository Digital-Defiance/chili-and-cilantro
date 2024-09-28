import { IMakeBidAction } from '../../models/actions/make-bid';
import { IBaseDocument } from '../base';

export interface IMakeBidActionDocument
  extends IMakeBidAction,
    IBaseDocument<IMakeBidAction> {}
