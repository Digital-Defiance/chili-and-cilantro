import { IHasSoftDeleter } from '../has-soft-deleter';
import { IHasSoftDelete } from '../has-soft-delete';
import { IHasTimestampOwners } from '../has-timestamp-owners';
import { IHasTimestamps } from '../has-timestamps';

export interface IUser
  extends
    IHasTimestamps,
    IHasTimestampOwners,
    IHasSoftDelete,
    IHasSoftDeleter {
  /**
   * The username of the user.
   */
  username: string;
  /**
   * The hashed password of the user.
   */
  password: string;
  /**
   * The user's given name.
   */
  givenName: string;
  /**
   * The user's surname.
   */
  surname: string;
  /**
   * The user's display name.
   */
  userPrincipalName: string;
  /**
   * The user's email address, used for login if accountType is email/password.
   * Used for sending notifications, regardless.
   */
  email: string;
  /**
   * Whether the user's email address has been verified.
   */
  emailVerified: boolean;
  /**
   * The date the user last logged in.
   */
  lastLogin?: Date;
}
