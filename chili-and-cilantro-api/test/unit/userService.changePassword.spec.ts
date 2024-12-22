import {
  IEmailTokenDocument,
  IUserDocument,
  InvalidCredentialsError,
  ModelName,
  UserNotFoundError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { MailService } from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';
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

      const mockQuery = {
        session: jest.fn().mockReturnValueOnce(mockUser),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest.spyOn(mockUserModel, 'findById').mockReturnValue(mockQuery);
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
      const mockQuery = {
        session: jest.fn().mockReturnValueOnce(null),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest.spyOn(mockUserModel, 'findById').mockReturnValue(mockQuery);

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

      const mockQuery = {
        session: jest.fn().mockReturnValueOnce(mockUser),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest.spyOn(mockUserModel, 'findById').mockReturnValue(mockQuery);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        userService.changePassword(userId.toString(), 'wrongOld', 'new'),
      ).rejects.toThrow(InvalidCredentialsError);
    });
  });
});
