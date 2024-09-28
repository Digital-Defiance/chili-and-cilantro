import { StringLanguages } from '../enumerations/string-languages';

/**
 * Interface for the user object stored in the request object
 */
export interface IRequestUser {
  /**
   * The ID of the user
   */
  id: string;
  /**
   * The username of the user
   */
  username: string;
  /**
   * The display name of the user
   */
  displayName: string;
  /**
   * The email address of the user
   */
  email: string;
  /**
   * The timezone of the user
   */
  timezone: string;
  /**
   * The language the user has selected for the site
   */
  siteLanguage: StringLanguages;
  /**
   * The date the user last logged in
   */
  lastLogin?: Date;
  /**
   * Whether the user has verified their email address
   */
  emailVerified: boolean;
}
