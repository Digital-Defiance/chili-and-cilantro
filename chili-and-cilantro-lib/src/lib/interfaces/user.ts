/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import { ObjectId } from 'mongoose';
import { IHasID } from './hasId';
import { IHasSoftDelete } from './hasSoftDelete';
import { IHasTimestampOwners } from './hasTimestampOwners';
import { IHasTimestamps } from './hasTimestamps';
import { IHasDeleter } from './hasDeleter';

export interface IUser
  extends IHasID,
  IHasTimestamps,
  IHasTimestampOwners,
  IHasSoftDelete,
  IHasDeleter {
  _id?: ObjectId;
  auth0Id: string;
  username: string;
  givenName: string;
  surname: string;
  userPrincipalName: string;
  // Chili and Cilantro specific fields
  /**
   * The user's email address, used for login if accountType is email/password.
   * Used for sending notifications, regardless.
   */
  email: string;
  email_verified: boolean;
  // metadata
  lastLogin?: Date;
}
