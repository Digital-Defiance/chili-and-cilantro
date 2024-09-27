// utils/userUtils.ts
import {
  constants,
  IUserDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { UserModel } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { hash } from 'bcrypt';
import validator from 'validator';
import { EmailExistsError } from '../errors/email-exists';
import { InvalidEmailError } from '../errors/invalid-email';
import { InvalidPasswordError } from '../errors/invalid-password';
import { InvalidUsernameError } from '../errors/invalid-username';
import { UsernameExistsError } from '../errors/username-exists';

export class UserService {
  /**
   * Validates the email, username, and password for a new user, or throws an error if invalid.
   * @throws InvalidEmailError
   * @throws InvalidPasswordError
   * @throws EmailExistsError
   * @throws UsernameExistsError
   * @param email
   * @param username
   * @param password
   */
  public async validateRegisterOrThrowAsync(
    email: string,
    username: string,
    password: string,
  ): Promise<void> {
    // Email validation using validator.js
    if (!validator.isEmail(email)) {
      throw new InvalidEmailError(email);
    }

    if (await UserModel.findOne({ email: email })) {
      throw new EmailExistsError(email);
    }

    if (await UserModel.findOne({ username: username })) {
      throw new UsernameExistsError(username);
    }

    if (
      username.length < constants.MIN_USERNAME_LENGTH ||
      username.length > constants.MAX_USERNAME_LENGTH
    ) {
      throw new InvalidUsernameError(username);
    }

    // Password validation: Here, we'll use validator.js for the email,
    // and keep the previous logic for password. Adjust this logic if needed.
    if (
      !password ||
      password.length < constants.MIN_PASSWORD_LENGTH ||
      password.length > constants.MAX_PASSWORD_LENGTH ||
      !/\d/.test(password) ||
      !/[A-Za-z]/.test(password)
    ) {
      throw new InvalidPasswordError(
        `Password must be between ${constants.MIN_PASSWORD_LENGTH} and ${constants.MAX_PASSWORD_LENGTH} characters long and contain both letters and numbers.`,
      );
    }
  }

  /**
   * Creates a user in the mongo database
   * @param email The user's email address
   * @param auth0User The user's Auth0 user object
   * @returns The created user
   */
  public async createUserAsync(
    email: string,
    username: string,
    password: string,
  ): Promise<IUserDocument> {
    const hashedPassword = await hash(password, constants.BCRYPT_ROUNDS);
    return UserModel.create({
      email: email,
      username: username,
      password: hashedPassword,
      shadowBan: false,
      userHidden: true,
    });
  }

  /**
   * Registers a user in auth0 and creates the user in the mongo database
   * @param email The user's email address
   * @param username The user's username
   * @param password The user's password
   * @returns The created user
   */
  public async performRegister(
    email: string,
    username: string,
    password: string,
  ): Promise<IUserDocument> {
    await this.validateRegisterOrThrowAsync(email, username, password);

    try {
      return this.createUserAsync(email, username, password);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}
