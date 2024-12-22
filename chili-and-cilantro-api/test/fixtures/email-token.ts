import {
  EmailTokenType,
  IEmailTokenDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { MockedModel } from './mocked-model';
import { generateObjectId } from './objectId';

/**
 * Generate a chef with random values, and a save method to emulate mongoose Document
 * @param overrides Any values to override the generated values
 * @returns
 */
export function generateEmailToken(
  overrides?: Partial<IEmailTokenDocument>,
): IEmailTokenDocument & MockedModel {
  const createdAt = new Date(faker.date.recent());
  const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 1 day later
  const emailTokenData = {
    _id: generateObjectId(),
    userId: generateObjectId(),
    type: faker.helpers.arrayElement(Object.values(EmailTokenType)),
    token: faker.string.uuid(),
    email: faker.internet.email(),
    lastSent: faker.date.recent(),
    expiresAt: expiresAt,
    ...overrides,
  } as Partial<IEmailTokenDocument>;

  const emailToken = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    create: jest.fn().mockImplementation((doc) => Promise.resolve(doc)),
    updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    deleteMany: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    validateSync: jest.fn(),
    countDocuments: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(emailTokenData),
    save: jest.fn().mockImplementation(() => Promise.resolve(emailToken)),
    sort: jest.fn().mockReturnThis(),
    session: jest.fn().mockReturnThis(),
    ...emailTokenData,
  } as IEmailTokenDocument & MockedModel;
  return emailToken;
}
