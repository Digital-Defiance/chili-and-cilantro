import {
  AccountStatusTypeEnum,
  constants,
  IUser,
  IUserDocument,
  StringLanguages,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import moment from 'moment-timezone';
import { MockedModel } from './mocked-model';
import { generateObjectId } from './objectId';

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
): IUserDocument & MockedModel {
  const id = generateObjectId();
  const userData = {
    _id: id,
    username: generateUsername(),
    password: generateUserPassword(),
    email: faker.internet.email(),
    emailVerified: faker.datatype.boolean(),
    timezone: faker.helpers.arrayElement(moment.tz.names()),
    siteLanguage: faker.helpers.arrayElement(Object.values(StringLanguages)),
    accountStatusType: AccountStatusTypeEnum.Active,
    lastLogin: faker.date.past(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    createdBy: id,
    updatedBy: id,
    ...overrides,
  };

  const user = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    create: jest.fn().mockImplementation((doc) => Promise.resolve(doc)),
    updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(userData),
    save: jest.fn().mockImplementation(() => Promise.resolve(user)),
    sort: jest.fn().mockReturnThis(),
    ...userData,
  } as IUserDocument & MockedModel;
  return user;
}
