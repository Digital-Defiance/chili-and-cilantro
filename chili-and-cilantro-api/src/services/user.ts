import {
  AccountDeletedError,
  AccountLockedError,
  AccountStatusError,
  AccountStatusTypeEnum,
  constants,
  DefaultIdType,
  EmailInUseError,
  EmailTokenExpiredError,
  EmailTokenSentTooRecentlyError,
  EmailTokenType,
  EmailTokenUsedOrInvalidError,
  EmailVerifiedError,
  ICreateUserBasics,
  IEmailTokenDocument,
  InvalidCredentialsError,
  InvalidPasswordError,
  InvalidTokenError,
  InvalidUsernameError,
  IRequestUser,
  IUser,
  IUserDocument,
  IUserObject,
  ModelName,
  PendingEmailVerificationError,
  StringLanguages,
  UsernameInUseError,
  UsernameOrEmailRequiredError,
  UserNotFoundError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  IApplication,
  MongooseValidationError,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { MailDataRequired, MailService } from '@sendgrid/mail';
import { compare, hashSync } from 'bcrypt';
import { randomBytes } from 'crypto';
import { ClientSession, Types } from 'mongoose';
import { environment } from '../environment';
import { BaseService } from './base';
import { RequestUserService } from './request-user';

export class UserService extends BaseService {
  private readonly sendgridClient: MailService;
  constructor(
    application: IApplication,
    mailService: MailService,
    useTransactions = true,
  ) {
    super(application, useTransactions);
    this.sendgridClient = mailService;
    this.sendgridClient.setApiKey(environment.sendgridKey);
  }

  /**
   * Create a new email token to send to the user for email verification
   * @param userDoc The user to create the token for
   * @param type The type of email token
   * @returns The email token
   */
  public async createEmailToken(
    userDoc: IUserDocument,
    type: EmailTokenType,
  ): Promise<IEmailTokenDocument> {
    const EmailTokenModel = this.application.getModel<IEmailTokenDocument>(
      ModelName.EmailToken,
    );
    // delete any expired tokens for the same user and email to prevent index constraint conflicts
    await EmailTokenModel.deleteMany({
      userId: userDoc.id,
      email: userDoc.email,
      expiresAt: { $lt: new Date() },
    });
    const emailTokens = await EmailTokenModel.create([
      {
        userId: userDoc.id,
        type: type,
        email: userDoc.email,
        token: randomBytes(constants.EMAIL_TOKEN_LENGTH).toString('hex'),
        lastSent: null,
        createdAt: Date.now(),
        expiresAt: new Date(Date.now() + constants.EMAIL_TOKEN_EXPIRATION),
      },
    ]);
    if (emailTokens.length !== 1) {
      throw new Error('Failed to create email token');
    }
    return emailTokens[0];
  }

  /**
   * Send an email token to the user for email verification
   * @param emailToken The email token to send
   */
  public async sendEmailToken(emailToken: IEmailTokenDocument): Promise<void> {
    if (
      emailToken.lastSent &&
      emailToken.lastSent.getTime() + constants.EMAIL_TOKEN_RESEND_INTERVAL >
        Date.now()
    ) {
      throw new EmailTokenSentTooRecentlyError(emailToken.lastSent);
    }
    const verifyUrl = `${environment.siteUrl}/verify-email?token=${emailToken.token}`;
    const passwordUrl = `${environment.siteUrl}/forgot-password?token=${emailToken.token}`;
    let msg: MailDataRequired;
    switch (emailToken.type) {
      case EmailTokenType.AccountVerification:
        msg = {
          to: emailToken.email,
          from: constants.EMAIL_FROM,
          subject: `${constants.APPLICATION_NAME} email confirmation`,
          text: `Please click the link below to confirm your email.\r\n\r\n${verifyUrl}`,
          html: `<p>Please click the link below to confirm your email.</p><br/><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>Link expires in ${constants.EMAIL_TOKEN_RESEND_INTERVAL / 1000} minutes.</p>`,
        };
        break;
      case EmailTokenType.PasswordReset:
        msg = {
          to: emailToken.email,
          from: constants.EMAIL_FROM,
          subject: `${constants.APPLICATION_NAME} password reset`,
          text: `Please click the link below to reset your password.\r\n\r\n${passwordUrl}`,
          html: `<p>Please click the link below to reset your password.</p><br/><p><a href="${passwordUrl}">${passwordUrl}</a></p><p>Link expires in ${constants.EMAIL_TOKEN_RESEND_INTERVAL / 1000} minutes.</p>`,
        };
        break;
      default:
        throw new InvalidTokenError();
    }
    try {
      await this.sendgridClient.send(msg);
      console.log(`Email token sent to ${emailToken.email}`);
      // update lastSent/expiration
      emailToken.lastSent = new Date();
      emailToken.expiresAt = new Date(
        Date.now() + constants.EMAIL_TOKEN_EXPIRATION,
      );
      await emailToken.save();
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Find a user by their email or username and password.
   * @param password
   * @param email
   * @param username
   * @returns
   */
  public async findUser(
    password: string,
    email?: string,
    username?: string,
  ): Promise<IUserDocument> {
    const UserModel = this.application.getModel<IUserDocument>(ModelName.User);
    let userDoc: IUserDocument | null;

    if (username) {
      userDoc = await UserModel.findOne({
        username: { $regex: new RegExp(`^${username}$`, 'i') },
      });
    } else if (email) {
      userDoc = await UserModel.findOne({ email: email.toLowerCase() });
    } else {
      // This should never happen due to our validation, but it's good to have as a fallback
      throw new UsernameOrEmailRequiredError();
    }

    if (!userDoc) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await compare(password, userDoc.password);
    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    switch (userDoc.accountStatusType) {
      case AccountStatusTypeEnum.Active:
        break;
      case AccountStatusTypeEnum.Locked:
        throw new AccountLockedError();
      case AccountStatusTypeEnum.NewUnverified:
        throw new PendingEmailVerificationError();
      case AccountStatusTypeEnum.AdminDelete:
      case AccountStatusTypeEnum.SelfDelete:
      case AccountStatusTypeEnum.SelfDeleteWaitPeriod:
        throw new AccountDeletedError();
      default:
        throw new AccountStatusError(userDoc.accountStatusType);
    }

    return userDoc;
  }

  /**
   * Fill in the default values to a user object
   * @param newUser The user's basic information
   * @param createdBy The user that created the user
   * @returns
   */
  public fillUserDefaults(
    newUser: ICreateUserBasics,
    createdBy?: DefaultIdType,
  ): IUserObject {
    const now = new Date();
    const userId = new Types.ObjectId();
    const createdById = createdBy || userId;
    return {
      _id: userId,
      timezone: 'UTC',
      ...newUser,
      email: newUser.email.toLowerCase(),
      emailVerified: false,
      accountStatusType: AccountStatusTypeEnum.NewUnverified,
      password: '',
      createdAt: now,
      createdBy: createdById,
      updatedAt: now,
      updatedBy: createdById,
    } as IUserObject;
  }

  /**
   * Create a new user document from an IUser and unhashed password
   * @param newUser
   * @param password Unhashed password
   * @returns
   */
  public makeUserDoc(newUser: IUser, password: string): IUserDocument {
    const UserModel = this.application.getModel<IUserDocument>(ModelName.User);
    const newUserData: IUser = {
      ...newUser,
      password: hashSync(password, constants.BCRYPT_ROUNDS),
    } as IUser;
    const newUserDoc: IUserDocument = new UserModel(newUserData);

    const validationError = newUserDoc.validateSync();
    if (validationError) {
      throw new MongooseValidationError(validationError.errors);
    }

    return newUserDoc;
  }

  /**
   * Create a new user
   * @param userData The user's basic information
   * @param password The user's password
   * @returns
   */
  public async newUser(
    userData: ICreateUserBasics,
    password: string,
  ): Promise<IUserDocument> {
    const UserModel = this.application.getModel<IUserDocument>(ModelName.User);
    if (!constants.USERNAME_REGEX.test(userData.username)) {
      throw new InvalidUsernameError();
    }

    if (!constants.PASSWORD_REGEX.test(password)) {
      throw new InvalidPasswordError();
    }

    const existingEmailCount = await UserModel.countDocuments({
      email: userData.email.toLowerCase(),
    });
    if (existingEmailCount > 0) {
      throw new EmailInUseError();
    }

    const existingUsernameCount = await UserModel.countDocuments({
      username: { $regex: new RegExp(`^${userData.username}$`, 'i') },
    });
    if (existingUsernameCount > 0) {
      throw new UsernameInUseError();
    }

    const newUser: IUserDocument = this.makeUserDoc(
      this.fillUserDefaults(userData),
      password,
    );
    await newUser.save();

    const emailToken = await this.createEmailToken(
      newUser,
      EmailTokenType.AccountVerification,
    );
    try {
      await this.sendEmailToken(emailToken);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
    return newUser;
  }

  /**
   * Re-send a previously sent email token
   * @param userId
   */
  public async resendEmailToken(userId: string): Promise<void> {
    const EmailTokenModel = this.application.getModel<IEmailTokenDocument>(
      ModelName.EmailToken,
    );
    const now = new Date();
    const minLastSentTime = new Date(
      now.getTime() - constants.EMAIL_TOKEN_RESEND_INTERVAL,
    );

    // look up the most recent email token for a given user, then send it
    const emailToken: IEmailTokenDocument | null =
      await EmailTokenModel.findOne({
        userId,
        expiresAt: { $gt: now },
        $or: [{ lastSent: null }, { lastSent: { $lte: minLastSentTime } }],
      })
        .sort({ createdAt: -1 })
        .limit(1);

    if (!emailToken) {
      throw new EmailTokenUsedOrInvalidError();
    }

    await this.sendEmailToken(emailToken);
  }

  /**
   * Verifies an email token is valid and unexpired
   * @param emailToken
   * @returns
   */
  public async verifyEmailToken(emailToken: string): Promise<boolean> {
    const EmailTokenModel = this.application.getModel<IEmailTokenDocument>(
      ModelName.EmailToken,
    );
    const token: IEmailTokenDocument | null = await EmailTokenModel.findOne({
      token: emailToken,
    });

    if (!token) {
      throw new EmailTokenUsedOrInvalidError();
    }

    if (token.expiresAt < new Date()) {
      await EmailTokenModel.deleteOne({ _id: token._id });
      throw new EmailTokenExpiredError();
    }

    return true;
  }

  /**
   * Verify the email token and update the user's account status
   * @param emailToken
   */
  public async verifyEmailTokenAndFinalize(emailToken: string): Promise<void> {
    const EmailTokenModel = this.application.getModel<IEmailTokenDocument>(
      ModelName.EmailToken,
    );
    const UserModel = this.application.getModel<IUserDocument>(ModelName.User);
    const token: IEmailTokenDocument | null = await EmailTokenModel.findOne({
      token: emailToken,
    });

    if (!token) {
      throw new EmailTokenUsedOrInvalidError();
    }

    if (token.expiresAt < new Date()) {
      await EmailTokenModel.deleteOne({ _id: token._id });
      throw new EmailTokenExpiredError();
    }

    const user: IUserDocument | null = await UserModel.findById(token.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.emailVerified) {
      throw new EmailVerifiedError();
    }

    user.emailVerified = true;
    user.accountStatusType = AccountStatusTypeEnum.Active;
    await user.save();

    // Delete the token after successful verification
    await EmailTokenModel.deleteOne({ _id: token._id });
  }

  /**
   * Change the user's password
   * @param userId
   * @param currentPassword
   * @param newPassword
   */
  public async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const UserModel = this.application.getModel<IUserDocument>(ModelName.User);
    const user: IUserDocument | null = await UserModel.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    if (!constants.PASSWORD_REGEX.test(newPassword)) {
      throw new InvalidPasswordError();
    }

    user.password = hashSync(newPassword, constants.BCRYPT_ROUNDS);
    await user.save();
  }

  /**
   * Create a password reset record and send a password reset link
   * @param email
   * @returns
   */
  public async initiatePasswordReset(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    const UserModel = this.application.getModel<IUserDocument>(ModelName.User);
    try {
      const user = await UserModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        // We don't want to reveal whether an email exists in our system
        return {
          success: true,
          message:
            'If an account with that email exists, a password reset link has been sent.',
        };
      }

      // Check if the user's email is not verified
      if (!user.emailVerified) {
        return {
          success: false,
          message:
            'Please verify your email address before resetting your password.',
        };
      }

      // Create and send password reset token
      const emailToken = await this.createEmailToken(
        user,
        EmailTokenType.PasswordReset,
      );
      await this.sendEmailToken(emailToken);

      return {
        success: true,
        message: 'Password reset link has been sent to your email.',
      };
    } catch (error) {
      console.error('Error in initiatePasswordReset:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      };
    }
  }

  /**
   * Check if the given token is a valid email token for password reset
   * @param token
   * @returns
   */
  public async validatePasswordResetToken(
    token: string,
  ): Promise<IEmailTokenDocument> {
    const EmailTokenModel = this.application.getModel<IEmailTokenDocument>(
      ModelName.EmailToken,
    );
    const emailToken = await EmailTokenModel.findOne({
      token,
      type: EmailTokenType.PasswordReset,
    });
    if (!emailToken) {
      throw new Error('Invalid or expired password reset token');
    }
    if (emailToken.expiresAt < new Date()) {
      await EmailTokenModel.deleteOne({ _id: emailToken._id });
      throw new Error('Password reset token has expired');
    }
    return emailToken;
  }

  /**
   * Reset a user's password given a valid token
   * @param token
   * @param password
   * @returns
   */
  public async resetPassword(
    token: string,
    password: string,
  ): Promise<IUserDocument> {
    const EmailTokenModel = this.application.getModel<IEmailTokenDocument>(
      ModelName.EmailToken,
    );
    const UserModel = this.application.getModel<IUserDocument>(ModelName.User);
    const emailToken = await EmailTokenModel.findOne({
      token,
      type: EmailTokenType.PasswordReset,
      expiresAt: { $gt: new Date() },
    });

    if (!emailToken) {
      throw new EmailTokenUsedOrInvalidError();
    }

    const user = await UserModel.findById(emailToken.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    // Hash the new password
    // Update the user's password
    user.password = hashSync(password, constants.BCRYPT_ROUNDS);
    await user.save();

    // Delete the used token
    await EmailTokenModel.deleteOne({ _id: emailToken._id });

    return user;
  }

  /**
   * Updates the user's language
   * @param userId - The ID of the user
   * @param newLanguage - The new language
   * @param session - The session to use for the query
   * @returns The updated user
   */
  public async updateSiteLanguage(
    userId: string,
    newLanguage: StringLanguages,
    session?: ClientSession,
  ): Promise<IRequestUser> {
    return await this.withTransaction<IRequestUser>(async (sess) => {
      const UserModel = this.application.getModel<IUserDocument>(
        ModelName.User,
      );
      const userDoc = await UserModel.findByIdAndUpdate(
        new Types.ObjectId(userId),
        {
          siteLanguage: newLanguage,
        },
        { new: true },
      ).session(sess ?? null);
      if (!userDoc) {
        throw new UserNotFoundError();
      }
      return RequestUserService.makeRequestUser(userDoc);
    }, session);
  }
}
