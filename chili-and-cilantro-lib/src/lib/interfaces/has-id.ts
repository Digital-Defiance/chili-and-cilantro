import { DefaultIdType } from '../shared-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasID<I = DefaultIdType> {
  /**
   * The MongoDB unique identifier for the object.
   */
  _id?: I;
}
