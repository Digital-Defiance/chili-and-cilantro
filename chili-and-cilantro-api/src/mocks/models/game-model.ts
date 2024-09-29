import {
  IGame,
  IGameDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { makeGame } from '../../fixtures/game';
import { BaseMockedModel, createBaseMockedModel } from './base';

// Extend the BaseMockedModel with any Game-specific methods
export type MockedGameModel = BaseMockedModel<IGameDocument, IGame>;

const baseMockedModel = createBaseMockedModel<IGameDocument>(ModelName.Game);

export const GameModel: MockedGameModel = Object.assign(baseMockedModel, {
  // Override the create method with Game-specific logic
  create: jest.fn().mockImplementation(async (gameData: Partial<IGame>) => {
    return makeGame(gameData);
  }),
});
