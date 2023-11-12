import { faker } from "@faker-js/faker";
import sinon from "sinon";
import { UserService } from '../../src/services/user';
import { constants, BaseModel, ModelName, IUser } from '@chili-and-cilantro/chili-and-cilantro-lib';

describe("userService", () => {
  describe("validateRegisterOrThrowAsync", () => {
    let email, password, userName, userService, userModel;
    beforeEach(() => {
      email = faker.internet.email();
      password = faker.internet.password();
      userName = faker.internet.userName();
      userService = new UserService();
      userModel = BaseModel.getModel<IUser>(ModelName.User);
    });
    afterEach(() => {
      sinon.restore();
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
  });
  describe("createUserAsync", () => {
  });
  describe("performRegister", () => {
  });
  describe("getUserByAuth0IdOrThrow", () => {
  });
});