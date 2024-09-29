import {
  IEmailToken,
  IEmailTokenDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { makeEmailToken } from '../../fixtures/email-token';
import { BaseMockedModel, createBaseMockedModel } from './base';

// Extend the BaseMockedModel with any EmailToken-specific methods
export type MockedEmailTokenModel = BaseMockedModel<
  IEmailTokenDocument,
  IEmailToken
>;

const baseMockedModel = createBaseMockedModel<IEmailTokenDocument>(
  ModelName.EmailToken,
);

export const EmailTokenModel: MockedEmailTokenModel = Object.assign(
  baseMockedModel,
  {
    // Override the create method with EmailToken-specific logic
    create: jest
      .fn()
      .mockImplementation(
        async (emailTokenData: Partial<IEmailTokenDocument>) => {
          return makeEmailToken(emailTokenData);
        },
      ),
  },
);
