import { Document, Model, Schema } from 'mongoose';
import { ActionService } from '../../src/services/action';
import { IDatabase } from '../../src/interfaces/database';
import { generateGame } from '../fixtures/game';
import { generateCreateGameAction } from '../fixtures/action';
import {
  IAction,
  IGame,
  IChef,
  IUser,
  ICreateGameAction,
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
      } as unknown as MockModel<IAction>;
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
        type: 'CREATE_GAME',
        details: {},
        round: -1,
      });
      expect(result.gameId).toEqual(mockCreateGameAction.gameId);
      expect(result.chefId).toEqual(mockCreateGameAction.chefId);
      expect(result.userId).toEqual(mockCreateGameAction.userId);
      expect(result.type).toEqual(mockCreateGameAction.type);
    });
  });
});
