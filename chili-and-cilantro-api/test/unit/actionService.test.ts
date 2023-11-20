import { Document, Model, Schema } from 'mongoose';
import { ActionService } from '../../src/services/action';
import { IDatabase } from '../../src/interfaces/database';
import { generateGame } from '../fixtures/game';
import { generateCreateGameAction, generateJoinGameAction, generateStartGameAction } from '../fixtures/action';
import {
  IAction,
  IGame,
  IChef,
  IUser,
  IJoinGameAction,
  Action,
  ICreateGameAction,
  IStartGameAction,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { generateUser } from '../fixtures/user';
import { generateChef } from '../fixtures/chef';

type MockModel<T = any> = Model<T> & jest.Mocked<Model<T>> & {
  sort: jest.Mock;
};

describe('ActionService', () => {
  let gameId: Schema.Types.ObjectId;
  let mockGame: IGame;
  let hostChef: IChef;
  let hostUser: IUser;

  beforeEach(() => {
    gameId = new Schema.Types.ObjectId('aaaaaaaaaaaa');
    hostUser = generateUser();
    hostChef = generateChef(true, gameId, hostUser._id);
    mockGame = generateGame(gameId, hostUser._id, hostChef._id, true);
  });

  describe('getGameHistoryAsync', () => {
    it('should retrieve game history', async () => {
      // Arrange
      const mockActions = [generateCreateGameAction(gameId, hostChef._id, hostUser._id)];

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
      const mockCreateGameAction = generateCreateGameAction(gameId, hostChef._id, hostUser._id);
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
      mockActionModel.create.mockResolvedValue(mockCreateGameActionDocument as any);

      const mockDatabase = {
        getModel: jest.fn().mockReturnValue(mockActionModel),
        getActionModel: jest.fn().mockReturnValue(mockActionModel),
      } as unknown as IDatabase;

      const actionService = new ActionService(mockDatabase);

      const result = await actionService.createGameAsync(mockGame, hostChef, hostUser);

      expect(mockActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: Action.CREATE_GAME,
        details: {},
        round: -1,
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
      const mockJoinGameAction = generateJoinGameAction(gameId, hostChef._id, hostUser._id);
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
      const result = await actionService.joinGameAsync(mockGame, hostChef, hostUser);

      // Assert
      expect(mockActionModel.create).toHaveBeenCalledWith({
        gameId: gameId,
        chefId: hostChef._id,
        userId: hostUser._id,
        type: Action.JOIN_GAME,
        details: {},
        round: -1,
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
      const mockStartGameAction = generateStartGameAction(gameId, hostChef._id, hostUser._id);
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
        round: -1,
      });
      expect(result.gameId).toEqual(mockStartGameAction.gameId);
      expect(result.chefId).toEqual(mockStartGameAction.chefId);
      expect(result.userId).toEqual(mockStartGameAction.userId);
      expect(result.type).toEqual(mockStartGameAction.type);
    });
  });
});
