import {
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

  describe('resendEmailToken', () => {
    it('should resend email token', async () => {
      const userId = new Types.ObjectId().toString();
      const mockEmailToken = {
        _id: new Types.ObjectId(),
      } as IEmailTokenDocument;

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        session: jest.fn().mockResolvedValueOnce(mockEmailToken),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;

      jest.spyOn(mockEmailTokenModel, 'findOne').mockReturnValue(mockQuery);

      const sendEmailTokenSpy = jest
        .spyOn(userService, 'sendEmailToken')
        .mockResolvedValueOnce();

      await userService.resendEmailToken(userId);

      expect(mockEmailTokenModel.findOne).toHaveBeenCalled();
      expect(mailService.send).not.toHaveBeenCalled(); // we mocked sendEmailToken
      expect(sendEmailTokenSpy).toHaveBeenCalledWith(mockEmailToken);
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockQuery.limit).toHaveBeenCalledWith(1);
      expect(mockQuery.session).toHaveBeenCalled();
    });

    it('should throw EmailTokenUsedOrInvalidError if no valid token found', async () => {
      const userId = new Types.ObjectId().toString();

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        session: jest.fn().mockResolvedValueOnce(null),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;

      jest.spyOn(mockEmailTokenModel, 'findOne').mockReturnValue(mockQuery);

      await expect(userService.resendEmailToken(userId)).rejects.toThrow(
        EmailTokenUsedOrInvalidError,
      );
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockQuery.limit).toHaveBeenCalledWith(1);
      expect(mockQuery.session).toHaveBeenCalled();
    });
  });
});
