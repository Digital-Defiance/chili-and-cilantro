import { DefaultIdType } from '../../../shared-types';
import { IMakeBidDetails } from '../../models/actions/details/make-bid';
import { IMakeBidAction } from '../../models/actions/make-bid';
import { IActionDocument } from '../action';

export interface IMakeBidActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IMakeBidDetails>,
    IMakeBidAction<I> {}
