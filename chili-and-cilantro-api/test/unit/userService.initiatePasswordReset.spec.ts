import {
  EmailTokenType,
  IEmailTokenDocument,
  IUserDocument,
  ModelName,
  StringNames,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { MailService } from '@sendgrid/mail';
import { ClientSession, Model, Query, Types } from 'mongoose';
import { UserService } from '../../src/services/user';
import { MockApplication } from '../fixtures/application';

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

  describe('initiatePasswordReset', () => {
    it('should return success message if user does not exist', async () => {
      const mockQuery = {
        session: jest.fn().mockReturnValueOnce(null),
      } as unknown as Query<IUserDocument[], IUserDocument>;
      jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce(mockQuery);

      const result = await userService.initiatePasswordReset(
        'nonexistent@example.com',
        {} as ClientSession,
      );

      expect(result).toEqual({
        success: true,
        message:
          'If an account with that email exists, a password reset link has been sent.',
      });
      expect(mockQuery.session).toHaveBeenCalledWith({});
      expect(mailService.send).not.toHaveBeenCalled();
    });

    it('should return error message if email is not verified', async () => {
      const mockUser = {
        _id: new Types.ObjectId(),
        email: 'test@example.com',
        emailVerified: false,
      };

      const mockQuery = {
        session: jest.fn().mockReturnValueOnce(mockUser),
      } as unknown as Query<IUserDocument[], IUserDocument>;

      jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce(mockQuery);

      const result = await userService.initiatePasswordReset(
        'test@example.com',
        {} as ClientSession,
      );

      expect(result).toEqual({
        success: false,
        message:
          'Please verify your email address before resetting your password.',
      });
      expect(mockQuery.session).toHaveBeenCalledWith({});
      expect(mailService.send).not.toHaveBeenCalled();
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

      const mockQuery = {
        session: jest.fn().mockReturnValueOnce(mockUser),
      } as unknown as Query<IUserDocument[], IUserDocument>;
      jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce(mockQuery);
      jest
        .spyOn(userService, 'createEmailToken')
        .mockResolvedValueOnce(mockEmailToken);
      jest.spyOn(userService, 'sendEmailToken').mockResolvedValueOnce();

      const result = await userService.initiatePasswordReset(
        'test@example.com',
        {} as ClientSession,
      );

      expect(result).toEqual({
        success: true,
        message: translate(StringNames.ResetPassword_Sent),
      });
      expect(mailService.send).not.toHaveBeenCalled(); // Email should not be sent because we mocked sendEmailToken
      expect(userService.createEmailToken).toHaveBeenCalledWith(
        mockUser,
        EmailTokenType.PasswordReset,
        {},
      );
      expect(userService.sendEmailToken).toHaveBeenCalledWith(mockEmailToken);
    });

    it('should handle errors and return appropriate message', async () => {
      const message = 'Unexpected error occurred';
      mockUserModel.findOne = jest.fn().mockImplementationOnce(() => {
        throw new Error(message);
      });

      const result = await userService.initiatePasswordReset(
        'test@example.com',
        {} as ClientSession,
      );

      expect(result).toEqual({
        success: false,
        message: message,
      });
      expect(mailService.send).not.toHaveBeenCalled();
    });
  });
});
