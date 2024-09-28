import { IHasID } from '../../has-id';
import { IPlaceCardAction } from '../../models/actions/place-card';

export interface IPlaceCardActionObject extends IPlaceCardAction, IHasID {}
