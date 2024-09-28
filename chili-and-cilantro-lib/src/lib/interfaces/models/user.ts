import { AccountStatusTypeEnum } from '../../enumerations/account-status-type';
import { StringLanguages } from '../../enumerations/string-languages';
import { IHasSoftDelete } from '../has-soft-delete';
import { IHasSoftDeleter } from '../has-soft-deleter';
import { IHasTimestampOwners } from '../has-timestamp-owners';
import { IHasTimestamps } from '../has-timestamps';

export interface IUser
  extends IHasTimestamps,
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
   * The user's email address, used for login if accountType is email/password.
   * Used for sending notifications, regardless.
   */
  email: string;
  /**
   * Whether the user's email address has been verified.
   */
  emailVerified: boolean;
  /**
   * The status of the user's account.
   */
  accountStatusType: AccountStatusTypeEnum;
  /**
   * The user's timezone.
   */
  timezone: string;
  /**
   * The user's site language.
   */
  siteLanguage: StringLanguages;
  /**
   * The date the user last logged in.
   */
  lastLogin?: Date;
}
