import { DefaultIdType } from '../shared-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasCreator<I = DefaultIdType> {
  /**
   * The MongoDB unique identifier for the user who created the object.
   */
  createdBy: I;
}
