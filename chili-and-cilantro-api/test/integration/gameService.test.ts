import { createServer } from 'http';
import { MockJwksClient } from '../fixtures/jwksClient';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';
import { BaseModel, IGame, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';

import { GameService } from '../../src/services/gameService';
import { Database } from '../../src/services/database';
import { createUser } from '../fixtures/user';
import { MockDatabase } from '../fixtures/database';
import { getRandomFirstChef } from '../fixtures/firstChef';

// Mock the dependencies (use jest.mock for external modules)
jest.mock('../../src/services/Database'); // Mock Database

describe('GameService', () => {
  let gameService: GameService;
  let httpServer;
  let ioServer;
  let jwksClient;
  const GameModel = BaseModel.getModel<IGame>(ModelName.Game);

  beforeAll((done) => {
    jwksClient = new MockJwksClient();
  });

  beforeEach(() => {
    const database = new MockDatabase();
    gameService = new GameService(database);
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('userIsInActiveGame', () => {
    it('returns false when the user is not in an active game', async () => {
      // Spy on the aggregate function and mock its implementation to return an empty array
      jest.spyOn(GameModel, 'aggregate').mockResolvedValue([]);

      const userId = new Types.ObjectId().toString();
      const result = await gameService.userIsInActiveGameAsync(userId);

      expect(result).toBe(false);
      expect(GameModel.aggregate).toHaveBeenCalledTimes(1);
    });

    it('returns true when the user is in an active game', async () => {
      // Spy on the aggregate function and mock its implementation to return a count
      jest.spyOn(GameModel, 'aggregate').mockResolvedValue([{ activeGamesCount: 1 }]);

      const userId = new Types.ObjectId().toString();
      const result = await gameService.userIsInActiveGameAsync(userId);

      expect(result).toBe(true);
      expect(GameModel.aggregate).toHaveBeenCalledTimes(1);
    });
  });

  describe('createGame', () => {
    it('should create a game and chef successfully', async () => {
      const mockCreateGame = jest.fn();
      const mockCreateChef = jest.fn();
      const mockCreateAction = jest.fn();

      // Mock the expected behavior of the methods
      mockCreateGame.mockResolvedValue({ _id: 'gameId' });
      mockCreateChef.mockResolvedValue({ _id: 'chefId' });
      mockCreateAction.mockResolvedValue({ _id: 'actionId' });

      // Replace the actual methods with the mocked ones
      gameService['GameModel'].create = mockCreateGame;
      gameService['ChefModel'].create = mockCreateChef;
      gameService['ActionModel'].create = mockCreateAction;

      const user = createUser();
      const userName = 'TestUser';
      const gameName = 'TestGame';
      const password = 'testpassword';
      const maxChefs = 4;
      const firstChef = getRandomFirstChef();

      const result = await gameService.createGameAsync(user, userName, gameName, password, maxChefs, firstChef);

      // Assertions
      expect(result).toEqual(expect.objectContaining({ game: expect.any(Object), chef: expect.any(Object) }));
      expect(mockCreateGame).toHaveBeenCalledWith(expect.objectContaining({
        _id: expect.any(String),
        name: gameName,
        password,
        maxChefs,
        currentPhase: expect.any(String),
        currentChef: -1,
        firstChef,
        chefIds: expect.any(Array),
        hostChefId: expect.any(String),
        hostUserId: user._id,
      }));
      expect(mockCreateChef).toHaveBeenCalledWith(expect.objectContaining({
        _id: expect.any(String),
        gameId: 'gameId',
        userId: user._id,
        state: expect.any(String),
        host: true,
      }));
      expect(mockCreateAction).toHaveBeenCalledWith(expect.objectContaining({
        chef: 'chefId',
        type: expect.any(String),
        details: {},
      }));
    });

    // Add more test cases to cover error scenarios and edge cases
  });

  describe('joinGame', () => {
    it('should join a game successfully', async () => {
      const mockFindOne = jest.fn();
      const mockCreateChef = jest.fn();
      const mockCreateAction = jest.fn();
      const mockSave = jest.fn();

      // Mock the expected behavior of the methods
      mockFindOne.mockResolvedValue({
        _id: 'gameId',
        code: 'ABC123',
        currentPhase: 'LOBBY',
        password: 'password',
        chefIds: ['hostChefId'],
        maxChefs: 4,
      });
      mockCreateChef.mockResolvedValue({ _id: 'chefId' });
      mockCreateAction.mockResolvedValue({ _id: 'actionId' });
      mockSave.mockResolvedValue({ _id: 'gameId' });

      // Replace the actual methods with the mocked ones
      gameService['GameModel'].findOne = mockFindOne;
      gameService['ChefModel'].create = mockCreateChef;
      gameService['ActionModel'].create = mockCreateAction;
      gameService['GameModel'].prototype.save = mockSave;

      const gameCode = 'ABC123';
      const password = 'password';
      const user = createUser();
      const userName = 'TestUser';

      const result = await gameService.joinGameAsync(gameCode, password, user, userName);

      // Assertions
      expect(result).toEqual(expect.objectContaining({ game: expect.any(Object), chef: expect.any(Object) }));
      expect(mockFindOne).toHaveBeenCalledWith(expect.objectContaining({ code: gameCode, currentPhase: expect.any(String) }));
      expect(mockCreateChef).toHaveBeenCalledWith(expect.objectContaining({
        gameId: 'gameId',
        userId: user._id,
        state: expect.any(String),
        host: false,
      }));
      expect(mockCreateAction).toHaveBeenCalledWith(expect.objectContaining({
        chef: 'chefId',
        type: expect.any(String),
        details: {},
      }));
      expect(mockSave).toHaveBeenCalled();
    });

    // Add more test cases to cover error scenarios and edge cases
  });

  // Add more describe blocks for testing other methods
});
