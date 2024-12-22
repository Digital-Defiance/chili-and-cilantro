import { DefaultIdType } from '../shared-types';

export interface IBid<I = DefaultIdType> {
  /**
   * The chef who made the bid or pass
   */
  chefId: I;
  /**
   * The new bid amount. If the chef is passing, the bid remains the same.
   */
  bid: number;
  /**
   * Whether the chef is passing or not
   */
  pass: boolean;
}
