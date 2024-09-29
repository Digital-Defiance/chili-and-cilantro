import {
  constants,
  GamePhase,
  IChef,
  IChefDocument,
  IGame,
  IGameDocument,
  IUser,
  IUserDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { UtilityService } from '../../src/services/utility';
import { generateChef } from './chef';
import { MockedModel } from './mocked-model';
import { generateObjectId } from './objectId';
import { generateUser } from './user';
import { numberBetween } from './utils';

export function generateGamePassword(): string {
  let generatedPassword = '';
  while (
    generatedPassword.length < constants.MIN_GAME_PASSWORD_LENGTH ||
    generatedPassword.length > constants.MAX_GAME_PASSWORD_LENGTH ||
    !/\d/.test(generatedPassword) ||
    !/[A-Za-z]/.test(generatedPassword)
  ) {
    generatedPassword = faker.internet.password();
  }
  return generatedPassword;
}

/**
 * Generate a game with random values, and a save method to emulate mongoose Document
 * @param withPassword Whether the game should have a password
 * @param overrides Any values to override the generated values
 * @returns
 */
export function generateGame(
  withPassword = true,
  overrides?: object,
): IGameDocument & MockedModel {
  const hostChefId = generateObjectId();
  const hostUserId = generateObjectId();
  const gameData = {
    _id: generateObjectId(),
    code: UtilityService.generateGameCode(),
    name: faker.lorem.words(3),
    ...(withPassword ? { password: generateGamePassword() } : {}),
    chefIds: [hostChefId],
    eliminatedChefIds: [],
    maxChefs: numberBetween(constants.MIN_CHEFS, constants.MAX_CHEFS),
    cardsPlaced: 0,
    currentBid: constants.NONE,
    currentChef: constants.NONE,
    currentPhase: GamePhase.LOBBY,
    currentRound: constants.NONE,
    roundBids: {},
    roundWinners: {},
    turnOrder: [hostChefId],
    hostChefId: hostChefId,
    hostUserId: hostUserId,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...(overrides ? overrides : {}),
  } as Partial<IGameDocument>;

  const game = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    create: jest.fn().mockImplementation((doc) => Promise.resolve(doc)),
    updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(gameData),
    save: jest.fn().mockImplementation(() => Promise.resolve(game)),
    sort: jest.fn().mockReturnThis(),
    ...gameData,
  } as IGameDocument & MockedModel;
  return game;
}

export function generateChefGameUser(
  withPassword: boolean,
  numAdditionalChefs = 0,
  overrides?: {
    user?: Partial<IUser>;
    chef?: Partial<IChef>;
    game?: Partial<IGame>;
  },
): {
  user: IUserDocument;
  chef: IChefDocument;
  game: IGameDocument;
  additionalChefs: IChefDocument[];
} {
  const gameId = new Types.ObjectId();
  const user = generateUser(overrides?.user);
  const chef = generateChef({
    gameId,
    host: true,
    userId: user._id,
    ...overrides?.chef,
  });
  const additionalChefs = Array.from({ length: numAdditionalChefs }, () =>
    generateChef({ gameId, userId: user._id }),
  );
  const chefIds = [chef._id, ...additionalChefs.map((c) => c._id)];
  const game = generateGame(withPassword, {
    _id: gameId,
    hostUserId: user._id,
    hostChefId: chef._id,
    chefIds: chefIds,
    turnOrder: chefIds,
    ...overrides?.game,
  });
  return { user, chef, game, additionalChefs };
}
