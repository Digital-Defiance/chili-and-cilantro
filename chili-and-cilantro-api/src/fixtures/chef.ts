import {
  ChefState,
  IChef,
  IChefDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { UtilityService } from '../services/utility';

export function makeChef(
  overrides: Partial<IChefDocument> = {},
): IChefDocument {
  const createdAt = new Date();
  const newChef: IChef = {
    gameId: new Types.ObjectId(),
    name: faker.person.firstName(),
    hand: UtilityService.makeHand(),
    placedCards: [],
    lostCards: [],
    userId: new Types.ObjectId(),
    state: ChefState.LOBBY,
    host: false,
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newChef,
    _id: new Types.ObjectId(),
  } as IChefDocument;
}

export default makeChef;
