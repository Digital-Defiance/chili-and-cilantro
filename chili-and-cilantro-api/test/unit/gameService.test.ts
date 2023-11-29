import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import { GamePhase, IGame, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { InvalidGameError } from '../../src/errors/invalidGame';
import { generateGame } from '../fixtures/game';
import mongoose from 'mongoose';

describe('GameService', () => {
  describe("getGameByIdOrThrowAsync", () => {
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
});