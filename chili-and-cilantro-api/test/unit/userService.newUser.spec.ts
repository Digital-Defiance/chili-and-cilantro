import {
  EmailInUseError,
  IEmailTokenDocument,
  IUserDocument,
  InvalidPasswordError,
  InvalidUsernameError,
  ModelName,
  UsernameInUseError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { MailService } from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { UserService } from '../../src/services/user';
import { MockApplication } from '../fixtures/application';
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
});
