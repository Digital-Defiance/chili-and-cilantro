import {
  AccountStatusTypeEnum,
  IEmailTokenDocument,
  IUser,
  IUserDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  IApplication,
  MongooseValidationError,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { faker } from '@faker-js/faker';
import { MailService } from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';
import moment from 'moment-timezone';
import { Model } from 'mongoose';
import { UserService } from '../../src/services/user';
import { MockApplication } from '../fixtures/application';
import { generateBcryptHash } from '../fixtures/password';

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

      const fakedHash = generateBcryptHash();
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
});
