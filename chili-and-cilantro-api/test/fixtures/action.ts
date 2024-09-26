import { Schema } from 'mongoose';
import { faker } from '@faker-js/faker';
import {
  constants,
  Action,
  CardType,
  ChefState,
  ICreateGameAction,
  ICreateGameDetails,
  IExpireGameAction,
  IExpireGameDetails,
  IJoinGameAction,
  IJoinGameDetails,
  IMessageAction,
  IMessageDetails,
  IPassAction,
  IPassDetails,
  IPlaceCardAction,
  IStartBiddingAction,
  IStartBiddingDetails,
  IStartGameAction,
  IStartGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { UtilityService } from '../../src/services/utility';
import { generateObjectId } from '../fixtures/objectId';

export function generateCreateGameAction(
  gameId: Schema.Types.ObjectId,
  chefId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId
): ICreateGameAction {
  return {
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: Action.CREATE_GAME,
    details: {} as ICreateGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generateJoinGameAction(
  gameId: Schema.Types.ObjectId,
  chefId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId
): IJoinGameAction {
  return {
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: Action.JOIN_GAME,
    details: {} as IJoinGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generateStartGameAction(
  gameId: Schema.Types.ObjectId,
  chefId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId
): IStartGameAction {
  return {
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: Action.START_GAME,
    details: {} as IStartGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generateExpireGameAction(
  gameId: Schema.Types.ObjectId,
  chefId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId
): IExpireGameAction {
  return {
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: Action.EXPIRE_GAME,
    details: {} as IExpireGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generateSendMessageAction(
  gameId: Schema.Types.ObjectId,
  chefId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  message: string
): IMessageAction {
  return {
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: Action.MESSAGE,
    details: {
      message: message,
    } as IMessageDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generateStartBiddingAction(
  gameId: Schema.Types.ObjectId,
  chefId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  round: number,
  bid: number
): IStartBiddingAction {
  return {
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: Action.START_BIDDING,
    details: {
      bid: bid,
    } as IStartBiddingDetails,
    round: round,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generatePassAction(
  gameId: Schema.Types.ObjectId,
  chefId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  round: number
): IPassAction {
  return {
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: Action.PASS,
    details: {} as IPassDetails,
    round: round,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generatePlaceCardAction(
  gameId: Schema.Types.ObjectId,
  chefId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  round: number,
  cardType: CardType,
  position: number
): IPlaceCardAction {
  return {
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: Action.PLACE_CARD,
    details: {
      cardType: cardType,
      position: position,
    },
    round: round,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}
