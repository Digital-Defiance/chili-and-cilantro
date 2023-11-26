import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import { constants, ChefState, GamePhase, IGame } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { UtilityService } from '../../src/services/utility';
import { numberBetween } from '../fixtures/utils';

export function generateGame(gameId: Schema.Types.ObjectId, hostUserId: Schema.Types.ObjectId, hostChefId: Schema.Types.ObjectId, withPassword: boolean, overrides?: Object): IGame {
  return {
    _id: gameId,
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
    ...overrides ? overrides : {}
  };
}