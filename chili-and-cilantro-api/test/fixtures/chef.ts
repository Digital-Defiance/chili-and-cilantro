import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import { ChefState, IChef } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { UtilityService } from '../../src/services/utility';
import { generateObjectId } from './objectId';

export function generateChef(overrides?: Object): IChef {
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