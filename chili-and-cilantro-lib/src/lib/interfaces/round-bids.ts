import { DefaultIdType } from '../shared-types';
import { IBid } from './bid';

export interface IRoundBids<I = DefaultIdType> {
  bids: IBid<I>[];
}
