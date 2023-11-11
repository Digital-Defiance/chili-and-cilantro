import { IUser } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';

export function createUser(): IUser {
  return {
    _id: new Schema.Types.ObjectId('aaaaaaaaaaaa'),
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
    createdBy: new Schema.Types.ObjectId('bbbbbbbbbbbb'),
    updatedBy: new Schema.Types.ObjectId('bbbbbbbbbbbb'),
  };
}
