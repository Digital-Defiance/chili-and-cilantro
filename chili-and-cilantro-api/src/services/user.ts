// utils/userUtils.ts
import { Document } from 'mongoose';
import validator from 'validator';
import {
  constants,
  BaseModel,
  IUser,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { InvalidEmailError } from '../errors/invalidEmail';
import { InvalidPasswordError } from '../errors/invalidPassword';
import { EmailExistsError } from '../errors/emailExists';
import { UsernameExistsError } from '../errors/usernameExists';
import { managementClient } from '../auth0';
import { environment } from '../environment';

export class UserService {
  private readonly UserModel = BaseModel.getModel<IUser>(ModelName.User);

  public async register(
    email: string,
    username: string,
    password: string,
  ): Promise<Document<unknown, object, IUser>> {
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

    try {
      // Register user in Auth0
      const auth0UserResponse = await managementClient.users.create({
        connection: environment.auth0.database,
        email: email,
        username: username,
        password: password,
        user_metadata: {
          /* any user metadata */
        },
      });
      if (!auth0UserResponse || (auth0UserResponse.status !== 201)) {
        throw new Error('Error creating user in Auth0:' + auth0UserResponse.statusText);
      }
      const auth0User = auth0UserResponse.data;

      // Register user in local MongoDB
      const newUser = await this.UserModel.create({
        email: email,
        username: auth0User.username,
        auth0Id: auth0User.user_id,
        shadowBan: false,
        userHidden: true,
      });

      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  public async getUserByAuth0Id(
    auth0Id: string,
  ): Promise<Document & IUser> {
    try {
      const user = await this.UserModel.findOne({ auth0Id: auth0Id });
      if (!user) {
        throw new Error(`User with Auth0 ID ${auth0Id} not found`);
      }
      return user;
    } catch (error) {
      console.error('Error fetching user by Auth0 ID:', error);
      throw error;
    }
  }
}
