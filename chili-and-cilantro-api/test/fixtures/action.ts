import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Action, ChefState, ICreateGameAction, ICreateGameDetails } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { UtilityService } from '../../src/services/utility';

export function generateCreateGameAction(gameId: Schema.Types.ObjectId, chefId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId): ICreateGameAction {
  return {
    _id: new Schema.Types.ObjectId('aaaaaaaaaaaa'),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: Action.CREATE_GAME,
    details: {} as ICreateGameDetails,
    round: -1,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  }
}