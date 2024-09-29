import {
  AccountStatusTypeEnum,
  constants,
  IUser,
  IUserDocument,
  IUserObject,
  StringLanguages,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { hashSync } from 'bcrypt';
import { Types } from 'mongoose';

export function makeUser(overrides: Partial<IUserObject> = {}): IUserDocument {
  const creatorId = new Types.ObjectId();
  const createdAt = new Date();
  const newUser: IUser = {
    username: faker.internet.userName(),
    siteLanguage: StringLanguages.EnglishUS,
    accountStatusType: AccountStatusTypeEnum.Active,
    email: faker.internet.email(),
    emailVerified: true,
    password: faker.internet.password(),
    timezone: faker.location.timeZone(),
    createdAt: createdAt,
    updatedAt: createdAt,
    createdBy: creatorId,
    updatedBy: creatorId,
    ...overrides,
  };
  const hashedPassword = hashSync(newUser.password, constants.BCRYPT_ROUNDS);
  return {
    ...newUser,
    _id: new Types.ObjectId(),
    password: hashedPassword,
  } as IUserDocument;
}

export default makeUser;
