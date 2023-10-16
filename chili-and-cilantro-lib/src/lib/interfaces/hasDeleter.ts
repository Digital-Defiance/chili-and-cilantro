import { IUser } from './user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasDeleter {
  /**
   * The MongoDB unique identifier for the user who deleted the object.
   */
  deletedBy?: IUser['_id'];
}
