import {
  ActionType,
  CardType,
  IActionDocument,
  ICreateGameAction,
  ICreateGameActionDocument,
  ICreateGameDetails,
  IEndGameActionDocument,
  IEndGameDetails,
  IEndRoundAction,
  IEndRoundActionDocument,
  IEndRoundDetails,
  IExpireGameAction,
  IExpireGameActionDocument,
  IExpireGameDetails,
  IFlipCardAction,
  IFlipCardActionDocument,
  IFlipCardDetails,
  IJoinGameAction,
  IJoinGameActionDocument,
  IJoinGameDetails,
  IMakeBidAction,
  IMakeBidActionDocument,
  IMakeBidDetails,
  IMessageAction,
  IMessageActionDocument,
  IMessageDetails,
  IPassAction,
  IPassActionDocument,
  IPassDetails,
  IPlaceCardAction,
  IPlaceCardActionDocument,
  IPlaceCardDetails,
  IQuitGameAction,
  IQuitGameActionDocument,
  IQuitGameDetails,
  IStartBiddingAction,
  IStartBiddingActionDocument,
  IStartBiddingDetails,
  IStartGameAction,
  IStartGameActionDocument,
  IStartGameDetails,
  IStartNewRoundAction,
  IStartNewRoundActionDocument,
  IStartNewRoundDetails,
  QuitGameReason,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

export const actionFactoryTable: {
  [key in ActionType]: (overrides: Partial<IActionDocument>) => IActionDocument;
} = {
  [ActionType.CREATE_GAME]: makeCreateGameAction,
  [ActionType.END_GAME]: makeEndGameAction,
  [ActionType.END_ROUND]: makeEndRoundAction,
  [ActionType.EXPIRE_GAME]: makeExpireGameAction,
  [ActionType.FLIP_CARD]: makeFlipCardAction,
  [ActionType.MAKE_BID]: makeMakeBidAction,
  [ActionType.PASS]: makePassAction,
  [ActionType.JOIN_GAME]: makeJoinGameAction,
  [ActionType.MESSAGE]: makeMessageAction,
  [ActionType.PLACE_CARD]: makePlaceCardAction,
  [ActionType.QUIT_GAME]: makeQuitGameAction,
  [ActionType.START_BIDDING]: makeStartBiddingAction,
  [ActionType.START_GAME]: makeStartGameAction,
  [ActionType.START_NEW_ROUND]: makeStartNewRoundAction,
};

export function makeAction(
  type: ActionType,
  overrides: Partial<IActionDocument> = {},
): IActionDocument {
  return actionFactoryTable[type](overrides);
}

export function makeCreateGameAction(
  overrides: Partial<ICreateGameActionDocument> = {},
): ICreateGameActionDocument {
  const createdAt = new Date();
  const newCreateGameAction: ICreateGameAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.CREATE_GAME,
    details: {} as ICreateGameDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newCreateGameAction,
    _id: new Types.ObjectId(),
  } as ICreateGameActionDocument;
}

export function makeEndGameAction(
  overrides: Partial<IEndGameActionDocument> = {},
): IEndGameActionDocument {
  const createdAt = new Date();
  const newEndGameAction: ICreateGameAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.END_GAME,
    details: {} as IEndGameDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newEndGameAction,
    _id: new Types.ObjectId(),
  } as IEndGameActionDocument;
}

export function makeEndRoundAction(
  overrides: Partial<IEndRoundActionDocument> = {},
): IEndRoundActionDocument {
  const createdAt = new Date();
  const newEndRoundAction: IEndRoundAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.END_ROUND,
    details: {} as IEndRoundDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newEndRoundAction,
    _id: new Types.ObjectId(),
  } as IEndRoundActionDocument;
}

export function makeExpireGameAction(
  overrides: Partial<IExpireGameActionDocument> = {},
): IExpireGameActionDocument {
  const createdAt = new Date();
  const newExpireGameAction: IExpireGameAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.EXPIRE_GAME,
    details: {} as IExpireGameDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newExpireGameAction,
    _id: new Types.ObjectId(),
  } as IExpireGameActionDocument;
}

export function makeFlipCardAction(
  overrides: Partial<IFlipCardActionDocument> = {},
): IFlipCardActionDocument {
  const createdAt = new Date();
  const newFlipCardAction: IFlipCardAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.FLIP_CARD,
    details: {
      chef: new Types.ObjectId(),
      card: new Types.ObjectId(),
      cardIndex: faker.number.int({ min: 0, max: 4 }),
    } as IFlipCardDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newFlipCardAction,
    _id: new Types.ObjectId(),
  } as IFlipCardActionDocument;
}

export function makeJoinGameAction(
  overrides: Partial<IJoinGameActionDocument> = {},
): IJoinGameActionDocument {
  const createdAt = new Date();
  const newJoinGameAction: IJoinGameAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.JOIN_GAME,
    details: {} as IJoinGameDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newJoinGameAction,
    _id: new Types.ObjectId(),
  } as IJoinGameActionDocument;
}

export function makeMakeBidAction(
  overrides: Partial<IMakeBidActionDocument> = {},
): IMakeBidActionDocument {
  const createdAt = new Date();
  const newMakeBidAction: IMakeBidAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.MAKE_BID,
    details: {
      bidNumber: faker.number.int({ min: 1, max: 4 }),
    } as IMakeBidDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newMakeBidAction,
    _id: new Types.ObjectId(),
  } as IMakeBidActionDocument;
}

export function makeMessageAction(
  overrides: Partial<IMessageActionDocument> = {},
): IMessageActionDocument {
  const createdAt = new Date();
  const newMessageAction: IMessageAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.MESSAGE,
    details: {
      message: faker.lorem.sentence(),
    } as IMessageDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newMessageAction,
    _id: new Types.ObjectId(),
  } as IMessageActionDocument;
}

export function makePassAction(
  overrides: Partial<IPassActionDocument> = {},
): IPassActionDocument {
  const createdAt = new Date();
  const newPassAction: IPassAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.PASS,
    details: {} as IPassDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newPassAction,
    _id: new Types.ObjectId(),
  } as IPassActionDocument;
}

export function makePlaceCardAction(
  overrides: Partial<IPlaceCardActionDocument> = {},
): IPlaceCardActionDocument {
  const createdAt = new Date();
  const newPlaceCardAction: IPlaceCardAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.PLACE_CARD,
    details: {
      cardType: faker.helpers.arrayElement(Object.values(CardType)),
      position: faker.number.int({ min: 0, max: 5 }),
    } as IPlaceCardDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newPlaceCardAction,
    _id: new Types.ObjectId(),
  } as IPlaceCardActionDocument;
}

export function makeQuitGameAction(
  overrides: Partial<IQuitGameActionDocument> = {},
): IQuitGameActionDocument {
  const createdAt = new Date();
  const newQuitGameAction: IQuitGameAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.QUIT_GAME,
    details: {
      reason: faker.helpers.arrayElement(Object.values(QuitGameReason)),
    } as IQuitGameDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newQuitGameAction,
    _id: new Types.ObjectId(),
  } as IQuitGameActionDocument;
}

export function makeStartBiddingAction(
  overrides: Partial<IStartBiddingActionDocument> = {},
): IStartBiddingActionDocument {
  const createdAt = new Date();
  const newStartBiddingAction: IStartBiddingAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.START_BIDDING,
    details: {
      bid: faker.number.int({ min: 1, max: 4 }),
    } as IStartBiddingDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newStartBiddingAction,
    _id: new Types.ObjectId(),
  } as IStartBiddingActionDocument;
}

export function makeStartGameAction(
  overrides: Partial<IStartGameActionDocument> = {},
): IStartGameActionDocument {
  const createdAt = new Date();
  const newStartGameAction: IStartGameAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.START_GAME,
    details: {} as IStartGameDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newStartGameAction,
    _id: new Types.ObjectId(),
  } as IStartGameActionDocument;
}

export function makeStartNewRoundAction(
  overrides: Partial<IStartNewRoundActionDocument> = {},
): IStartNewRoundActionDocument {
  const createdAt = new Date();
  const newStartNewRoundAction: IStartNewRoundAction = {
    gameId: new Types.ObjectId(),
    chefId: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    type: ActionType.START_NEW_ROUND,
    details: {} as IStartNewRoundDetails,
    round: faker.number.int({ min: 1, max: 10 }),
    createdAt: createdAt,
    updatedAt: createdAt,
    ...overrides,
  };

  return {
    ...newStartNewRoundAction,
    _id: new Types.ObjectId(),
  } as IStartNewRoundActionDocument;
}

export default makeAction;
