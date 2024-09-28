import { IPlaceCardAction } from '../../models/actions/place-card';
import { IBaseDocument } from '../base';

export interface IPlaceCardActionDocument
  extends IPlaceCardAction,
    IBaseDocument<IPlaceCardAction> {}
