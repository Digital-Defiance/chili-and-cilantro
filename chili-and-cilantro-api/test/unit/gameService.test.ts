import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import { GamePhase, IGame, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { InvalidGameError } from '../../src/errors/invalidGame';
import { generateGame } from '../fixtures/game';
import mongoose from 'mongoose';
import { generateObjectId } from '../fixtures/objectId';
import { generateChef } from '../fixtures/chef';

describe('GameService', () => {
  let gameService;
  let mockActionService;
  let mockChefService;
  let mockPlayerService;
  let mockGameModel;

  beforeEach(() => {
    const database = new Database();
    mockGameModel = database.getModel<IGame>(ModelName.Game);
    mockActionService = {};
    mockChefService = {
      getGameChefsByGameOrIdAsync: jest.fn(),
    };
    mockPlayerService = {};
    gameService = new GameService(mockGameModel, mockActionService, mockChefService, mockPlayerService);
  });
  describe("getGameByIdOrThrowAsync", () => {
    it('should return a game when found', async () => {
      const mockGame = generateGame(true);
      jest.spyOn(mockGameModel, 'findOne').mockResolvedValue(mockGame);

      const gameId = new mongoose.Types.ObjectId().toString();
      const result = await gameService.getGameByIdOrThrowAsync(gameId);

      expect(result).toBe(mockGame);
      expect(mockGameModel.findOne).toHaveBeenCalledWith({ _id: new mongoose.Types.ObjectId(gameId) });
    });

    it('should throw InvalidGameError when game is not found', async () => {
      mockGameModel.findOne.mockResolvedValue(null);

      const gameId = new mongoose.Types.ObjectId().toString();

      await expect(gameService.getGameByIdOrThrowAsync(gameId)).rejects.toThrow(InvalidGameError);
    });

    it('should search for active games when active parameter is true', async () => {
      const mockGame = generateGame(true);
      jest.spyOn(mockGameModel, 'findOne').mockResolvedValue(mockGame);

      const gameId = new mongoose.Types.ObjectId().toString();
      await gameService.getGameByIdOrThrowAsync(gameId, true);

      expect(mockGameModel.findOne).toHaveBeenCalledWith({
        _id: new mongoose.Types.ObjectId(gameId),
        currentPhase: { $ne: GamePhase.GAME_OVER },
      });
    });
  });
  describe('getGameByCodeOrThrowAsync', () => {
    it('should return the most recent game when found by code', async () => {
      const mockGame = generateGame(true);
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGame]),
      };
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = mockGame.code;
      const result = await gameService.getGameByCodeOrThrowAsync(gameCode);

      expect(result).toBe(mockGame);
      expect(mockGameModel.find).toHaveBeenCalledWith({ code: gameCode });
      expect(mockQuery.exec).toHaveBeenCalled();
    });
    it('should throw InvalidGameError when no game is found, returning null', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = 'testCode';

      await expect(gameService.getGameByCodeOrThrowAsync(gameCode)).rejects.toThrow(InvalidGameError);
    });
    it('should throw InvalidGameError when no game is found, returning empty array', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = 'testCode';

      await expect(gameService.getGameByCodeOrThrowAsync(gameCode)).rejects.toThrow(InvalidGameError);
    });
    it('should search for active games when active parameter is true', async () => {
      const mockGame = generateGame(true);
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGame]),
      };
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = mockGame.code;
      await gameService.getGameByCodeOrThrowAsync(gameCode, true);

      expect(mockGameModel.find).toHaveBeenCalledWith({
        code: gameCode,
        currentPhase: { $ne: GamePhase.GAME_OVER },
      });
      expect(mockQuery.exec).toHaveBeenCalled();
    });
    it('should return the most recent game when multiple games are found', async () => {
      const gameOne = generateGame(true);
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([gameOne]),
      };
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const result = await gameService.getGameByCodeOrThrowAsync(gameOne.code);

      expect(result).toBe(gameOne);
      expect(mockQuery.exec).toHaveBeenCalled();
    });
  });
  describe('getGameChefNamesByGameIdAsync ', () => {
    it('should return chef names when chefs are found for the game', async () => {
      // Arrange
      const gameId = generateObjectId().toString();
      const mockChefs = [
        { name: 'Chef A' },
        { name: 'Chef B' }
      ];
      mockChefService.getGameChefsByGameOrIdAsync.mockResolvedValue(mockChefs);

      // Act
      const result = await gameService.getGameChefNamesByGameIdAsync(gameId);

      // Assert
      expect(result).toEqual(['Chef A', 'Chef B']);
      expect(mockChefService.getGameChefsByGameOrIdAsync).toHaveBeenCalledWith(gameId);
    });

    it('should return an empty array when no chefs are found for the game', async () => {
      // Arrange
      const gameId = generateObjectId().toString();
      mockChefService.getGameChefsByGameOrIdAsync.mockResolvedValue([]);

      // Act
      const result = await gameService.getGameChefNamesByGameIdAsync(gameId);

      // Assert
      expect(result).toEqual([]);
      expect(mockChefService.getGameChefsByGameOrIdAsync).toHaveBeenCalledWith(gameId);
    });
  });
  describe('canBid', () => {
    it('should return false if the current phase is not SETUP or BIDDING', () => {
      const chef = generateChef();
      const game = generateGame(true, { turnOrder: [chef._id], currentChef: 0, cardsPlaced: 1, currentBid: 0 });
      expect(gameService.canBid(game, chef)).toBe(false);
    });

    it('should return false if the current chef is not the user', () => {
      const chef = generateChef();
      const game = generateGame(true, { currentPhase: GamePhase.BIDDING, turnOrder: [chef._id], currentChef: 0, cardsPlaced: 1, currentBid: 0 });
      expect(gameService.canBid(game, chef)).toBe(false);
    });

    it('should return false if no cards are placed yet', () => {
      const chef = generateChef();
      const game = generateGame(true, { currentPhase: GamePhase.BIDDING, turnOrder: [chef._id], currentChef: 0, cardsPlaced: 0, currentBid: 0 });
      expect(gameService.canBid(game, chef)).toBe(false);
    });

    it('should return false if the minimum bid is more than the number of cards placed', () => {
      const chef = generateChef();
      const game = generateGame(true, { currentPhase: GamePhase.BIDDING, turnOrder: [chef._id], currentChef: 0, cardsPlaced: 1, currentBid: 2 });
      expect(gameService.canBid(game, chef)).toBe(false);
    });

    it('should return true when the chef can bid', () => {
      const chef = generateChef();
      const game = { currentPhase: GamePhase.BIDDING, turnOrder: [chef._id], currentChef: 0, cardsPlaced: 3, currentBid: 1 };
      expect(gameService.canBid(game, chef)).toBe(true);
    });
  });
});