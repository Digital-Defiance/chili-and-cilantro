import {
  AccountStatusTypeEnum,
  IUserDocument,
  ModelName,
  StringLanguages,
  StringNames,
  constants,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import validator from 'validator';

/**
 * A user in the system.
 */
export const UserSchema = new Schema<IUserDocument>(
  {
    /**
     * The user's email address, used for login if accountType is email/password.
     * Used for sending notifications, regardless.
     */
    email: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      required: true,
      trim: true,
      validate: {
        validator: async function (value: any) {
          return validator.isEmail(value);
        },
        message: (props: any) => {
          return translate(StringNames.Validation_InvalidEmail);
        },
      },
    },
    emailVerified: { type: Boolean, default: false },
    /**
     * The status of the user's account.
     */
    accountStatusType: {
      type: String,
      enum: Object.values(AccountStatusTypeEnum),
      required: true,
    },
    /**
     * The timezone of the user.
     */
    timezone: { type: String, required: true },
    /**
     * The user's site language.
     */
    siteLanguage: { type: String, enum: Object.values(StringLanguages) },
    /**
     * The unique @username of the user.
     */
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: constants.USERNAME_REGEX,
      minlength: 3,
      maxlength: 20,
    },
    displayName: {
      type: String,
      trim: true,
      match: constants.USER_DISPLAY_NAME_REGEX,
      minlength: constants.MIN_USER_DISPLAY_NAME_LENGTH,
      maxlength: constants.MAX_USER_DISPLAY_NAME_LENGTH,
    },
    /**
     * The hashed password of the user.
     */
    password: {
      type: String,
      required: true,
      trim: true,
      match: constants.PASSWORD_HASH_REGEX,
    },
    /**
     * User's last login date/time.
     * See also logins collection.
     */
    lastLogin: { type: Date, optional: true },
    /**
     * The user who last updated the user.
     */
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: ModelName.User,
      optional: true,
    },
    /**
     * The date/time the user was deleted.
     */
    deletedAt: { type: Date, optional: true },
    /**
     * The user who deleted the user.
     */
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: ModelName.User,
      optional: true,
    },
  },
  { timestamps: true },
);
