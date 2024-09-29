import {
  ActionType,
  CardType,
  constants,
  DefaultIdType,
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
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
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
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
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
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
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
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
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
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
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
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
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
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
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
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
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
