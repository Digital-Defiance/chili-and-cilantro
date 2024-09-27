import {
  ActionType,
  CardType,
  constants,
  ICreateGameActionObject,
  ICreateGameDetails,
  IExpireGameActionObject,
  IExpireGameDetails,
  IJoinGameActionObject,
  IJoinGameDetails,
  IMessageActionObject,
  IMessageDetails,
  IPassActionObject,
  IPassDetails,
  IPlaceCardActionObject,
  IStartBiddingActionObject,
  IStartBiddingDetails,
  IStartGameActionObject,
  IStartGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

export function generateCreateGameAction(
  gameId: Types.ObjectId,
  chefId: Types.ObjectId,
  userId: Types.ObjectId,
): ICreateGameActionObject {
  return {
    _id: new Types.ObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.CREATE_GAME,
    details: {} as ICreateGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generateJoinGameAction(
  gameId: Types.ObjectId,
  chefId: Types.ObjectId,
  userId: Types.ObjectId,
): IJoinGameActionObject {
  return {
    _id: new Types.ObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.JOIN_GAME,
    details: {} as IJoinGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generateStartGameAction(
  gameId: Types.ObjectId,
  chefId: Types.ObjectId,
  userId: Types.ObjectId,
): IStartGameActionObject {
  return {
    _id: new Types.ObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.START_GAME,
    details: {} as IStartGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generateExpireGameAction(
  gameId: Types.ObjectId,
  chefId: Types.ObjectId,
  userId: Types.ObjectId,
): IExpireGameActionObject {
  return {
    _id: new Types.ObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.EXPIRE_GAME,
    details: {} as IExpireGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generateSendMessageAction(
  gameId: Types.ObjectId,
  chefId: Types.ObjectId,
  userId: Types.ObjectId,
  message: string,
): IMessageActionObject {
  return {
    _id: new Types.ObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.MESSAGE,
    details: {
      message: message,
    } as IMessageDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generateStartBiddingAction(
  gameId: Types.ObjectId,
  chefId: Types.ObjectId,
  userId: Types.ObjectId,
  round: number,
  bid: number,
): IStartBiddingActionObject {
  return {
    _id: new Types.ObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.START_BIDDING,
    details: {
      bid: bid,
    } as IStartBiddingDetails,
    round: round,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generatePassAction(
  gameId: Types.ObjectId,
  chefId: Types.ObjectId,
  userId: Types.ObjectId,
  round: number,
): IPassActionObject {
  return {
    _id: new Types.ObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.PASS,
    details: {} as IPassDetails,
    round: round,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

export function generatePlaceCardAction(
  gameId: Types.ObjectId,
  chefId: Types.ObjectId,
  userId: Types.ObjectId,
  round: number,
  cardType: CardType,
  position: number,
): IPlaceCardActionObject {
  return {
    _id: new Types.ObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.PLACE_CARD,
    details: {
      cardType: cardType,
      position: position,
    },
    round: round,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}
