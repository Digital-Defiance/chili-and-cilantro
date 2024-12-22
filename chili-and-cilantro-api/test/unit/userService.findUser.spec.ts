import {
  AccountDeletedError,
  AccountLockedError,
  AccountStatusTypeEnum,
  HandleableError,
  IEmailTokenDocument,
  IUserDocument,
  InvalidCredentialsError,
  ModelName,
  PendingEmailVerificationError,
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

  describe('findUser', () => {
    it('should find a user by email and password', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const mockUser = {
        _id: new Types.ObjectId(),
        email,
        password: 'hashedPassword',
        accountStatusType: AccountStatusTypeEnum.Active,
      };

      const mockQuery = {
        session: jest.fn().mockReturnValueOnce(mockUser),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest.spyOn(mockUserModel, 'findOne').mockReturnValue(mockQuery);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await userService.findUser(password, email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: email.toLowerCase(),
      });
      expect(result).toEqual(mockUser);
      expect(mockQuery.session).toHaveBeenCalled();
    });

    it('should throw InvalidCredentialsError if user not found', async () => {
      const mockQuery = {
        session: jest.fn().mockReturnValueOnce(null),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest.spyOn(mockUserModel, 'findOne').mockReturnValue(mockQuery);

      await expect(
        userService.findUser('password', 'nonexistent@example.com'),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it("should throw InvalidCredentialsError if password doesn't match", async () => {
      const mockQuery = {
        session: jest.fn().mockReturnValueOnce({ password: 'hashedPassword ' }),
      } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
      jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce(mockQuery);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        userService.findUser('wrongpassword', 'test@example.com'),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it('should throw appropriate error based on account status', async () => {
      const testCases = [
        { status: AccountStatusTypeEnum.Locked, error: AccountLockedError },
        {
          status: AccountStatusTypeEnum.NewUnverified,
          error: PendingEmailVerificationError,
        },
        {
          status: AccountStatusTypeEnum.AdminDelete,
          error: AccountDeletedError,
        },
        {
          status: AccountStatusTypeEnum.SelfDelete,
          error: AccountDeletedError,
        },
        {
          status: AccountStatusTypeEnum.SelfDeleteWaitPeriod,
          error: AccountDeletedError,
        },
        {
          status: 'InvalidStatus' as AccountStatusTypeEnum,
          error: HandleableError,
        },
      ];

      for (const testCase of testCases) {
        const mockQuery = {
          session: jest.fn().mockResolvedValueOnce({
            accountStatusType: testCase.status,
            password: 'hashedPassword',
          }),
        } as unknown as Query<IEmailTokenDocument[], IEmailTokenDocument>;
        jest.spyOn(mockUserModel, 'findOne').mockReturnValueOnce(mockQuery);
        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

        await expect(
          userService.findUser('password', 'test@example.com'),
        ).rejects.toThrow(testCase.error);
      }
    });
  });
});
