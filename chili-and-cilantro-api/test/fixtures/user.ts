import { IUser } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';

export function createUser(): IUser {
  return {
    _id: new Types.ObjectId(),
    auth0Id: faker.string.uuid(),
    username: faker.internet.userName(),
    givenName: faker.name.firstName(),
    familyName: faker.name.lastName(),
    surname: faker.name.lastName(),
  };
}
