import {
  IChef,
  IChefDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { makeChef } from '../../fixtures/chef';
import { BaseMockedModel, createBaseMockedModel } from './base';

// Extend the BaseMockedModel with any Chef-specific methods
export type MockedChefModel = BaseMockedModel<IChefDocument, IChef>;

const baseMockedModel = createBaseMockedModel<IChefDocument>(ModelName.Chef);

export const ChefModel: MockedChefModel = Object.assign(baseMockedModel, {
  // Override the create method with Chef-specific logic
  create: jest
    .fn()
    .mockImplementation(async (chefData: Partial<IChefDocument>) => {
      return makeChef(chefData);
    }),
});
