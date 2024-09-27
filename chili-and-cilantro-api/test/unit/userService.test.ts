import {
  BaseModel,
  IUser,
  ModelName,
  constants,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { EmailExistsError } from 'chili-and-cilantro-api/src/errors/emailExists';
import { InvalidEmailError } from 'chili-and-cilantro-api/src/errors/invalidEmail';
import { InvalidPasswordError } from 'chili-and-cilantro-api/src/errors/invalidPassword';
import { InvalidUsernameError } from 'chili-and-cilantro-api/src/errors/invalidUsername';
import { UsernameExistsError } from 'chili-and-cilantro-api/src/errors/usernameExists';
import sinon from 'sinon';
import { managementClient } from '../../src/auth0';
import { UserService } from '../../src/services/user';
import { generateGamePassword } from '../fixtures/game';
import {
  generateUser,
  generateUserPassword,
  generateUsername,
} from '../fixtures/user';

describe('userService', () => {
  let userService, userModel;
  beforeAll(() => {
    userService = new UserService();
    userModel = BaseModel.getModel<IUser>(ModelName.User);
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('validateRegisterOrThrowAsync', () => {
    let email, password, username;
    beforeEach(() => {
      email = faker.internet.email();
      password = generateGamePassword();
      username = generateUsername();
    });
    it('should throw an error if the email is invalid', async () => {
      email = 'invalid email without at symbol';
      await expect(
        userService.validateRegisterOrThrowAsync(email, username, password),
      ).rejects.toThrow(InvalidEmailError);
    });
    it('should throw an error if the email is already in use', async () => {
      sinon.stub(userModel, 'findOne').returns({
        exec: sinon.stub().resolves({ email: email }),
      });
      await expect(
        userService.validateRegisterOrThrowAsync(email, username, password),
      ).rejects.toThrow(EmailExistsError);
    });
    it('should throw an error if the username is too short', async () => {
      sinon.stub(userModel, 'findOne').returns(null);
      username = 'x'.repeat(constants.MIN_USERNAME_LENGTH - 1);
      await expect(
        userService.validateRegisterOrThrowAsync(email, username, password),
      ).rejects.toThrow(InvalidUsernameError);
    });
    it('should throw an error if the username is too long', async () => {
      sinon.stub(userModel, 'findOne').returns(null);
      username = 'x'.repeat(constants.MAX_USERNAME_LENGTH + 1);
      await expect(
        userService.validateRegisterOrThrowAsync(email, username, password),
      ).rejects.toThrow(InvalidUsernameError);
    });
    it('should throw an error if the username is already in use', async () => {
      // sinon needs to return null once and then return a user object
      sinon
        .stub(userModel, 'findOne')
        .onFirstCall()
        .returns(null)
        .onSecondCall()
        .returns({
          exec: sinon.stub().resolves({ username: username }),
        });
      await expect(
        userService.validateRegisterOrThrowAsync(email, username, password),
      ).rejects.toThrow(UsernameExistsError);
    });
    it('should throw an error if the password is missing', async () => {
      sinon.stub(userModel, 'findOne').returns(null);
      password = undefined;
      await expect(
        userService.validateRegisterOrThrowAsync(email, username, password),
      ).rejects.toThrow(InvalidPasswordError);
    });
    it('should throw an error if the password is too short', async () => {
      sinon.stub(userModel, 'findOne').returns(null);
      password = 'x'.repeat(constants.MIN_GAME_PASSWORD_LENGTH - 1);
      await expect(
        userService.validateRegisterOrThrowAsync(email, username, password),
      ).rejects.toThrow(InvalidPasswordError);
    });
    it('should throw an error if the password is too long', async () => {
      sinon.stub(userModel, 'findOne').returns(null);
      password = 'x'.repeat(constants.MAX_GAME_PASSWORD_LENGTH + 1);
      await expect(
        userService.validateRegisterOrThrowAsync(email, username, password),
      ).rejects.toThrow(InvalidPasswordError);
    });
    it('should not throw an error if the email, username, and password are valid', async () => {
      sinon.stub(userModel, 'findOne').returns(null);
      await expect(
        userService.validateRegisterOrThrowAsync(email, username, password),
      ).resolves.not.toThrow();
    });
  });
  describe('registerAuth0UserAsync', () => {
    let email, password, username;
    beforeEach(() => {
      email = faker.internet.email();
      password = generateUserPassword();
      username = generateUsername();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should throw an error if there is no auth0 response', async () => {
      // stub the auth0 management client to return null
      // but it is async, so we need to return a promise
      // and resolve it with null
      sinon.stub(managementClient.users, 'create').resolves(undefined);
      await expect(
        userService.registerAuth0UserAsync(email, username, password),
      ).rejects.toThrow('Error creating user in Auth0: Unknown error');
    });
    it('should throw an error if the auth0 response status is not 201', async () => {
      // Mock the response with the necessary properties
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
      };

      // Stub the Auth0 management client to return the mock response
      sinon
        .stub(managementClient.users, 'create')
        .resolves(mockResponse as any);

      await expect(
        userService.registerAuth0UserAsync(email, username, password),
      ).rejects.toThrow('Error creating user in Auth0: Bad Request');
    });
    it('should return the auth0 user response if the management call is successful', async () => {
      // stub the auth0 mangement client to return a data object and expect that value
      sinon.stub(managementClient.users, 'create').resolves({
        status: 201,
        data: {
          email: email,
          username: username,
          user_id: faker.string.uuid(),
        },
      } as any);
      userService
        .registerAuth0UserAsync(email, username, password)
        .then((result) => {
          expect(result.email).toBe(email);
        });
    });
  });
  describe('createUserAsync', () => {
    let email, auth0User;
    beforeEach(() => {
      email = faker.internet.email();
      auth0User = {
        username: generateUsername(),
        user_id: 'auth0|'.concat(faker.string.uuid()),
      };
    });
    it('should create the user model', async () => {
      sinon.stub(userModel, 'create').resolves({
        email: email,
        username: auth0User.username,
        auth0Id: auth0User.user_id,
        shadowBan: false,
        userHidden: true,
      });
      expect.assertions(5);
      userService.createUserAsync(email, auth0User).then((result) => {
        expect(result.email).toBe(email);
        expect(result.username).toBe(auth0User.username);
        expect(result.auth0Id).toBe(auth0User.user_id);
        expect(result.shadowBan).toBe(false);
        expect(result.userHidden).toBe(true);
      });
    });
  });
  describe('performRegister', () => {
    let auth0User, email, username, password;
    beforeEach(() => {
      email = faker.internet.email();
      username = generateUsername();
      password = generateUserPassword();
      auth0User = {
        username: username,
        user_id: 'auth0|'.concat(faker.string.uuid()),
      };
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    it('should call validateRegisterOrThrowAsync, registerAuth0UserAsync, and createUserAsync', async () => {
      jest
        .spyOn(userService, 'validateRegisterOrThrowAsync')
        .mockResolvedValue(undefined);
      sinon.stub(userService, 'registerAuth0UserAsync').resolves(auth0User);
      sinon.stub(userService, 'createUserAsync').resolves({
        _id: faker.string.uuid(),
        email: email,
        username: username,
        auth0Id: auth0User.user_id,
        shadowBan: false,
        userHidden: true,
      });
      expect.assertions(6);
      userService.performRegister(email, username, password).then((result) => {
        expect(userService.validateRegisterOrThrowAsync).toHaveBeenCalled();
        expect(result.email).toBe(email);
        expect(result.username).toBe(username);
        expect(result.auth0Id).toBe(auth0User.user_id);
        expect(result.shadowBan).toBe(false);
        expect(result.userHidden).toBe(true);
      });
    });
    it('should throw an error if registerAuth0UserAsync throws an error', async () => {
      const error = new Error('Error creating user in Auth0');
      sinon.stub(userService, 'validateRegisterOrThrowAsync').resolves();
      sinon.stub(userService, 'registerAuth0UserAsync').rejects(error);
      await expect(
        userService.performRegister(email, username, password),
      ).rejects.toThrow('Error creating user in Auth0');
    });
  });
  describe('getUserByAuth0IdOrThrow', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    it('should throw an error if the user is not found', async () => {
      const auth0Id = `auth0Id|${faker.string.uuid()}`;
      sinon.stub(userModel, 'findOne').returns(null);
      await expect(
        userService.getUserByAuth0IdOrThrow(auth0Id),
      ).rejects.toThrow(`Invalid user by auth0Id: ${auth0Id}`);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching user by Auth0 ID:',
        expect.anything(),
      );
    });
    it('should return the user if the user is found', async () => {
      const auth0Id = `auth0Id|${faker.string.uuid()}`;
      const user = generateUser({ auth0Id });
      sinon.stub(userModel, 'findOne').returns(user);
      expect.assertions(1);
      userService.getUserByAuth0IdOrThrow(auth0Id).then((result) => {
        expect(result).toBe(user);
      });
    });
  });
});
