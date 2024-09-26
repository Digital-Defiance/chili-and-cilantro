import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import {
  constants,
  ChefState,
  GamePhase,
  IChef,
  IGame,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { mockedWithTransactionAsync } from '../fixtures/transactionManager';
import { InvalidGameError } from '../../src/errors/invalidGame';
import { generateGame } from '../fixtures/game';
import mongoose from 'mongoose';
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
    mockChefService = {};
    mockPlayerService = {};
    gameService = new GameService(
      mockGameModel,
      mockActionService,
      mockChefService,
      mockPlayerService
    );
  });
  describe('expireGamesOrThrowAsync', () => {
    it('should expire multiple games', async () => {
      // Create mock games
      const mockGames: Array<IGame & { save: jest.Mock }> = [
        generateGame(true, { currentPhase: GamePhase.ROUND_START }),
        generateGame(true, { currentPhase: GamePhase.ROUND_START }),
      ];

      // Mock dependencies
      gameService.actionService.expireGameAsync = jest.fn();
      // mock getGameChefsByGameOrIdAsync to return an array of chefs and insert them into the map
      const mockChefs: Map<string, IChef & { save: jest.Mock }> = new Map();
      gameService.chefService.getGameChefsByGameOrIdAsync = jest
        .fn()
        .mockImplementation(async (game) => {
          return Array.from({ length: constants.MIN_CHEFS }).map(() => {
            const chef = generateChef({ gameId: game._id });
            mockChefs.set(chef._id.toString(), chef);
            return chef;
          });
        });

      // Call the method
      await gameService.expireGamesOrThrowAsync(mockGames);

      // Assert that each game's currentPhase is set to GAME_OVER and save is called
      mockGames.forEach((mockGame) => {
        expect(mockGame.currentPhase).toBe(GamePhase.GAME_OVER);
        expect(mockGame.save).toHaveBeenCalled();
      });

      // assert that each chef's state is set to ChefState.EXPIRED and save is called
      mockChefs.forEach((mockChef) => {
        expect(mockChef.state).toBe(ChefState.EXPIRED);
        expect(mockChef.save).toHaveBeenCalled();
      });

      // Assert that actionService.expireGameAsync is called for each game
      expect(gameService.actionService.expireGameAsync).toHaveBeenCalledTimes(
        mockGames.length
      );
    });

    it('should handle errors', async () => {
      // Create a mock game with a failing save method
      const mockGame = generateGame(true, {
        currentPhase: GamePhase.ROUND_START,
      });
      mockGame.save = jest.fn().mockRejectedValue(new Error('Save failed'));

      // Mock dependencies
      gameService.actionService.expireGameAsync = jest.fn();
      gameService.chefService.getGameChefsByGameOrIdAsync = jest
        .fn()
        .mockResolvedValue([]);

      // Call the method and expect an error
      await expect(
        gameService.expireGamesOrThrowAsync([mockGame])
      ).rejects.toThrow('Save failed');

      // Assert that the save method was called
      expect(mockGame.save).toHaveBeenCalled();
    });
  });

  describe('performExpireOldGamesAsync', () => {
    it('should find and expire old games', async () => {
      // Calculate a date that is older than MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES
      const cutoffDate = new Date();
      cutoffDate.setMinutes(
        cutoffDate.getMinutes() -
          constants.MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES -
          1
      ); // Subtracting an extra minute to ensure the date is old enough

      // Create mock old games
      const mockOldGames = [
        generateGame(true, {
          currentPhase: GamePhase.ROUND_START,
          lastModified: cutoffDate,
        }),
        generateGame(true, {
          currentPhase: GamePhase.ROUND_START,
          lastModified: cutoffDate,
        }),
      ];

      // Mock GameModel.find to return the old games
      jest.spyOn(gameService.GameModel, 'find').mockResolvedValue(mockOldGames);

      // Mock expireGamesOrThrowAsync
      jest
        .spyOn(gameService, 'expireGamesOrThrowAsync')
        .mockResolvedValue(undefined);

      // Mock withTransaction
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);

      // Call the method
      await gameService.performExpireOldGamesAsync();

      // Assert that GameModel.find was called with the correct query
      expect(gameService.GameModel.find).toHaveBeenCalledWith({
        currentPhase: { $ne: GamePhase.GAME_OVER },
        lastModified: { $lt: expect.any(Date) },
      });

      // Assert that expireGamesOrThrowAsync was called with the found games
      expect(gameService.expireGamesOrThrowAsync).toHaveBeenCalledWith(
        mockOldGames
      );
    });

    it('should handle when there are no old games to expire due to error', async () => {
      // Mock GameModel.find to return an empty array
      jest.spyOn(gameService.GameModel, 'find').mockResolvedValue(null);

      // Mock expireGamesOrThrowAsync
      jest
        .spyOn(gameService, 'expireGamesOrThrowAsync')
        .mockResolvedValue(undefined);

      // Mock withTransaction
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);

      // Call the method
      await gameService.performExpireOldGamesAsync();

      // Assert that GameModel.find was called with the correct query
      expect(gameService.GameModel.find).toHaveBeenCalledWith({
        currentPhase: { $ne: GamePhase.GAME_OVER },
        lastModified: { $lt: expect.any(Date) },
      });

      // Assert that expireGamesOrThrowAsync was not called
      expect(gameService.expireGamesOrThrowAsync).not.toHaveBeenCalled();
    });

    it('should handle when there are no old games to expire', async () => {
      // Mock GameModel.find to return an empty array
      jest.spyOn(gameService.GameModel, 'find').mockResolvedValue([]);

      // Mock expireGamesOrThrowAsync
      jest
        .spyOn(gameService, 'expireGamesOrThrowAsync')
        .mockResolvedValue(undefined);

      // Mock withTransaction
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);

      // Call the method
      await gameService.performExpireOldGamesAsync();

      // Assert that GameModel.find was called with the correct query
      expect(gameService.GameModel.find).toHaveBeenCalledWith({
        currentPhase: { $ne: GamePhase.GAME_OVER },
        lastModified: { $lt: expect.any(Date) },
      });

      // Assert that expireGamesOrThrowAsync was not called
      expect(gameService.expireGamesOrThrowAsync).not.toHaveBeenCalled();
    });

    it('should handle errors during the expiring process', async () => {
      // Create a mock error
      const mockError = new Error('Test error');

      // Mock GameModel.find to return a promise that rejects with the mock error
      jest.spyOn(gameService.GameModel, 'find').mockRejectedValue(mockError);

      // Mock withTransaction
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);

      // Optionally, you can also mock expireGamesOrThrowAsync if you want to test error handling in that part
      // jest.spyOn(gameService, 'expireGamesOrThrowAsync').mockRejectedValue(mockError);

      // Expect that calling performExpireOldGamesAsync will throw the mock error
      await expect(gameService.performExpireOldGamesAsync()).rejects.toThrow(
        mockError
      );

      // Optionally, assert that expireGamesOrThrowAsync was not called
      // expect(gameService.expireGamesOrThrowAsync).not.toHaveBeenCalled();
    });
  });
});
