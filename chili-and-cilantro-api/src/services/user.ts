// utils/userUtils.ts
import { Document } from 'mongoose';
import { GetUsers200ResponseOneOfInner } from 'auth0';
import validator from 'validator';
import {
  constants,
  BaseModel,
  IUser,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { InvalidEmailError } from '../errors/invalidEmail';
import { InvalidPasswordError } from '../errors/invalidPassword';
import { InvalidUserError } from '../errors/invalidUser';
import { EmailExistsError } from '../errors/emailExists';
import { UsernameExistsError } from '../errors/usernameExists';
import { managementClient } from '../auth0';
import { environment } from '../environment';

export class UserService {
  private readonly UserModel = BaseModel.getModel<IUser>(ModelName.User);

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

    if (await this.UserModel.findOne({ email: email })) {
      throw new EmailExistsError(email);
    }

    if (await this.UserModel.findOne({ username: username })) {
      throw new UsernameExistsError(username);
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
   * Registers a user using the auth0 management client
   * @param email The user's email address
   * @param username The user's username
   * @param password The user's password
   * @returns 
   */
  public async registerAuth0UserAsync(
    email: string,
    username: string,
    password: string,
  ): Promise<GetUsers200ResponseOneOfInner> {
    // Register user in Auth0
    const auth0UserResponse = await managementClient.users.create({
      connection: environment.auth0.database,
      email: email,
      username: username,
      password: password,
      user_metadata: {
      },
    });
    if (!auth0UserResponse || auth0UserResponse.status !== 201) {
      throw new Error(`Error creating user in Auth0: ${auth0UserResponse?.statusText || 'Unknown error'}`);
    }
    return auth0UserResponse.data;
  }

  /**
   * Creates a user in the mongo database
   * @param email The user's email address
   * @param auth0User The user's Auth0 user object
   * @returns The created user
   */
  public async createUserAsync(
    email: string,
    auth0User: GetUsers200ResponseOneOfInner,
  ): Promise<IUser & Document> {
    return this.UserModel.create({
      email: email,
      username: auth0User.username,
      auth0Id: auth0User.user_id,
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
  ): Promise<Document<unknown, object, IUser>> {
    await this.validateRegisterOrThrowAsync(email, username, password);

    try {
      const auth0User = await this.registerAuth0UserAsync(email, username, password);
      return this.createUserAsync(email, auth0User);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Fetches a user from mongo by their Auth0 ID
   * @param auth0Id The user's Auth0 ID
   * @returns The user
   */
  public async getUserByAuth0IdOrThrow(
    auth0Id: string,
  ): Promise<Document & IUser> {
    try {
      const user = await this.UserModel.findOne({ auth0Id: auth0Id });
      if (!user) {
        throw new InvalidUserError('auth0Id', auth0Id);
      }
      return user;
    } catch (error) {
      console.error('Error fetching user by Auth0 ID:', error);
      throw error;
    }
  }
}
