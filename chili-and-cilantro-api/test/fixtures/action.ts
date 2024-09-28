import {
  ActionType,
  CardType,
  ChiliCilantroActions,
  constants,
  DefaultIdType,
  ICreateGameActionDocument,
  ICreateGameDetails,
  IEndGameActionDocument,
  IEndGameDetails,
  IEndRoundActionDocument,
  IEndRoundDetails,
  IExpireGameActionDocument,
  IExpireGameDetails,
  IFlipCardActionDocument,
  IFlipCardDetails,
  IJoinGameActionDocument,
  IJoinGameDetails,
  IMakeBidActionDocument,
  IMakeBidDetails,
  IMessageActionDocument,
  IMessageDetails,
  IPassActionDocument,
  IPassDetails,
  IPlaceCardActionDocument,
  IPlaceCardDetails,
  IQuitGameActionDocument,
  IQuitGameDetails,
  IStartBiddingActionDocument,
  IStartBiddingDetails,
  IStartGameActionDocument,
  IStartGameDetails,
  IStartNewRoundActionDocument,
  IStartNewRoundDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { faker } from '@faker-js/faker';
import { createMockDocument } from '../../src/mocks/create-mock-document';
import { MockedModel } from './mocked-model';
import { generateObjectId } from './objectId';

export function generateCreateGameAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  overrides?: Partial<ICreateGameActionDocument>,
): ICreateGameActionDocument {
  return createMockDocument<ICreateGameActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.CREATE_GAME,
    details: {} as ICreateGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateJoinGameAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  overrides?: Partial<IJoinGameActionDocument>,
): IJoinGameActionDocument {
  return createMockDocument<IJoinGameActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.JOIN_GAME,
    details: {} as IJoinGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateStartGameAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  overrides?: Partial<IStartGameActionDocument>,
): IStartGameActionDocument {
  return createMockDocument<IStartGameActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.START_GAME,
    details: {} as IStartGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateEndGameAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  overrides?: Partial<IEndGameActionDocument>,
): IEndGameActionDocument {
  return createMockDocument<IEndGameActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.END_GAME,
    details: {} as IEndGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateEndRoundAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  overrides?: Partial<IEndRoundActionDocument>,
): IEndRoundActionDocument {
  return createMockDocument<IEndRoundActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.END_ROUND,
    details: {} as IEndRoundDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateExpireGameAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  overrides?: Partial<IExpireGameActionDocument>,
): IExpireGameActionDocument {
  return createMockDocument<IExpireGameActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.EXPIRE_GAME,
    details: {} as IExpireGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateSendMessageAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  message: string,
  overrides?: Partial<IMessageActionDocument>,
): IMessageActionDocument {
  return createMockDocument<IMessageActionDocument>(() => ({
    _id: generateObjectId(),
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
    ...overrides,
  }));
}

export function generateMakeBidAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  round: number,
  bid: number,
  overrides?: Partial<IMakeBidActionDocument>,
): IMakeBidActionDocument {
  return createMockDocument<IMakeBidActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.MAKE_BID,
    details: {
      bidNumber: bid,
    } as IMakeBidDetails,
    round: round,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateStartBiddingAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  round: number,
  bid: number,
  overrides?: Partial<IStartBiddingActionDocument>,
): IStartBiddingActionDocument {
  return createMockDocument<IStartBiddingActionDocument>(() => ({
    _id: generateObjectId(),
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
    ...overrides,
  }));
}

export function generatePassAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  round: number,
  overrides?: Partial<IPassActionDocument>,
): IPassActionDocument {
  return createMockDocument<IPassActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.PASS,
    details: {} as IPassDetails,
    round: round,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateFlipCardAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  round: number,
  cardIndex: number,
  overrides?: Partial<IFlipCardActionDocument>,
): IFlipCardActionDocument {
  return createMockDocument<IFlipCardActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.FLIP_CARD,
    details: {
      chef: chefId,
      card: generateObjectId(),
      cardIndex: cardIndex,
    } as IFlipCardDetails,
    round: round,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generatePlaceCardAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  round: number,
  cardType: CardType,
  position: number,
  overrides?: Partial<IPlaceCardActionDocument>,
): IPlaceCardActionDocument {
  return createMockDocument<IPlaceCardActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.PLACE_CARD,
    details: {
      cardType: cardType,
      position: position,
    } as IPlaceCardDetails,
    round: round,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateQuitGameAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  overrides?: Partial<IQuitGameActionDocument>,
): IQuitGameActionDocument {
  return createMockDocument<IQuitGameActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.QUIT_GAME,
    details: {} as IQuitGameDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateStartRoundAction(
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  round: number,
  overrides?: Partial<IStartNewRoundActionDocument>,
): IStartNewRoundActionDocument {
  return createMockDocument<IStartNewRoundActionDocument>(() => ({
    _id: generateObjectId(),
    gameId: gameId,
    chefId: chefId,
    userId: userId,
    type: ActionType.START_NEW_ROUND,
    details: {
      round: round,
    } as IStartNewRoundDetails,
    round: constants.NONE,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  }));
}

export function generateAction(
  actionType: ActionType,
  gameId: DefaultIdType,
  chefId: DefaultIdType,
  userId: DefaultIdType,
  overrides?: Partial<ChiliCilantroActions>,
): ChiliCilantroActions & MockedModel {
  let actionData: Partial<ChiliCilantroActions>;
  switch (actionType) {
    case ActionType.CREATE_GAME:
      actionData = generateCreateGameAction(gameId, chefId, userId, overrides);
      break;
    case ActionType.END_GAME:
      actionData = generateEndGameAction(gameId, chefId, userId, overrides);
      break;
    case ActionType.END_ROUND:
      actionData = generateEndRoundAction(gameId, chefId, userId, overrides);
      break;
    case ActionType.EXPIRE_GAME:
      actionData = generateExpireGameAction(gameId, chefId, userId, overrides);
      break;
    case ActionType.FLIP_CARD:
      actionData = generateFlipCardAction(
        gameId,
        chefId,
        userId,
        faker.number.int({ min: 1, max: 6 }),
        faker.number.int({ min: 0, max: 5 }),
        overrides as Partial<IFlipCardActionDocument>,
      );
      break;
    case ActionType.JOIN_GAME:
      actionData = generateJoinGameAction(gameId, chefId, userId, overrides);
      break;
    case ActionType.MAKE_BID:
      actionData = generateMakeBidAction(
        gameId,
        chefId,
        userId,
        faker.number.int({ min: 1, max: 6 }),
        faker.number.int({ min: 1, max: 6 }),
        overrides as Partial<IMakeBidActionDocument>,
      );
      break;
    case ActionType.MESSAGE:
      actionData = generateSendMessageAction(
        gameId,
        chefId,
        userId,
        faker.lorem.sentence(),
        overrides as Partial<IMessageActionDocument>,
      );
      break;
    case ActionType.PASS:
      actionData = generatePassAction(
        gameId,
        chefId,
        userId,
        faker.number.int({ min: 1, max: 6 }),
        overrides,
      );
      break;
    case ActionType.PLACE_CARD:
      actionData = generatePlaceCardAction(
        gameId,
        chefId,
        userId,
        faker.number.int({ min: 1, max: 6 }),
        faker.helpers.enumValue(CardType),
        faker.number.int({ min: 1, max: 6 }),
        overrides as Partial<IPlaceCardActionDocument>,
      );
      break;
    case ActionType.QUIT_GAME:
      actionData = generateQuitGameAction(
        gameId,
        chefId,
        userId,
        overrides as Partial<IQuitGameActionDocument>,
      );
      break;
    case ActionType.START_BIDDING:
      actionData = generateStartBiddingAction(
        gameId,
        chefId,
        userId,
        faker.number.int({ min: 1, max: 6 }),
        faker.number.int({ min: 1, max: 6 }),
        overrides as Partial<IStartBiddingActionDocument>,
      );
      break;
    case ActionType.START_GAME:
      actionData = generateStartGameAction(gameId, chefId, userId, overrides);
      break;
    case ActionType.START_NEW_ROUND:
      actionData = generateStartRoundAction(
        gameId,
        chefId,
        userId,
        faker.number.int({ min: 1, max: 6 }),
        overrides,
      );
      break;
    default:
      throw new Error(`Unexpected action type: ${actionType}`);
  }

  const action = {
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
    exec: jest.fn().mockResolvedValue(actionData),
    save: jest.fn().mockImplementation(() => Promise.resolve(action)),
    sort: jest.fn().mockReturnThis(),
    ...actionData,
  } as ChiliCilantroActions & MockedModel;
  return action;
}
