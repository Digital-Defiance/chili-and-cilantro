import {
  ChefState,
  constants,
  GamePhase,
  IChef,
  IGameDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Model, Query } from 'mongoose';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { MockApplication } from '../fixtures/application';
import { generateChef } from '../fixtures/chef';
import { generateGame } from '../fixtures/game';
import { mockedWithTransactionAsync } from '../fixtures/with-transaction';

describe('GameService', () => {
  let application: IApplication;
  let gameService: GameService;
  let mockActionService: ActionService;
  let mockChefService: ChefService;
  let mockPlayerService: PlayerService;
  let mockGameModel: Model<IGameDocument>;

  beforeEach(() => {
    application = new MockApplication();
    mockGameModel = application.getModel<IGameDocument>(ModelName.Game);
    mockActionService = {
      expireGameAsync: jest.fn(),
    } as unknown as ActionService;
    mockChefService = {
      getGameChefsByGameOrIdAsync: jest.fn(),
    } as unknown as ChefService;
    mockPlayerService = {} as unknown as PlayerService;
    gameService = new GameService(
      application,
      mockActionService,
      mockChefService,
      mockPlayerService,
    );
  });
  describe('expireGamesOrThrowAsync', () => {
    it('should expire multiple games', async () => {
      // Create mock games
      const mockGames: Array<IGameDocument & { save: jest.Mock }> = [
        generateGame(true, { currentPhase: GamePhase.ROUND_START }),
        generateGame(true, { currentPhase: GamePhase.ROUND_START }),
      ];

      // Mock dependencies
      mockActionService.expireGameAsync = jest.fn();
      // mock getGameChefsByGameOrIdAsync to return an array of chefs and insert them into the map
      const mockChefs: Map<string, IChef & { save: jest.Mock }> = new Map();
      mockChefService.getGameChefsByGameOrIdAsync = jest
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
      expect(mockActionService.expireGameAsync).toHaveBeenCalledTimes(
        mockGames.length,
      );
    });

    it('should handle errors', async () => {
      // Create a mock game with a failing save method
      const mockGame = generateGame(true, {
        currentPhase: GamePhase.ROUND_START,
      });
      mockGame.save = jest.fn().mockRejectedValue(new Error('Save failed'));

      // Mock dependencies
      mockActionService.expireGameAsync = jest.fn();
      mockChefService.getGameChefsByGameOrIdAsync = jest
        .fn()
        .mockResolvedValue([]);

      // Call the method and expect an error
      await expect(async () =>
        gameService.expireGamesOrThrowAsync([mockGame]),
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
          1,
      ); // Subtracting an extra minute to ensure the date is old enough

      // Create mock old games
      const mockOldGames: IGameDocument[] = [
        generateGame(true, {
          currentPhase: GamePhase.ROUND_START,
          updatedAt: cutoffDate,
        }),
        generateGame(true, {
          currentPhase: GamePhase.ROUND_START,
          updatedAt: cutoffDate,
        }),
      ];

      // Mock GameModel.find to return the old games
      const findSpy = jest
        .spyOn(mockGameModel, 'find')
        .mockResolvedValue(mockOldGames);

      // Mock expireGamesOrThrowAsync
      const expireGamesOrThrowAsyncSpy: jest.SpyInstance = jest
        .spyOn(gameService, 'expireGamesOrThrowAsync')
        .mockResolvedValue(undefined);

      // Mock withTransaction
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);

      // Call the method
      await gameService.performExpireOldGamesAsync();

      // Assert that GameModel.find was called with the correct query
      expect(findSpy).toHaveBeenCalledWith({
        currentPhase: { $ne: GamePhase.GAME_OVER },
        lastModified: { $lt: expect.any(Date) },
      });

      // Assert that expireGamesOrThrowAsync was called with the found games
      expect(expireGamesOrThrowAsyncSpy).toHaveBeenCalledWith(mockOldGames);
    });

    it('should handle when there are no old games to expire due to error', async () => {
      // Mock GameModel.find to return an empty array
      jest.spyOn(mockGameModel, 'find').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(null),
            sort: jest.fn().mockReturnThis(),
          }) as unknown as Query<IGameDocument[], IGameDocument>,
      );

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
      expect(mockGameModel.find).toHaveBeenCalledWith({
        currentPhase: { $ne: GamePhase.GAME_OVER },
        lastModified: { $lt: expect.any(Date) },
      });

      // Assert that expireGamesOrThrowAsync was not called
      expect(gameService.expireGamesOrThrowAsync).not.toHaveBeenCalled();
    });

    it('should handle when there are no old games to expire', async () => {
      // Mock GameModel.find to return an empty array
      jest.spyOn(mockGameModel, 'find').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue([]),
            sort: jest.fn().mockReturnThis(),
          }) as unknown as Query<IGameDocument[], IGameDocument>,
      );

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
      expect(mockGameModel.find).toHaveBeenCalledWith({
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
      jest.spyOn(mockGameModel, 'find').mockImplementation(() => {
        throw mockError;
      });

      // Mock withTransaction
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);

      // Optionally, you can also mock expireGamesOrThrowAsync if you want to test error handling in that part
      // jest.spyOn(gameService, 'expireGamesOrThrowAsync').mockRejectedValue(mockError);

      // Expect that calling performExpireOldGamesAsync will throw the mock error
      await expect(async () =>
        gameService.performExpireOldGamesAsync(),
      ).rejects.toThrow(mockError);

      // Optionally, assert that expireGamesOrThrowAsync was not called
      // expect(gameService.expireGamesOrThrowAsync).not.toHaveBeenCalled();
    });
  });
});
