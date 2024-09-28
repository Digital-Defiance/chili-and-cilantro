import { Types } from 'mongoose';
import { EmailTokenType } from '../../enumerations/email-token-type';
import { IHasCreation } from '../has-creation';

/**
 * Base interface for email token collection documents
 */
export interface IEmailToken extends IHasCreation {
  /**
   * The user ID associated with the token
   */
  userId: Types.ObjectId;
  /**
   * The type of token
   */
  type: EmailTokenType;
  /**
   * The token value
   */
  token: string;
  /**
   * The email address the token was sent to
   */
  email: string;
  /**
   * The date the token was last sent
   */
  lastSent: Date | null;
  /**
   * The date the token expires
   */
  expiresAt: Date;
}
