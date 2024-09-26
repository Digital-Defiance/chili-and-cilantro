import { Schema } from 'mongoose';

export interface IBid {
  /**
   * The chef who made the bid or pass
   */
  chefId: Schema.Types.ObjectId;
  /**
   * The new bid amount. If the chef is passing, the bid remains the same.
   */
  bid: number;
  /**
   * Whether the chef is passing or not
   */
  pass: boolean;
}
