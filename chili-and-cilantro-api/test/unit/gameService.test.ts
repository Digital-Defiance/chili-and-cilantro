import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import { GamePhase, IGame, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { InvalidGameError } from '../../src/errors/invalidGame';
import { generateGame } from '../fixtures/game';
import mongoose from 'mongoose';

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
      const findMock = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            then: jest.fn().mockResolvedValue(mockGame),
          }),
        }),
      });
      jest.spyOn(mockGameModel, 'find').mockImplementation(findMock);

      const gameCode = 'testCode';
      const result = await gameService.getGameByCodeOrThrowAsync(gameCode);

      expect(result).toBe(mockGame);
      expect(mockGameModel.find).toHaveBeenCalledWith({ code: gameCode });
    });
    it('should throw InvalidGameError when no game is found', async () => {
      const findMock = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            then: jest.fn().mockResolvedValue(null),
          }),
        }),
      });
      jest.spyOn(mockGameModel, 'find').mockImplementation(findMock);

      const gameCode = 'testCode';

      await expect(gameService.getGameByCodeOrThrowAsync(gameCode)).rejects.toThrow(InvalidGameError);
    });
    it('should search for active games when active parameter is true', async () => {
      const mockGame = generateGame(true);
      const findMock = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            then: jest.fn().mockResolvedValue(mockGame),
          }),
        }),
      });
      jest.spyOn(mockGameModel, 'find').mockImplementation(findMock);

      const gameCode = 'testCode';
      await gameService.getGameByCodeOrThrowAsync(gameCode, true);

      expect(mockGameModel.find).toHaveBeenCalledWith({
        code: gameCode,
        currentPhase: { $ne: GamePhase.GAME_OVER },
      });
    });
  });
});