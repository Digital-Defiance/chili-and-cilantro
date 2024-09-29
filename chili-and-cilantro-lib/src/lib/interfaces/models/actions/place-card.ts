import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IPlaceCardDetails } from './details/place-card';

export type IPlaceCardAction<I = DefaultIdType> = IAction<I, IPlaceCardDetails>;
