import { constants, IUser } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import { generateObjectId } from './objectId';

export function generateUserPassword(): string {
  let generatedPassword = '';
  while (generatedPassword.length < constants.MIN_PASSWORD_LENGTH || generatedPassword.length > constants.MAX_PASSWORD_LENGTH) {
    generatedPassword = faker.internet.password();
  }
  return generatedPassword;
}

export function generateUsername(): string {
  let generatedUsername = '';
  while (generatedUsername.length < constants.MIN_USERNAME_LENGTH || generatedUsername.length > constants.MAX_USERNAME_LENGTH) {
    generatedUsername = faker.internet.userName();
  }
  return generatedUsername;
}

export function generateUserDisplayName(): string {
  let generatedDisplayName = '';
  while (generatedDisplayName.length < constants.MIN_USER_DISPLAY_NAME_LENGTH || generatedDisplayName.length > constants.MAX_USER_DISPLAY_NAME_LENGTH) {
    generatedDisplayName = faker.internet.displayName();
  }
  return generatedDisplayName;
}

/**
 * Generate a user with random values, and a save method to emulate mongoose Document
 * @param overrides Any values to override the generated values
 * @returns 
 */
export function generateUser(overrides?: Object): IUser & { save: jest.Mock } {
  const id = generateObjectId();
  const user = {
    _id: id,
    auth0Id: faker.string.uuid(),
    username: generateUsername(),
    givenName: faker.person.firstName(),
    name: generateUserDisplayName(),
    surname: faker.person.lastName(),
    userPrincipalName: faker.internet.email(),
    email: faker.internet.email(),
    email_verified: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    createdBy: id,
    updatedBy: id,
    save: jest.fn(),
    ...overrides,
  };
  user.save.mockImplementation(() => Promise.resolve(user));
  return user;
}
