import {
  constants,
  GamePhase,
  IGame,
  IGameDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

export function makeGame(
  overrides: Partial<IGameDocument> = {},
): IGameDocument {
  const creatorId = new Types.ObjectId();
  const createdAt = new Date();
  const newGame: IGame = {
    code: faker.string
      .alpha({ length: constants.GAME_CODE_LENGTH })
      .toUpperCase(),
    name: faker.lorem.words(3),
    password: faker.internet.password(constants.MIN_GAME_PASSWORD_LENGTH),
    chefIds: [new Types.ObjectId(), new Types.ObjectId()],
    eliminatedChefIds: [],
    maxChefs: faker.number.int({
      min: constants.MIN_CHEFS,
      max: constants.MAX_CHEFS,
    }),
    cardsPlaced: 0,
    currentBid: 0,
    currentChef: 0,
    currentPhase: GamePhase.SETUP,
    currentRound: 1,
    roundBids: {},
    roundWinners: {},
    turnOrder: [new Types.ObjectId(), new Types.ObjectId()],
    hostChefId: new Types.ObjectId(),
    hostUserId: new Types.ObjectId(),
    lastGame: null,
    winner: null,
    createdAt: createdAt,
    updatedAt: createdAt,
    createdBy: creatorId,
    updatedBy: creatorId,
    ...overrides,
  };

  return {
    ...newGame,
    _id: new Types.ObjectId(),
  } as IGameDocument;
}

export default makeGame;
