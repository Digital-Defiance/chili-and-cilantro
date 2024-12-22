import {
  AccountStatusTypeEnum,
  EmailVerifiedError,
  IEmailTokenDocument,
  IUserDocument,
  ModelName,
  UserNotFoundError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { MailService } from '@sendgrid/mail';
import { Model, Query, Types } from 'mongoose';
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

      const mockEmailTokenQuery = {
        session: jest.fn().mockResolvedValueOnce(mockEmailToken),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockReturnValueOnce(mockEmailTokenQuery);
      const mockUserQuery = {
        session: jest.fn().mockResolvedValueOnce(mockUser),
      } as unknown as Query<IUserDocument[], IUserDocument>;
      jest.spyOn(mockUserModel, 'findById').mockReturnValueOnce(mockUserQuery);
      jest
        .spyOn(mockEmailTokenModel, 'deleteOne')
        .mockResolvedValueOnce({ deletedCount: 1, acknowledged: true });

      await userService.verifyEmailTokenAndFinalize(token);

      expect(mockUser.emailVerified).toBe(true);
      expect(mockUser.accountStatusType).toBe(AccountStatusTypeEnum.Active);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockEmailTokenModel.deleteOne).toHaveBeenCalledWith(
        {
          _id: mockEmailToken._id,
        },
        { session: undefined },
      );
    });

    it('should throw UserNotFoundError if user not found', async () => {
      const token = 'validToken';
      const mockEmailToken = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      } as IEmailTokenDocument;

      const mockEmailQuery = {
        session: jest.fn().mockResolvedValueOnce(mockEmailToken),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockReturnValueOnce(mockEmailQuery);
      const mockUserQuery = {
        session: jest.fn().mockResolvedValueOnce(null),
      } as unknown as Query<IUserDocument[], IUserDocument>;
      jest.spyOn(mockUserModel, 'findById').mockReturnValueOnce(mockUserQuery);

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

      const mockEmailTokenQuery = {
        session: jest.fn().mockResolvedValueOnce(mockEmailToken),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;

      const mockUserQuery = {
        session: jest.fn().mockResolvedValueOnce(mockUser),
      } as unknown as Query<IUserDocument[], IUserDocument>;

      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockReturnValueOnce(mockEmailTokenQuery);
      jest.spyOn(mockUserModel, 'findById').mockReturnValueOnce(mockUserQuery);

      await expect(
        userService.verifyEmailTokenAndFinalize(token),
      ).rejects.toThrow(EmailVerifiedError);
    });
  });
});
