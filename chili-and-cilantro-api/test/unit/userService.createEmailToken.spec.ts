import {
  EmailTokenType,
  IEmailTokenDocument,
  IUserDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { MailService } from '@sendgrid/mail';
import { Document, Model } from 'mongoose';
import { UserService } from '../../src/services/user';
import { MockApplication } from '../fixtures/application';
import { generateEmailToken } from '../fixtures/email-token';
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

  describe('createEmailToken', () => {
    it('should create a new email token', async () => {
      const userDoc = generateUser();
      const mockEmailToken = generateEmailToken({
        userId: userDoc._id,
      }) as unknown as Document<unknown, any, IEmailTokenDocument> &
        IEmailTokenDocument & { __v: any };
      const createSpy = jest
        .spyOn(mockEmailTokenModel, 'create')
        .mockResolvedValueOnce([mockEmailToken]);
      const deleteManySpy = jest
        .spyOn(mockEmailTokenModel, 'deleteMany')
        .mockResolvedValueOnce({
          deletedCount: 1,
          acknowledged: true,
        });

      const result = await userService.createEmailToken(
        userDoc,
        EmailTokenType.AccountVerification,
      );

      expect(deleteManySpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalled();
      expect(result).toEqual(mockEmailToken);
    });
  });
});
