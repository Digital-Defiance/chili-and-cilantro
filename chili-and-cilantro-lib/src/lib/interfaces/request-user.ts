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
   * The email address of the user
   */
  email: string;
  /**
   * The timezone of the user
   */
  timezone: string;
  /**
   * The date the user last logged in
   */
  lastLogin?: Date;
  /**
   * Whether the user has verified their email address
   */
  emailVerified: boolean;
}
