import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import { ChefState, IChef } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { UtilityService } from '../../src/services/utility';
import { generateObjectId } from './objectId';

/**
 * Generate a chef with random values, and a save method to emulate mongoose Document
 * @param overrides Any values to override the generated values
 * @returns
 */
export function generateChef(overrides?: Object): IChef & { save: jest.Mock } {
  const chef = {
    _id: generateObjectId(),
    gameId: generateObjectId(),
    name: faker.person.firstName(),
    hand: UtilityService.makeHand(),
    placedCards: [],
    lostCards: [],
    userId: generateObjectId(),
    state: ChefState.LOBBY,
    host: false,
    save: jest.fn(),
    ...overrides,
  };
  chef.save.mockImplementation(() => Promise.resolve(chef));
  return chef;
}
