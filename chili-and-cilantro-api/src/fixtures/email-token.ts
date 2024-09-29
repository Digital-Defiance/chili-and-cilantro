import {
  EmailTokenType,
  IEmailToken,
  IEmailTokenDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export function makeEmailToken(
  overrides: Partial<IEmailTokenDocument> = {},
): IEmailTokenDocument {
  const createdAt = new Date();
  const newEmailToken: IEmailToken = {
    userId: new Types.ObjectId(),
    type: EmailTokenType.AccountVerification,
    token: uuidv4(),
    email: faker.internet.email(),
    lastSent: createdAt,
    expiresAt: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000), // 1 day later
    createdAt: createdAt,
    ...overrides,
  };

  return {
    ...newEmailToken,
    _id: new Types.ObjectId(),
  } as IEmailTokenDocument;
}

export default makeEmailToken;
