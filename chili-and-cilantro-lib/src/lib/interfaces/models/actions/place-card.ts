import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IPlaceCardDetails } from './details/place-card';

export interface IPlaceCardAction<I = DefaultIdType>
  extends IAction<I, IPlaceCardDetails> {}
