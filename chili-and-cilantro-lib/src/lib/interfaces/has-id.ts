import { Types } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasID<T = Types.ObjectId> {
  /**
   * The MongoDB unique identifier for the object.
   */
  _id?: T;
}
