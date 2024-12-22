import {
  EmailTokenExpiredError,
  EmailTokenUsedOrInvalidError,
  IEmailTokenDocument,
  IUserDocument,
  ModelName,
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

  describe('verifyEmailToken', () => {
    it('should verify a valid email token', async () => {
      const token = 'validToken';
      const mockEmailToken = {
        _id: new Types.ObjectId(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      } as IEmailTokenDocument;

      const emailQuery = {
        session: jest.fn().mockResolvedValueOnce(mockEmailToken),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockReturnValueOnce(emailQuery);

      const result = await userService.verifyEmailToken(token);

      expect(result).toBe(true);
      expect(mockEmailTokenModel.findOne).toHaveBeenCalledWith({ token });
      expect(emailQuery.session).toHaveBeenCalled();
    });

    it('should throw EmailTokenUsedOrInvalidError for invalid token', async () => {
      const token = 'invalidToken';
      const mockQuery = {
        session: jest.fn().mockResolvedValueOnce(null),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;

      jest.spyOn(mockEmailTokenModel, 'findOne').mockReturnValueOnce(mockQuery);

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

      const mockEmailQuery = {
        session: jest.fn().mockResolvedValueOnce(mockEmailToken),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest
        .spyOn(mockEmailTokenModel, 'findOne')
        .mockReturnValueOnce(mockEmailQuery);
      jest
        .spyOn(mockEmailTokenModel, 'deleteOne')
        .mockResolvedValueOnce({ deletedCount: 1, acknowledged: true });

      await expect(userService.verifyEmailToken(token)).rejects.toThrow(
        EmailTokenExpiredError,
      );
      expect(mockEmailTokenModel.deleteOne).toHaveBeenCalledWith(
        {
          _id: mockEmailToken._id,
        },
        { session: undefined },
      );
    });
  });
});
