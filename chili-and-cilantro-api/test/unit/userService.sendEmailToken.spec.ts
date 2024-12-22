import {
  EmailTokenSentTooRecentlyError,
  EmailTokenType,
  IEmailTokenDocument,
  IUserDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { MailService } from '@sendgrid/mail';
import { Model, Types } from 'mongoose';
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
});
