import {
  AccountStatusTypeEnum,
  GetModelFunction,
  IBaseDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import moment from 'moment-timezone';

function getRandomTimezone(): string {
  const timezones = moment.tz.names();
  const randomIndex = Math.floor(Math.random() * timezones.length);
  return timezones[randomIndex];
}

export class Database {
  public getModel: GetModelFunction = <T extends IBaseDocument<any>>(
    modelName: ModelName,
  ) => {
    let mockData: Partial<T> = {};
    switch (modelName) {
      case ModelName.User:
        mockData = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
          emailVerified: true,
          accountStatusType: AccountStatusTypeEnum.Active,
          timezone: getRandomTimezone(),
          lastLogin: faker.date.recent(),
        } as unknown as Partial<T>;
        break;
      default:
        throw new Error(`Unexpected model name: ${modelName}`);
    }

    return {
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockReturnThis(),
      findById: jest.fn().mockReturnThis(),
      create: jest.fn().mockImplementation((doc) => Promise.resolve(doc)),
      updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockData),
      ...mockData,
    } as unknown as T;
  };
}
