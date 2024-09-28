import {
  AccountDeletedError,
  AccountLockedError,
  AccountStatusError,
  AccountStatusTypeEnum,
  EmailInUseError,
  EmailTokenExpiredError,
  EmailTokenSentTooRecentlyError,
  EmailTokenType,
  EmailTokenUsedOrInvalidError,
  EmailVerifiedError,
  IEmailTokenDocument,
  IUser,
  IUserDocument,
  InvalidCredentialsError,
  InvalidPasswordError,
  InvalidUsernameError,
  ModelName,
  PendingEmailVerificationError,
  UserNotFoundError,
  UsernameInUseError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  IApplication,
  MongooseValidationError,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { faker } from '@faker-js/faker';
import { MailService } from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import moment from 'moment-timezone';
import { Document, Model, Query, Types } from 'mongoose';
import { UserService } from '../../src/services/user';
import { MockApplication } from '../fixtures/application';
import { generateEmailToken } from '../fixtures/email-token';
import { generateUser } from '../fixtures/user';

jest.mock('@sendgrid/mail');
jest.mock('bcrypt');

describe('UserService', () => {
  let mailService: MailService;
  let userService: UserService;
  let mockApplication: IApplication;
  let mockUserModel: Model<IUserDocument>;
  let mockEmailTokenModel: Model<IEmailTokenDocument>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockApplication = new MockApplication();
    mockUserModel = mockApplication.getModel<IUserDocument>(ModelName.User);
    mockEmailTokenModel = mockApplication.getModel<IEmailTokenDocument>(
      ModelName.EmailToken,
    );

    mailService = {
      setApiKey: jest.fn(),
      send: jest.fn().mockImplementation(() => Promise.resolve()),
    } as unknown as MailService;
    userService = new UserService(mockApplication, mailService);
    console.error = jest.fn();
  });

  describe('createEmailToken', () => {
    it('should create a new email token', async () => {
      const userDoc = generateUser();
      const mockEmailToken = generateEmailToken({
        userId: userDoc._id,
      }) as unknown as Document<unknown, any, IEmailTokenDocument> &
        IEmailTokenDocument & { __v: any };
      const createSpy = jest
        .spyOn(mockEmailTokenModel, 'create')
        .mockResolvedValueOnce([mockEmailToken]);
      const deleteManySpy = jest
        .spyOn(mockEmailTokenModel, 'deleteMany')
        .mockResolvedValueOnce({
          deletedCount: 1,
          acknowledged: true,
        });

      const result = await userService.createEmailToken(
        userDoc,
        EmailTokenType.AccountVerification,
      );

      expect(deleteManySpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalled();
      expect(result).toEqual(mockEmailToken);
    });
  });

  describe('sendEmailToken', () => {
    it('should send an email token', async () => {
      const mockEmailToken = {
        _id: new Types.ObjectId(),
        email: 'test@example.com',
        token: 'mockToken',
        type: EmailTokenType.AccountVerification,
        lastSent: null,
        save: jest.fn(),
      } as unknown as IEmailTokenDocument;

      await userService.sendEmailToken(mockEmailToken);

      expect(mailService.send).toHaveBeenCalled();
      expect(mockEmailToken.save).toHaveBeenCalled();
    });

    it('should throw EmailTokenSentTooRecentlyError if token was sent recently', async () => {
      const mockEmailToken = {
        lastSent: new Date(),
      } as unknown as IEmailTokenDocument;

      await expect(userService.sendEmailToken(mockEmailToken)).rejects.toThrow(
        EmailTokenSentTooRecentlyError,
      );
    });
  });

  describe('findUser', () => {
    it('should find a user by email and password', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const mockUser = {
        _id: new Types.ObjectId(),
        email,
        password: 'hashedPassword',
        accountStatusType: AccountStatusTypeEnum.Active,
      };

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await userService.findUser(password, email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: email.toLowerCase(),
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw InvalidCredentialsError if user not found', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValueOnce(null);

      await expect(
        userService.findUser('password', 'nonexistent@example.com'),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it("should throw InvalidCredentialsError if password doesn't match", async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValueOnce({
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        userService.findUser('wrongpassword', 'test@example.com'),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it('should throw appropriate error based on account status', async () => {
      const testCases = [
        { status: AccountStatusTypeEnum.Locked, error: AccountLockedError },
        {
          status: AccountStatusTypeEnum.NewUnverified,
          error: PendingEmailVerificationError,
        },
        {
          status: AccountStatusTypeEnum.AdminDelete,
          error: AccountDeletedError,
        },
        {
          status: AccountStatusTypeEnum.SelfDelete,
          error: AccountDeletedError,
        },
        {
          status: AccountStatusTypeEnum.SelfDeleteWaitPeriod,
          error: AccountDeletedError,
        },
        {
          status: 'InvalidStatus' as AccountStatusTypeEnum,
          error: AccountStatusError,
        },
      ];

      for (const testCase of testCases) {
        jest.spyOn(mockUserModel, 'findOne').mockResolvedValueOnce({
          accountStatusType: testCase.status,
          password: 'hashedPassword',
        });
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

        await expect(
          userService.findUser('password', 'test@example.com'),
        ).rejects.toThrow(testCase.error);
      }
    });
  });

  describe('fillUserDefaults', () => {
    it('should fill user defaults correctly', () => {
      const newUser = {
        email: 'test@example.com',
        displayName: 'Test User',
        username: 'testuser',
      };
      const result = userService.fillUserDefaults(newUser);

      expect(result).toHaveProperty('_id');
      expect(result.email).toBe('test@example.com');
      expect(result.username).toBe('testuser');
      expect(result.emailVerified).toBe(false);
      expect(result.accountStatusType).toBe(
        AccountStatusTypeEnum.NewUnverified,
      );
    });
  });

  describe('makeUserDoc', () => {
    it('should create a user document', () => {
      const newUser = {
        email: 'test@example.com',
        displayName: 'Test User',
        username: 'testuser',
        timezone: faker.helpers.arrayElement(moment.tz.names()),
        accountStatusType: AccountStatusTypeEnum.Active,
      } as unknown as IUser;
      const password = 'Password123!';

      const fakedHash = randomBytes(16).toString('hex');
      (bcrypt.hashSync as jest.Mock).mockReturnValueOnce(fakedHash);

      const result = userService.makeUserDoc(newUser, password);

      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).toHaveProperty('displayName', 'Test User');
      expect(result).toHaveProperty('username', 'testuser');
      expect(result).toHaveProperty('password', fakedHash);
    });

    it('should throw MongooseValidationError if validation fails', () => {
      const newUser = { email: 'test@example.com', username: 'testuser' };
      const password = 'Password123!';

      (mockUserModel as any).validateSync = jest
        .fn()
        .mockReturnValueOnce({ errors: {} });

      expect(() => userService.makeUserDoc(newUser as any, password)).toThrow(
        MongooseValidationError,
      );
    });
  });

  describe('newUser', () => {
    it('should create a new user and send verification email', async () => {
      const userData = {
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
      };
      const password = 'Password123!';
      const fakedHash = randomBytes(16).toString('hex');
      const mockUserDoc = generateUser(userData);

      jest
        .spyOn(mockUserModel, 'countDocuments')
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      (bcrypt.hashSync as jest.Mock).mockReturnValueOnce(fakedHash);
      jest.spyOn(userService, 'makeUserDoc').mockReturnValueOnce(mockUserDoc);

      const createEmailTokenSpy = jest
        .spyOn(userService, 'createEmailToken')
        .mockResolvedValueOnce({} as IEmailTokenDocument);

      const sendEmailTokenSpy = jest
        .spyOn(userService, 'sendEmailToken')
        .mockImplementation(() => Promise.resolve());

      await userService.newUser(userData, password);

      expect(mockUserModel.countDocuments).toHaveBeenCalledTimes(2);
      expect(mockUserDoc.save).toHaveBeenCalledTimes(1);
      expect(createEmailTokenSpy).toHaveBeenCalledTimes(1);
      expect(sendEmailTokenSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw InvalidUsernameError for invalid username', async () => {
      const userData = {
        username: 'inv@lid',
        displayName: 'Test User',
        email: 'test@example.com',
      };
      const password = 'Password123!';

      await expect(userService.newUser(userData, password)).rejects.toThrow(
        InvalidUsernameError,
      );
    });

    it('should throw InvalidPasswordError for invalid password', async () => {
      const userData = {
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
      };
      const password = 'weak';

      await expect(userService.newUser(userData, password)).rejects.toThrow(
        InvalidPasswordError,
      );
    });

    it('should throw EmailInUseError if email already exists', async () => {
      const userData = {
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
      };
      const password = 'Password123!';

      jest.spyOn(mockUserModel, 'countDocuments').mockResolvedValueOnce(1);

      await expect(userService.newUser(userData, password)).rejects.toThrow(
        EmailInUseError,
      );
    });

    it('should throw UsernameInUseError if username already exists', async () => {
      const userData = {
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
      };
      const password = 'Password123!';

      const countDocumentsSpy = jest.spyOn(mockUserModel, 'countDocuments');
      countDocumentsSpy.mockResolvedValueOnce(0).mockResolvedValueOnce(1);

      await expect(userService.newUser(userData, password)).rejects.toThrow(
        UsernameInUseError,
      );
    });
  });

  describe('resendEmailToken', () => {
    it('should resend email token', async () => {
      const userId = new Types.ObjectId().toString();
      const mockEmailToken = {
        _id: new Types.ObjectId(),
      } as IEmailTokenDocument;

      jest.spyOn(mockEmailTokenModel, 'findOne').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValueOnce(mockEmailToken),
        }),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>);

      const sendEmailTokenSpy = jest
        .spyOn(userService, 'sendEmailToken')
        .mockResolvedValueOnce();

      await userService.resendEmailToken(userId);

      expect(mockEmailTokenModel.findOne).toHaveBeenCalled();
      expect(mailService.send).not.toHaveBeenCalled(); // we mocked sendEmailToken
      expect(sendEmailTokenSpy).toHaveBeenCalledWith(mockEmailToken);
    });

    it('should throw EmailTokenUsedOrInvalidError if no valid token found', async () => {
      const userId = new Types.ObjectId().toString();

      jest.spyOn(mockEmailTokenModel, 'findOne').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValueOnce(null),
        }),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>);

      await expect(userService.resendEmailToken(userId)).rejects.toThrow(
        EmailTokenUsedOrInvalidError,
      );
    });
  });

  describe('verifyEmailToken', () => {
    it('should verify a valid email token', async () => {
      const token = 'validToken';
      const mockEmailToken = {
        _id: new Types.ObjectId(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      } as IEmailTokenDocument;

      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockResolvedValueOnce(mockEmailToken);

      const result = await userService.verifyEmailToken(token);

      expect(result).toBe(true);
      expect(mockEmailTokenModel.findOne).toHaveBeenCalledWith({ token });
    });

    it('should throw EmailTokenUsedOrInvalidError for invalid token', async () => {
      const token = 'invalidToken';

      jest.spyOn(mockEmailTokenModel, 'findOne').mockResolvedValueOnce(null);

      await expect(userService.verifyEmailToken(token)).rejects.toThrow(
        EmailTokenUsedOrInvalidError,
      );
    });

    it('should throw EmailTokenExpiredError for expired token', async () => {
      const token = 'expiredToken';
      const mockEmailToken = {
        _id: new Types.ObjectId(),
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
      } as IEmailTokenDocument;

      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockResolvedValueOnce(mockEmailToken);
      jest
        .spyOn(mockEmailTokenModel, 'deleteOne')
        .mockResolvedValueOnce({ deletedCount: 1, acknowledged: true });

      await expect(userService.verifyEmailToken(token)).rejects.toThrow(
        EmailTokenExpiredError,
      );
      expect(mockEmailTokenModel.deleteOne).toHaveBeenCalledWith({
        _id: mockEmailToken._id,
      });
    });
  });

  describe('verifyEmailTokenAndFinalize', () => {
    it('should verify and finalize email token', async () => {
      const token = 'validToken';
      const mockEmailToken = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      } as IEmailTokenDocument;
      const mockUser = {
        _id: mockEmailToken.userId,
        emailVerified: false,
        save: jest.fn(),
      } as unknown as IUserDocument;

      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockResolvedValueOnce(mockEmailToken);
      jest.spyOn(mockUserModel, 'findById').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(mockEmailTokenModel, 'deleteOne')
        .mockResolvedValueOnce({ deletedCount: 1, acknowledged: true });

      await userService.verifyEmailTokenAndFinalize(token);

      expect(mockUser.emailVerified).toBe(true);
      expect(mockUser.accountStatusType).toBe(AccountStatusTypeEnum.Active);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockEmailTokenModel.deleteOne).toHaveBeenCalledWith({
        _id: mockEmailToken._id,
      });
    });

    it('should throw UserNotFoundError if user not found', async () => {
      const token = 'validToken';
      const mockEmailToken = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      } as IEmailTokenDocument;

      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockResolvedValueOnce(mockEmailToken);
      jest.spyOn(mockUserModel, 'findById').mockResolvedValueOnce(null);

      await expect(
        userService.verifyEmailTokenAndFinalize(token),
      ).rejects.toThrow(UserNotFoundError);
    });

    it('should throw EmailVerifiedError if email is already verified', async () => {
      const token = 'validToken';
      const mockEmailToken = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      } as IEmailTokenDocument;
      const mockUser = {
        _id: mockEmailToken.userId,
        emailVerified: true,
      } as IUserDocument;

      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockResolvedValueOnce(mockEmailToken);
      jest.spyOn(mockUserModel, 'findById').mockResolvedValueOnce(mockUser);

      await expect(
        userService.verifyEmailTokenAndFinalize(token),
      ).rejects.toThrow(EmailVerifiedError);
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const userId = new Types.ObjectId();
      const oldPassword = 'oldPassword';
      const newPassword = 'newPassword1!';
      const mockUser = {
        _id: userId,
        password: 'hashedOldPassword',
        save: jest.fn(),
      } as unknown as IUserDocument;

      jest.spyOn(mockUserModel, 'findById').mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedNewPassword');

      await userService.changePassword(
        userId.toString(),
        oldPassword,
        newPassword,
      );

      expect(mockUser.password).toBe('hashedNewPassword');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw UserNotFoundError if user not found', async () => {
      const userId = new Types.ObjectId();
      jest.spyOn(mockUserModel, 'findById').mockResolvedValueOnce(null);

      await expect(
        userService.changePassword(userId.toString(), 'old', 'new'),
      ).rejects.toThrow(UserNotFoundError);
    });

    it('should throw InvalidCredentialsError if old password is incorrect', async () => {
      const userId = new Types.ObjectId();
      const mockUser = {
        _id: userId,
        password: 'hashedOldPassword',
      } as IUserDocument;

      jest.spyOn(mockUserModel, 'findById').mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        userService.changePassword(userId.toString(), 'wrongOld', 'new'),
      ).rejects.toThrow(InvalidCredentialsError);
    });
  });

  describe('resetPassword', () => {
    it('should reset user password', async () => {
      const token = 'validToken';
      const newPassword = 'newPassword';
      const mockEmailToken = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      } as IEmailTokenDocument;
      const mockUser = {
        _id: mockEmailToken.userId,
        password: 'hashedOldPassword',
        save: jest.fn(),
      } as unknown as IUserDocument;

      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockResolvedValueOnce(mockEmailToken);
      jest.spyOn(mockUserModel, 'findById').mockResolvedValueOnce(mockUser);
      const fakedHash = randomBytes(16).toString('hex');
      (bcrypt.hashSync as jest.Mock).mockReturnValueOnce(fakedHash);
      jest
        .spyOn(mockEmailTokenModel, 'deleteOne')
        .mockResolvedValueOnce({ deletedCount: 1, acknowledged: true });

      await userService.resetPassword(token, newPassword);

      expect(mockUser.password).toBe(fakedHash);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockEmailTokenModel.deleteOne).toHaveBeenCalledWith({
        _id: mockEmailToken._id,
      });
    });

    it('should throw EmailTokenUsedOrInvalidError if token not found', async () => {
      jest.spyOn(mockEmailTokenModel, 'findOne').mockResolvedValueOnce(null);

      await expect(
        userService.resetPassword('invalidToken', 'newPassword'),
      ).rejects.toThrow(EmailTokenUsedOrInvalidError);
    });

    it('should throw UserNotFoundError if user not found', async () => {
      const mockEmailToken = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      } as IEmailTokenDocument;

      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockResolvedValueOnce(mockEmailToken);
      jest.spyOn(mockUserModel, 'findById').mockResolvedValueOnce(null);

      await expect(
        userService.resetPassword('validToken', 'newPassword'),
      ).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('initiatePasswordReset', () => {
    it('should return success message if user does not exist', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValueOnce(null);

      const result = await userService.initiatePasswordReset(
        'nonexistent@example.com',
      );

      expect(result).toEqual({
        success: true,
        message:
          'If an account with that email exists, a password reset link has been sent.',
      });
    });

    it('should return error message if email is not verified', async () => {
      const mockUser = {
        _id: new Types.ObjectId(),
        email: 'test@example.com',
        emailVerified: false,
      };

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValueOnce(mockUser);

      const result =
        await userService.initiatePasswordReset('test@example.com');

      expect(result).toEqual({
        success: false,
        message:
          'Please verify your email address before resetting your password.',
      });
    });

    it('should create and send password reset token if user exists and email is verified', async () => {
      const mockUser = {
        _id: new Types.ObjectId(),
        email: 'test@example.com',
        emailVerified: true,
      };

      const mockEmailToken = {
        _id: new Types.ObjectId(),
        userId: mockUser._id,
        email: mockUser.email,
        token: 'mockToken',
        type: EmailTokenType.PasswordReset,
        lastSent: null,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      } as unknown as IEmailTokenDocument;

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(userService, 'createEmailToken')
        .mockResolvedValueOnce(mockEmailToken);
      jest.spyOn(userService, 'sendEmailToken').mockResolvedValueOnce();

      const result =
        await userService.initiatePasswordReset('test@example.com');

      expect(result).toEqual({
        success: true,
        message: 'Password reset link has been sent to your email.',
      });
      expect(mailService.send).not.toHaveBeenCalled(); // Email should not be sent because we mocked sendEmailToken
      expect(userService.createEmailToken).toHaveBeenCalledWith(
        mockUser,
        EmailTokenType.PasswordReset,
      );
      expect(userService.sendEmailToken).toHaveBeenCalledWith(mockEmailToken);
    });

    it('should handle errors and return appropriate message', async () => {
      jest
        .spyOn(mockUserModel, 'findOne')
        .mockRejectedValueOnce(new Error('Unexpected error'));

      const result =
        await userService.initiatePasswordReset('test@example.com');

      expect(result).toEqual({
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      });
    });
  });
});
