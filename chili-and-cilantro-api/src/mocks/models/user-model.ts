import {
  IUser,
  IUserDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { makeUser } from '../../fixtures/user';
import { BaseMockedModel, createBaseMockedModel } from './base';

// Extend the BaseMockedModel with any User-specific methods
export type MockedUserModel = BaseMockedModel<IUserDocument, IUser>;

const baseMockedModel = createBaseMockedModel<IUserDocument>(ModelName.User);

export const UserModel: MockedUserModel = Object.assign(baseMockedModel, {
  // Override the create method with User-specific logic
  create: jest.fn().mockImplementation(async (userData: Partial<IUser>) => {
    return makeUser(userData);
  }),
});
