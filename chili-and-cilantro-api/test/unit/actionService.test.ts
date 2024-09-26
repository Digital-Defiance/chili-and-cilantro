import { Document, Model, Schema } from 'mongoose';
import { ActionService } from '../../src/services/action';
import { IDatabase } from '../../src/interfaces/database';
import { generateGame, generateChefGameUser } from '../fixtures/game';
import { generateObjectId } from '../fixtures/objectId';
import {
  generateCreateGameAction,
  generateExpireGameAction,
  generateJoinGameAction,
  generatePassAction,
  generatePlaceCardAction,
  generateSendMessageAction,
  generateStartBiddingAction,
  generateStartGameAction,
} from '../fixtures/action';
import {
  constants,
  IAction,
  IGame,
  IChef,
  IUser,
  IJoinGameAction,
  Action,
  ICreateGameAction,
  IStartGameAction,
  IMessageAction,
  IExpireGameAction,
  IStartBiddingAction,
  IPassAction,
  CardType,
  IPlaceCardAction,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { generateUser } from '../fixtures/user';
import { generateChef } from '../fixtures/chef';
import { faker } from '@faker-js/faker';

type MockModel<T = any> = Model<T> &
  jest.Mocked<Model<T>> & {
    sort: jest.Mock;
  };

describe('ActionService', () => {
  let gameId: Schema.Types.ObjectId;
  let mockGame: IGame;
  let hostChef: IChef;
  let hostUser: IUser;

  beforeEach(() => {
    const generated = generateChefGameUser(true);
    gameId = generated.game._id;
    mockGame = generated.game;
    hostChef = generated.chef;
    hostUser = generated.user;
  });

  describe('getGameHistoryAsync', () => {
    it('should retrieve game history', async () => {
      // Arrange
      const mockActions = [
        generateCreateGameAction(gameId, hostChef._id, hostUser._id),
      ];

      const mockActionModel = {
        find: jest.fn().mockReturnThis(), // Mock find to return 'this', enabling chaining
        sort: jest.fn().mockResolvedValue(mockActions), // Mock sort to resolve with mockActions
        create: jest.fn(),
      } as unknown as MockModel<IAction>;

      const mockDatabase = {
        getModel: jest.fn().mockReturnValue(mockActionModel),
        getActionModel: jest.fn().mockReturnValue(mockActionModel),
      } as unknown as IDatabase;

      const actionService = new ActionService(mockDatabase);

      // Act
      const result = await actionService.getGameHistoryAsync(mockGame);

      // Assert
      expect(mockActionModel.find).toHaveBeenCalledWith({ gameId: gameId });
      expect(mockActionModel.sort).toHaveBeenCalledWith({ createdAt: 1 });
      expect(result).toEqual(mockActions);
    });
  });

  describe('createGameAsync', () => {
    it('should create a game action', async () => {
      const mockCreateGameAction = generateCreateGameAction(
        gameId,
        hostChef._id,
        hostUser._id
      );
      const mockCreateGameActionDocument = {
        ...mockCreateGameAction,
        save: jest.fn(),
        isModified: jest.fn(),
      };
      const mockActionModel = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
        create: jest.fn(),
      } as unknown as MockModel<ICreateGameAction>;
      mockActionModel.create.mockResolvedValue(
        mockCreateGameActionDocument as any
      );

      const mockDatabase = {
        getModel: jest.fn().mockReturnValue(mockActionModel),
        getActionModel: jest.fn().mockReturnValue(mockActionModel),
      } as unknown as IDatabase;

      const actionService = new ActionService(mockDatabase);

      const result = await actionService.createGameAsync(
        mockGame,
        hostChef,
        hostUser
      );

      expect(mockActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: Action.CREATE_GAME,
        details: {},
        round: constants.NONE,
      });
      expect(result.gameId).toEqual(mockCreateGameAction.gameId);
      expect(result.chefId).toEqual(mockCreateGameAction.chefId);
      expect(result.userId).toEqual(mockCreateGameAction.userId);
      expect(result.type).toEqual(mockCreateGameAction.type);
    });
  });
  describe('joinGameAsync', () => {
    it('should create a join game action', async () => {
      // Arrange
      const mockJoinGameAction = generateJoinGameAction(
        gameId,
        hostChef._id,
        hostUser._id
      );
      const mockJoinGameActionDocument = {
        ...mockJoinGameAction,
        save: jest.fn(),
        isModified: jest.fn(),
      };
      const mockActionModel = {
        create: jest.fn().mockResolvedValue(mockJoinGameActionDocument),
      } as unknown as MockModel<IJoinGameAction>;

      const mockDatabase = {
        getActionModel: jest.fn().mockReturnValue(mockActionModel),
      } as unknown as IDatabase;

      const actionService = new ActionService(mockDatabase);

      // Act
      const result = await actionService.joinGameAsync(
        mockGame,
        hostChef,
        hostUser
      );

      // Assert
      expect(mockActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: Action.JOIN_GAME,
        details: {},
        round: constants.NONE,
      });
      expect(result.gameId).toEqual(mockJoinGameAction.gameId);
      expect(result.chefId).toEqual(mockJoinGameAction.chefId);
      expect(result.userId).toEqual(mockJoinGameAction.userId);
      expect(result.type).toEqual(mockJoinGameAction.type);
    });
  });
  describe('startGameAsync', () => {
    it('should create a start game action', async () => {
      // Arrange
      const mockStartGameAction = generateStartGameAction(
        gameId,
        hostChef._id,
        hostUser._id
      );
      const mockStartGameActionDocument = {
        ...mockStartGameAction,
        save: jest.fn(),
        isModified: jest.fn(),
      };
      const mockActionModel = {
        create: jest.fn().mockResolvedValue(mockStartGameActionDocument),
      } as unknown as MockModel<IStartGameAction>;

      const mockDatabase = {
        getActionModel: jest.fn().mockReturnValue(mockActionModel),
      } as unknown as IDatabase;

      const actionService = new ActionService(mockDatabase);

      // Act
      const result = await actionService.startGameAsync(mockGame);

      // Assert
      expect(mockActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: Action.START_GAME,
        details: {},
        round: constants.NONE,
      });
      expect(result.gameId).toEqual(mockStartGameAction.gameId);
      expect(result.chefId).toEqual(mockStartGameAction.chefId);
      expect(result.userId).toEqual(mockStartGameAction.userId);
      expect(result.type).toEqual(mockStartGameAction.type);
    });
  });
  describe('expireGameAsync', () => {
    it('should create an expire game action', async () => {
      // Arrange
      const mockExpireGameAction = generateExpireGameAction(
        gameId,
        hostChef._id,
        hostUser._id
      );
      const mockExpireGameActionDocument = {
        ...mockExpireGameAction,
        save: jest.fn(),
        isModified: jest.fn(),
      };
      const mockActionModel = {
        create: jest.fn().mockResolvedValue(mockExpireGameActionDocument),
      } as unknown as MockModel<IExpireGameAction>;

      const mockDatabase = {
        getActionModel: jest.fn().mockReturnValue(mockActionModel),
      } as unknown as IDatabase;

      const actionService = new ActionService(mockDatabase);

      // Act
      const result = await actionService.expireGameAsync(mockGame);

      // Assert
      expect(mockActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: Action.EXPIRE_GAME,
        details: {},
        round: constants.NONE,
      });
      expect(result.gameId).toEqual(mockExpireGameAction.gameId);
      expect(result.chefId).toEqual(mockExpireGameAction.chefId);
      expect(result.userId).toEqual(mockExpireGameAction.userId);
      expect(result.type).toEqual(mockExpireGameAction.type);
    });
  });
  describe('sendMessageAsync', () => {
    it('should create a message action', async () => {
      // Arrange
      const message = faker.lorem.sentence();
      const mockSendMessageAction = generateSendMessageAction(
        gameId,
        hostChef._id,
        hostUser._id,
        message
      );
      const mockSendMessageActionDocument = {
        ...mockSendMessageAction,
        save: jest.fn(),
        isModified: jest.fn(),
      };
      const mockActionModel = {
        create: jest.fn().mockResolvedValue(mockSendMessageActionDocument),
      } as unknown as MockModel<IMessageAction>;

      const mockDatabase = {
        getActionModel: jest.fn().mockReturnValue(mockActionModel),
      } as unknown as IDatabase;

      const actionService = new ActionService(mockDatabase);

      // Act
      const result = await actionService.sendMessageAsync(
        mockGame,
        hostChef,
        message
      );

      // Assert
      expect(mockActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: Action.MESSAGE,
        details: {
          message: message,
        },
        round: constants.NONE,
      });
      expect(result.gameId).toEqual(mockSendMessageAction.gameId);
      expect(result.chefId).toEqual(mockSendMessageAction.chefId);
      expect(result.userId).toEqual(mockSendMessageAction.userId);
      expect(result.type).toEqual(mockSendMessageAction.type);
      expect(result.details.message).toEqual(message);
    });
  });
  describe('startBiddingAsync', () => {
    it('should create a start bidding action', async () => {
      // Arrange
      const round = faker.number.int({ min: 0, max: 10 });
      mockGame = generateGame(true, {
        _id: gameId,
        hostUserId: hostUser._id,
        hostChefId: hostChef._id,
        currentRound: round,
        chefIds: [hostChef._id],
      });
      const bid = faker.number.int({ min: 1, max: 10 });
      const mockStartBiddingAction = generateStartBiddingAction(
        gameId,
        hostChef._id,
        hostUser._id,
        round,
        bid
      );
      const mockStartBiddingActionDocument = {
        ...mockStartBiddingAction,
        save: jest.fn(),
        isModified: jest.fn(),
      };
      const mockActionModel = {
        create: jest.fn().mockResolvedValue(mockStartBiddingActionDocument),
      } as unknown as MockModel<IStartBiddingAction>;

      const mockDatabase = {
        getActionModel: jest.fn().mockReturnValue(mockActionModel),
      } as unknown as IDatabase;

      const actionService = new ActionService(mockDatabase);

      // Act
      const result = await actionService.startBiddingAsync(
        mockGame,
        hostChef,
        bid
      );

      // Assert
      expect(mockActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: Action.START_BIDDING,
        details: {
          bid: bid,
        },
        round: round,
      });
      expect(result.gameId).toEqual(mockStartBiddingAction.gameId);
      expect(result.chefId).toEqual(mockStartBiddingAction.chefId);
      expect(result.userId).toEqual(mockStartBiddingAction.userId);
      expect(result.type).toEqual(mockStartBiddingAction.type);
      expect(result.details.bid).toEqual(bid);
      expect(result.round).toEqual(round);
    });
  });
  describe('passAsync', () => {
    it('should create a pass action', async () => {
      // Arrange
      const round = faker.number.int({ min: 0, max: 10 });
      const bid = faker.number.int({ min: 1, max: 10 });
      mockGame = generateGame(true, {
        _id: gameId,
        hostUserId: hostUser._id,
        hostChefId: hostChef._id,
        currentRound: round,
        currentBid: bid,
        chefIds: [hostChef._id],
      });
      const mockPassAction = generatePassAction(
        gameId,
        hostChef._id,
        hostUser._id,
        round
      );
      const mockPassActionDocument = {
        ...mockPassAction,
        save: jest.fn(),
        isModified: jest.fn(),
      };
      const mockActionModel = {
        create: jest.fn().mockResolvedValue(mockPassActionDocument),
      } as unknown as MockModel<IPassAction>;

      const mockDatabase = {
        getActionModel: jest.fn().mockReturnValue(mockActionModel),
      } as unknown as IDatabase;

      const actionService = new ActionService(mockDatabase);

      // Act
      const result = await actionService.passAsync(mockGame, hostChef);

      // Assert
      expect(mockActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: Action.PASS,
        details: {},
        round: round,
      });
      expect(result.gameId).toEqual(mockPassAction.gameId);
      expect(result.chefId).toEqual(mockPassAction.chefId);
      expect(result.userId).toEqual(mockPassAction.userId);
      expect(result.type).toEqual(mockPassAction.type);
      expect(result.round).toEqual(round);
    });
  });
  describe('placeCardAsync', () => {
    it('should create a place card action', async () => {
      // Arrange
      const round = faker.number.int({ min: 0, max: 10 });
      mockGame = generateGame(true, {
        _id: gameId,
        hostUserId: hostUser._id,
        hostChefId: hostChef._id,
        currentRound: round,
        chefIds: [hostChef._id],
      });
      // pick a random CardType from the CardType enum
      const cardType = faker.helpers.enumValue(CardType);
      const position: number = faker.number.int({ min: 0, max: 4 });
      const mockPlaceCardAction = generatePlaceCardAction(
        gameId,
        hostChef._id,
        hostUser._id,
        round,
        cardType,
        position
      );
      const mockPlaceCardActionDocument = {
        ...mockPlaceCardAction,
        save: jest.fn(),
        isModified: jest.fn(),
      };
      const mockActionModel = {
        create: jest.fn().mockResolvedValue(mockPlaceCardActionDocument),
      } as unknown as MockModel<IPlaceCardAction>;

      const mockDatabase = {
        getActionModel: jest.fn().mockReturnValue(mockActionModel),
      } as unknown as IDatabase;

      const actionService = new ActionService(mockDatabase);

      // Act
      const result = await actionService.placeCardAsync(
        mockGame,
        hostChef,
        cardType,
        position
      );

      // Assert
      expect(mockActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: Action.PLACE_CARD,
        details: {
          cardType: cardType,
          position: position,
        },
        round: round,
      });
      expect(result.gameId).toEqual(mockPlaceCardAction.gameId);
      expect(result.chefId).toEqual(mockPlaceCardAction.chefId);
      expect(result.userId).toEqual(mockPlaceCardAction.userId);
      expect(result.type).toEqual(mockPlaceCardAction.type);
      expect(result.round).toEqual(round);
      expect(result.details.cardType).toEqual(cardType);
      expect(result.details.position).toEqual(position);
    });
  });
});
