import { IUser } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import { generateObjectId } from './objectId';

export function generateUser(overrides?: Object): IUser {
  const id = generateObjectId();
  const user = {
    _id: id,
    auth0Id: faker.string.uuid(),
    username: faker.internet.userName(),
    givenName: faker.person.firstName(),
    name: faker.person.fullName(),
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
