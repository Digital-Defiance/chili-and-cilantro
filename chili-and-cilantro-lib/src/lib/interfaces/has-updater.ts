import { DefaultIdType } from '../shared-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasUpdater<I = DefaultIdType> {
  /**
   * The MongoDB unique identifier for the user who updated the object.
   */
  updatedBy: I;
}
