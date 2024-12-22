import {
  AccountStatusTypeEnum,
  IEmailTokenDocument,
  IUserDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { MailService } from '@sendgrid/mail';
import { Model } from 'mongoose';
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
});
