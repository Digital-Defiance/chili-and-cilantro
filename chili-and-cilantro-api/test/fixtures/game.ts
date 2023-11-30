import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import { constants, ChefState, GamePhase, IGame, IUser, IChef } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { UtilityService } from '../../src/services/utility';
import { numberBetween } from '../fixtures/utils';
import { generateUser } from './user';
import { generateChef } from './chef';
import { generateObjectId } from './objectId';

/**
 * Generate a game with random values, and a save method to emulate mongoose Document
 * @param withPassword Whether the game should have a password
 * @param overrides Any values to override the generated values
 * @returns 
 */
export function generateGame(withPassword = true, overrides?: Object): IGame & { save: jest.Mock } {
  const hostChefId = generateObjectId();
  const hostUserId = generateObjectId();
  const game = {
    _id: generateObjectId(),
    code: UtilityService.generateGameCode(),
    name: faker.lorem.words(3),
    ...withPassword ? { password: faker.internet.password() } : {},
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
    turnOrder: [],
    hostChefId: hostChefId,
    hostUserId: hostUserId,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    save: jest.fn(),
    ...overrides ? overrides : {}
  };
  game.save.mockImplementation(() => Promise.resolve(game));
  return game;
}

export function generateChefGameUser(withPassword: boolean, numAdditionalChefs = 0, overrides?: { user?: Object, chef?: Object, game?: Object }): { user: IUser, chef: IChef, game: IGame, additionalChefs: IChef[] } {
  const gameId = generateObjectId();
  const user = generateUser(overrides?.user);
  const chef = generateChef({ gameId, host: true, userId: user._id, ...overrides?.chef });
  const additionalChefs = Array.from({ length: numAdditionalChefs }, () => generateChef({ gameId, userId: user._id }));
  const chefIds = [chef._id, ...additionalChefs.map(c => c._id)];
  const game = generateGame(withPassword, {
    _id: gameId,
    hostUserId: user._id,
    hostChefId: chef._id,
    chefIds: chefIds,
    ...overrides?.game
  });
  return { user, chef, game, additionalChefs };
}