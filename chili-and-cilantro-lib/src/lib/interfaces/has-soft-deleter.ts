import { Types } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasSoftDeleter {
  /**
   * The MongoDB unique identifier for the user who deleted the object.
   */
  deletedBy?: Types.ObjectId;
}
