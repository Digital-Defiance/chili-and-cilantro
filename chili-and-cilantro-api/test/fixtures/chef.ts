import {
  ChefState,
  IChefDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { UtilityService } from '../../src/services/utility';
import { MockedModel } from './mocked-model';
import { generateObjectId } from './objectId';

/**
 * Generate a chef with random values, and a save method to emulate mongoose Document
 * @param overrides Any values to override the generated values
 * @returns
 */
export function generateChef(
  overrides?: Partial<IChefDocument>,
): IChefDocument & MockedModel {
  const chefData = {
    _id: generateObjectId(),
    gameId: generateObjectId(),
    name: faker.person.firstName(),
    hand: UtilityService.makeHand(),
    placedCards: [],
    lostCards: [],
    userId: generateObjectId(),
    state: ChefState.LOBBY,
    masterChef: false,
    ...overrides,
  } as Partial<IChefDocument>;

  const chef = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    create: jest.fn().mockImplementation((doc) => Promise.resolve(doc)),
    updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    deleteMany: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    validateSync: jest.fn(),
    countDocuments: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(chefData),
    save: jest.fn().mockImplementation(() => Promise.resolve(chef)),
    sort: jest.fn().mockReturnThis(),
    session: jest.fn().mockReturnThis(),
    ...chefData,
  } as IChefDocument & MockedModel;
  return chef;
}
