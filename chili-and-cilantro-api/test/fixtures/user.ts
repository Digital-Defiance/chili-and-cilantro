import {
  constants,
  IUser,
  IUserDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

export function generateUserPassword(): string {
  let generatedPassword = '';
  while (
    generatedPassword.length < constants.MIN_PASSWORD_LENGTH ||
    generatedPassword.length > constants.MAX_PASSWORD_LENGTH
  ) {
    generatedPassword = faker.internet.password();
  }
  return generatedPassword;
}

export function generateUsername(): string {
  let generatedUsername = '';
  while (
    generatedUsername.length < constants.MIN_USERNAME_LENGTH ||
    generatedUsername.length > constants.MAX_USERNAME_LENGTH
  ) {
    generatedUsername = faker.internet.userName();
  }
  return generatedUsername;
}

export function generateUserDisplayName(): string {
  let generatedDisplayName = '';
  while (
    generatedDisplayName.length < constants.MIN_USER_DISPLAY_NAME_LENGTH ||
    generatedDisplayName.length > constants.MAX_USER_DISPLAY_NAME_LENGTH
  ) {
    generatedDisplayName = faker.internet.displayName();
  }
  return generatedDisplayName;
}

/**
 * Generates a mock user document.
 * @param overrides Optional overrides for the user fields.
 * @returns A mock IUserDocument with a jest mock for the save method.
 */
export function generateUser(
  overrides?: Partial<IUser>,
): IUserDocument & { save: jest.Mock } {
  const id = new Types.ObjectId();
  const user = {
    _id: id,
    username: generateUsername(),
    password: faker.internet.password(),
    givenName: faker.person.firstName(),
    surname: faker.person.lastName(),
    userPrincipalName: faker.internet.email(),
    email: faker.internet.email(),
    emailVerified: faker.datatype.boolean(),
    lastLogin: faker.date.past(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    createdBy: id,
    updatedBy: id,
    save: jest.fn(),
    ...overrides,
  } as IUserDocument & { save: jest.Mock };

  user.save.mockImplementation(() => Promise.resolve(user));
  return user;
}
