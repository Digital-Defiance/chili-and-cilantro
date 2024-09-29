import { EmailTokenType } from '../../enumerations/email-token-type';
import { DefaultIdType } from '../../shared-types';
import { IHasCreation } from '../has-creation';

/**
 * Base interface for email token collection documents
 */
export interface IEmailToken<I = DefaultIdType> extends IHasCreation {
  /**
   * The user ID associated with the token
   */
  userId: I;
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
