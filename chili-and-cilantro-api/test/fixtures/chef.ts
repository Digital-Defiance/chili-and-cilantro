import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import { ChefState, IChef } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { UtilityService } from '../../src/services/utility';

export function generateChef(host: boolean, gameId?: Schema.Types.ObjectId, userId?: Schema.Types.ObjectId): IChef {
  return {
    _id: new Schema.Types.ObjectId('aaaaaaaaaaaa'),
    gameId: gameId ?? new Schema.Types.ObjectId('bbbbbbbbbbbb'),
    name: faker.person.firstName(),
    hand: UtilityService.makeHand(),
    placedCards: [],
    lostCards: [],
    userId: userId ?? new Schema.Types.ObjectId('cccccccccccc'),
    state: ChefState.LOBBY,
    host: host,
  };
}