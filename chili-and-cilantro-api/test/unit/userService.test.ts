import { faker } from "@faker-js/faker";
import sinon from "sinon";
import { UserService } from '../../src/services/user';
import { constants, BaseModel, ModelName, IUser } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { managementClient } from "../../src/auth0";
import { generateUser } from '../fixtures/user';

describe("userService", () => {
  let userService, userModel;
  beforeAll(() => {
    userService = new UserService();
    userModel = BaseModel.getModel<IUser>(ModelName.User);
  });
  afterEach(() => {
    sinon.restore();
  });
  describe("validateRegisterOrThrowAsync", () => {
    let email, password, userName;
    beforeEach(() => {
      email = faker.internet.email();
      password = faker.internet.password();
      userName = faker.internet.userName();
    });
    it("should throw an error if the email is invalid", async () => {
      email = "invalid email without at symbol";
      expect.assertions(1);
      try {
        await userService.validateRegisterOrThrowAsync(email, userName, password);
        throw new Error("Expected validateRegisterOrThrowAsync to throw an error");
      } catch (error) {
        expect(error.message).toBe(`Invalid email address: ${email}`);
      }
    });
    it("should throw an error if the email is already in use", async () => {
      expect.assertions(1);
      sinon.stub(userModel, "findOne").returns({
        exec: sinon.stub().resolves({ email: email })
      });
      try {
        await userService.validateRegisterOrThrowAsync(email, userName, password);
        throw new Error("Expected validateRegisterOrThrowAsync to throw an error");
      } catch (error) {
        expect(error.message).toBe(`Email address already exists: ${email}`);
      }
    });
    it("should throw an error if the username is already in use", async () => {
      expect.assertions(1);
      // sinon needs to return null once and then return a user object
      sinon.stub(userModel, "findOne").onFirstCall().returns(null).onSecondCall().returns({
        exec: sinon.stub().resolves({ username: userName })
      });
      try {
        await userService.validateRegisterOrThrowAsync(email, userName, password);
        throw new Error("Expected validateRegisterOrThrowAsync to throw an error");
      } catch (error) {
        expect(error.message).toBe(`Username already exists: ${userName}`);
      }
    });
    it("should throw an error if the password is missing", async () => {
      expect.assertions(1);
      sinon.stub(userModel, "findOne").returns(null);
      password = undefined;
      try {
        await userService.validateRegisterOrThrowAsync(email, userName, password);
        throw new Error("Expected validateRegisterOrThrowAsync to throw an error");
      } catch (error) {
        expect(error.message).toBe(`Password must be between ${constants.MIN_PASSWORD_LENGTH} and ${constants.MAX_PASSWORD_LENGTH} characters long and contain both letters and numbers.`);
      }
    });
    it("should throw an error if the password is too short", async () => {
      expect.assertions(1);
      sinon.stub(userModel, "findOne").returns(null);
      password = "x".repeat(constants.MIN_GAME_PASSWORD_LENGTH - 1);
      try {
        await userService.validateRegisterOrThrowAsync(email, userName, password);
        throw new Error("Expected validateRegisterOrThrowAsync to throw an error");
      } catch (error) {
        expect(error.message).toBe(`Password must be between ${constants.MIN_PASSWORD_LENGTH} and ${constants.MAX_PASSWORD_LENGTH} characters long and contain both letters and numbers.`);
      }
    });
    it("should throw an error if the password is too long", async () => {
      expect.assertions(1);
      sinon.stub(userModel, "findOne").returns(null);
      password = "x".repeat(constants.MAX_GAME_PASSWORD_LENGTH + 1);
      try {
        await userService.validateRegisterOrThrowAsync(email, userName, password);
        throw new Error("Expected validateRegisterOrThrowAsync to throw an error");
      } catch (error) {
        expect(error.message).toBe(`Password must be between ${constants.MIN_PASSWORD_LENGTH} and ${constants.MAX_PASSWORD_LENGTH} characters long and contain both letters and numbers.`);
      }
    });
    it("should not throw an error if the email, username, and password are valid", async () => {
      expect.assertions(0);
      sinon.stub(userModel, "findOne").returns(null);
      try {
        await userService.validateRegisterOrThrowAsync(email, userName, password);
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });
  });
  describe("registerAuth0UserAsync", () => {
    let email, password, userName;
    beforeEach(() => {
      email = faker.internet.email();
      password = faker.internet.password();
      userName = faker.internet.userName();
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should throw an error if there is no auth0 response", async () => {
      // stub the auth0 management client to return null
      // but it is async, so we need to return a promise
      // and resolve it with null
      sinon.stub(managementClient.users, "create").resolves(undefined);
      expect.assertions(1);
      try {
        await userService.registerAuth0UserAsync(email, userName, password);
        throw new Error("Expected registerAuth0UserAsync to throw an error");
      } catch (error) {
        expect(error.message).toBe("Error creating user in Auth0: Unknown error");
      }
    });
    it("should throw an error if the auth0 response status is not 201", async () => {
      // Mock the response with the necessary properties
      const mockResponse = {
        status: 400,
        statusText: "Bad Request",
      };

      // Stub the Auth0 management client to return the mock response
      sinon.stub(managementClient.users, "create").resolves(mockResponse as any);

      expect.assertions(1);
      try {
        await userService.registerAuth0UserAsync(email, userName, password);
        throw new Error("Expected registerAuth0UserAsync to throw an error");
      } catch (error) {
        expect(error.message).toBe("Error creating user in Auth0: Bad Request");
      }
    });
    it("should return the auth0 user response if the management call is successful", async () => {
      // stub the auth0 mangement client to return a data object and expect that value
      sinon.stub(managementClient.users, "create").resolves({
        status: 201,
        data: {
          email: email,
          username: userName,
          user_id: faker.string.uuid()
        }
      } as any);
      expect.assertions(1);
      userService.registerAuth0UserAsync(email, userName, password).then((result) => {
        expect(result.email).toBe(email);
      });
    });
  });
  describe("createUserAsync", () => {
    let email, auth0User;
    beforeEach(() => {
      email = faker.internet.email();
      auth0User = {
        username: faker.internet.userName(),
        user_id: "auth0|".concat(faker.string.uuid())
      }
    });
    it("should create the user model", async () => {
      sinon.stub(userModel, "create").resolves({
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
  describe("performRegister", () => {
    let auth0User, email, username, password;
    beforeEach(() => {
      email = faker.internet.email();
      username = faker.internet.userName();
      password = faker.internet.password();
      auth0User = {
        username: username,
        user_id: "auth0|".concat(faker.string.uuid())
      }
      jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    it("should call validateRegisterOrThrowAsync, registerAuth0UserAsync, and createUserAsync", async () => {
      jest.spyOn(userService, "validateRegisterOrThrowAsync").mockResolvedValue(undefined);
      sinon.stub(userService, "registerAuth0UserAsync").resolves(auth0User);
      sinon.stub(userService, "createUserAsync").resolves({
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
    it("should throw an error if registerAuth0UserAsync throws an error", async () => {
      const error = new Error("Error creating user in Auth0");
      sinon.stub(userService, "validateRegisterOrThrowAsync").resolves();
      sinon.stub(userService, "registerAuth0UserAsync").rejects(error);
      expect.assertions(2);
      try {
        await userService.performRegister(email, username, password);
        throw new Error("Expected performRegister to throw an error");
      } catch (error) {
        expect(error.message).toBe("Error creating user in Auth0");
      }
      expect(console.error).toHaveBeenCalledWith("Error registering user:", error);
    });
  });
  describe("getUserByAuth0IdOrThrow", () => {
    it("should throw an error if the user is not found", async () => {
      sinon.stub(userModel, "findOne").returns({
        exec: sinon.stub().resolves(undefined)
      });
      expect.assertions(1);
      try {
        await userService.getUserByAuth0IdOrThrow(faker.string.uuid());
        throw new Error("Expected getUserByAuth0IdOrThrow to throw an error");
      } catch (error) {
        expect(error.message).toBe("Expected getUserByAuth0IdOrThrow to throw an error");
      }
    });
    it("should return the user if the user is found", async () => {
      const auth0Id = `auth0Id|${faker.string.uuid()}`;
      const user = generateUser(auth0Id);
      sinon.stub(userModel, "findOne").returns(user);
      expect.assertions(1);
      userService.getUserByAuth0IdOrThrow(auth0Id).then((result) => {
        expect(result).toBe(user);
      });
    });
  });
});