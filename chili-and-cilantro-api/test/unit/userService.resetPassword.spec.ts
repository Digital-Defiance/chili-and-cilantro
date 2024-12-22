import {
  EmailTokenUsedOrInvalidError,
  IEmailTokenDocument,
  IUserDocument,
  ModelName,
  UserNotFoundError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { MailService } from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { DeleteResult, Model, Query, Types } from 'mongoose';
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

      const mockEmailQuery = {
        session: jest.fn().mockReturnValueOnce(mockEmailToken),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockReturnValueOnce(mockEmailQuery);
      const mockUserQuery = {
        session: jest.fn().mockReturnValueOnce(mockUser),
      } as unknown as Query<IUserDocument[], IUserDocument>;
      jest.spyOn(mockUserModel, 'findById').mockReturnValueOnce(mockUserQuery);
      const fakedHash = randomBytes(16).toString('hex');
      (bcrypt.hashSync as jest.Mock).mockReturnValueOnce(fakedHash);
      jest.spyOn(mockEmailTokenModel, 'deleteOne').mockResolvedValueOnce({
        deletedCount: 1,
        acknowledged: true,
      } as DeleteResult);

      await userService.resetPassword(token, newPassword);

      expect(mockUser.password).toBe(fakedHash);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockEmailTokenModel.deleteOne).toHaveBeenCalledWith(
        {
          _id: mockEmailToken._id,
        },
        { session: undefined },
      );
    });

    it('should throw EmailTokenUsedOrInvalidError if token not found', async () => {
      const mockEmailQuery = {
        session: jest.fn().mockResolvedValueOnce(null),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockReturnValueOnce(mockEmailQuery);

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

      const mockEmailQuery = {
        session: jest.fn().mockReturnValueOnce(mockEmailToken),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockReturnValueOnce(mockEmailQuery);
      const mockUserQuery = {
        session: jest.fn().mockReturnValueOnce(null),
      } as unknown as Query<IUserDocument[], IUserDocument>;
      jest.spyOn(mockUserModel, 'findById').mockReturnValueOnce(mockUserQuery);

      await expect(
        userService.resetPassword('validToken', 'newPassword'),
      ).rejects.toThrow(UserNotFoundError);
    });
  });
});
