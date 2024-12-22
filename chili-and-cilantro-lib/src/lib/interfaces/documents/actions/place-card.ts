import { DefaultIdType } from '../../../shared-types';
import { IPlaceCardDetails } from '../../models/actions/details/place-card';
import { IPlaceCardAction } from '../../models/actions/place-card';
import { IActionDocument } from '../action';

export interface IPlaceCardActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IPlaceCardDetails<I>>,
    IPlaceCardAction<I> {}
