import {
  EmailTokenType,
  IEmailTokenDocument,
  ModelName,
  StringNames,
  constants,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { randomBytes } from 'crypto';
import { Schema, ValidatorProps } from 'mongoose';
import validator from 'validator';

const generateRandomToken = () => {
  return randomBytes(constants.EMAIL_TOKEN_LENGTH).toString('hex');
};

/**
 * Schema for email tokens sent to users to verify their accounts or reset passwords
 */
export const EmailTokenSchema = new Schema<IEmailTokenDocument>({
  /**
   * The user ID associated with the token
   */
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ModelName.User,
    immutable: true,
  },
  /**
   * The type of email token, eg 'AccountVerification', 'PasswordReset'
   */
  type: {
    type: String,
    enum: Object.values(EmailTokenType),
    required: true,
    immutable: true,
  },
  /**
   * The token value
   */
  token: {
    type: String,
    default: generateRandomToken,
    required: true,
    null: false,
    immutable: true,
    minLength: constants.EMAIL_TOKEN_LENGTH * 2,
    maxLength: constants.EMAIL_TOKEN_LENGTH * 2,
  },
  /**
   * The email address associated with the token
   */
  email: {
    type: String,
    required: true,
    null: false,
    immutable: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: (props: ValidatorProps) =>
        translate(StringNames.Validation_InvalidEmail),
    },
  },
  /**
   * The date the token was last emailed to the user
   */
  lastSent: { type: Date, default: null },
  /**
   * The date the token was created
   */
  createdAt: { type: Date, default: Date.now, immutable: true },
  /**
   * The date the token expires
   */
  expiresAt: { type: Date, default: Date.now, index: { expires: '1d' } },
});

EmailTokenSchema.index({ userId: 1, email: 1 }, { unique: true });
EmailTokenSchema.index({ token: 1 }, { unique: true });
