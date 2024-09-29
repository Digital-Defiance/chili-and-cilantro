import {
  ActionType,
  CardType,
  constants,
  DefaultIdType,
  IChefDocument,
  IGameDocument,
  IUserDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';
import { ActionModel } from '../../src/mocks/models/action-model';
import { ActionService } from '../../src/services/action';
import { MockApplication } from '../fixtures/application';
import { generateChefGameUser } from '../fixtures/game';

type MockModel<T = any> = Model<T> &
  jest.Mocked<Model<T>> & {
    sort: jest.Mock;
  };

describe('ActionService', () => {
  let application: IApplication;
  let gameId: DefaultIdType;
  let mockGame: IGameDocument;
  let hostChef: IChefDocument;
  let hostUser: IUserDocument;

  beforeEach(async () => {
    application = new MockApplication();
    await application.start();
    const generated = generateChefGameUser(true);
    gameId = generated.game._id;
    mockGame = generated.game;
    hostChef = generated.chef;
    hostUser = generated.user;
  });

  describe('getGameHistoryAsync', () => {
    it('should retrieve game history', async () => {
      // Arrange
      const actionService = new ActionService(application);

      // Act
      const result = await actionService.getGameHistoryAsync(mockGame);

      // Assert
      expect(ActionModel.find).toHaveBeenCalledWith({ gameId: gameId });
      expect(ActionModel.sort).toHaveBeenCalledWith({ createdAt: 1 });
      expect(result).toEqual([
        expect.objectContaining({
          gameId: gameId,
          type: ActionType.CREATE_GAME,
        }),
      ]);
    });
  });

  describe('createGameAsync', () => {
    it('should create a game action', async () => {
      const actionService = new ActionService(application);

      const result = await actionService.createGameAsync(
        mockGame,
        hostChef,
        hostUser,
      );

      expect(ActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: ActionType.CREATE_GAME,
        details: {},
        round: constants.NONE,
      });
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(hostChef._id);
      expect(result.userId).toEqual(hostUser._id);
      expect(result.type).toEqual(ActionType.CREATE_GAME);
    });
  });
  describe('joinGameAsync', () => {
    it('should create a join game action', async () => {
      // Arrange
      const actionService = new ActionService(application);

      // Act
      const result = await actionService.joinGameAsync(
        mockGame,
        hostChef,
        hostUser,
      );

      // Assert
      expect(ActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: ActionType.JOIN_GAME,
        details: {},
        round: constants.NONE,
      });
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(hostChef._id);
      expect(result.userId).toEqual(hostUser._id);
      expect(result.type).toEqual(ActionType.JOIN_GAME);
    });
  });
  describe('startGameAsync', () => {
    it('should create a start game action', async () => {
      // Arrange
      const actionService = new ActionService(application);

      // Act
      const result = await actionService.startGameAsync(mockGame);

      // Assert
      expect(ActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: ActionType.START_GAME,
        details: {},
        round: constants.NONE,
      });
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(hostChef._id);
      expect(result.userId).toEqual(hostUser._id);
      expect(result.type).toEqual(ActionType.START_GAME);
    });
  });
  describe('expireGameAsync', () => {
    it('should create an expire game action', async () => {
      // Arrange
      const actionService = new ActionService(application);

      // Act
      const result = await actionService.expireGameAsync(mockGame);

      // Assert
      expect(ActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: ActionType.EXPIRE_GAME,
        details: {},
        round: constants.NONE,
      });
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(hostChef._id);
      expect(result.userId).toEqual(hostUser._id);
      expect(result.type).toEqual(ActionType.EXPIRE_GAME);
    });
  });
  describe('sendMessageAsync', () => {
    it('should create a message action', async () => {
      // Arrange
      const message = faker.lorem.sentence();
      const actionService = new ActionService(application);

      // Act
      const result = await actionService.sendMessageAsync(
        mockGame,
        hostChef,
        message,
      );

      // Assert
      expect(ActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: ActionType.MESSAGE,
        details: {
          message: message,
        },
        round: constants.NONE,
      });
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(hostChef._id);
      expect(result.userId).toEqual(hostUser._id);
      expect(result.type).toEqual(ActionType.MESSAGE);
      expect(result.details.message).toEqual(message);
    });
  });
  describe('startBiddingAsync', () => {
    it('should create a start bidding action', async () => {
      // Arrange
      const bid = faker.number.int({ min: 1, max: 10 });
      const actionService = new ActionService(application);

      // Act
      const result = await actionService.startBiddingAsync(
        mockGame,
        hostChef,
        bid,
      );

      // Assert
      expect(ActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: ActionType.START_BIDDING,
        details: {
          bid: bid,
        },
        round: expect.any(Number),
      });
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(hostChef._id);
      expect(result.userId).toEqual(hostUser._id);
      expect(result.type).toEqual(ActionType.START_BIDDING);
      expect(result.details.bid).toEqual(bid);
      expect(result.round).toEqual(expect.any(Number));
    });
  });
  describe('passAsync', () => {
    it('should create a pass action', async () => {
      // Arrange
      const actionService = new ActionService(application);

      // Act
      const result = await actionService.passAsync(mockGame, hostChef);

      // Assert
      expect(ActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: ActionType.PASS,
        details: {},
        round: expect.any(Number),
      });
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(hostChef._id);
      expect(result.userId).toEqual(hostUser._id);
      expect(result.type).toEqual(ActionType.PASS);
      expect(result.round).toEqual(expect.any(Number));
    });
  });
  describe('placeCardAsync', () => {
    it('should create a place card action', async () => {
      // Arrange
      const cardType = faker.helpers.enumValue(CardType);
      const position: number = faker.number.int({ min: 0, max: 4 });
      const actionService = new ActionService(application);

      // Act
      const result = await actionService.placeCardAsync(
        mockGame,
        hostChef,
        cardType,
        position,
      );

      // Assert
      expect(ActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: ActionType.PLACE_CARD,
        details: {
          cardType: cardType,
          position: position,
        },
        round: expect.any(Number),
      });
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(hostChef._id);
      expect(result.userId).toEqual(hostUser._id);
      expect(result.type).toEqual(ActionType.PLACE_CARD);
      expect(result.round).toEqual(expect.any(Number));
      expect(result.details.cardType).toEqual(cardType);
      expect(result.details.position).toEqual(position);
    });
  });
});
