import {
  GamePhase,
  IGame,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { GameInProgressError } from '../../src/errors/game-in-progress';
import { NotEnoughChefsError } from '../../src/errors/not-enough-chefs';
import { NotHostError } from '../../src/errors/not-host';
import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import { generateStartGameAction } from '../fixtures/action';
import { generateChefGameUser } from '../fixtures/game';
import { generateObjectId } from '../fixtures/objectId';
import { mockedWithTransactionAsync } from '../fixtures/transactionManager';

describe('gameService startGame', () => {
  describe('performStartGameAsync', () => {
    let gameModel,
      gameService,
      gameId,
      game,
      chef,
      user,
      userId,
      gameCode,
      mockActionService,
      mockChefService,
      mockPlayerService;

    beforeEach(() => {
      const database = new Database();
      gameModel = database.getModel<IGame>(ModelName.Game);
      mockActionService = {};
      mockPlayerService = {};
      mockChefService = {};
      gameService = new GameService(
        gameModel,
        mockActionService,
        mockChefService,
        mockPlayerService,
      );
      gameId = generateObjectId();
      const generated = generateChefGameUser(true);
      user = generated.user;
      chef = generated.chef;
      game = generated.game;
      userId = user._id;
      gameCode = game.code;
    });

    it('should start the game successfully', async () => {
      const startGameAction = generateStartGameAction(
        gameId,
        chef._id,
        user._id,
      );
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);
      jest
        .spyOn(gameService, 'getGameByCodeOrThrowAsync')
        .mockResolvedValue(game);
      jest
        .spyOn(gameService, 'validateStartGameOrThrowAsync')
        .mockResolvedValue(undefined);
      jest
        .spyOn(gameService, 'startGameAsync')
        .mockResolvedValue({ game, action: startGameAction });

      const result = await gameService.performStartGameAsync(gameCode, userId);

      expect(result.game).toBe(game);
      expect(gameService.getGameByCodeOrThrowAsync).toHaveBeenCalledWith(
        gameCode,
        true,
      );
      expect(gameService.validateStartGameOrThrowAsync).toHaveBeenCalledWith(
        game,
        userId,
      );
      expect(gameService.startGameAsync).toHaveBeenCalledWith(game);
    });

    it('should throw an error if validation fails', async () => {
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);
      jest
        .spyOn(gameService, 'getGameByCodeOrThrowAsync')
        .mockResolvedValue(game);
      jest
        .spyOn(gameService, 'validateStartGameOrThrowAsync')
        .mockRejectedValue(new Error('Validation failed'));

      await expect(
        gameService.performStartGameAsync(gameCode, userId),
      ).rejects.toThrow('Validation failed');
    });
  });
  describe('validateStartGameOrThrowAsync', () => {
    let gameModel,
      gameService,
      gameId,
      game,
      chef,
      user,
      additionalChefs,
      userId,
      gameCode,
      mockActionService,
      mockChefService,
      mockPlayerService;

    beforeEach(() => {
      const database = new Database();
      gameModel = database.getModel<IGame>(ModelName.Game);
      mockActionService = {};
      mockPlayerService = {
        isGameHostAsync: jest.fn().mockResolvedValue(true),
      };
      mockChefService = {};
      gameService = new GameService(
        gameModel,
        mockActionService,
        mockChefService,
        mockPlayerService,
      );
      gameId = generateObjectId();
      const generated = generateChefGameUser(true, 2);
      user = generated.user;
      chef = generated.chef;
      game = generated.game;
      additionalChefs = generated.additionalChefs;
      userId = user._id;
      gameCode = game.code;
    });
    it('should validate successfully for a valid game start', async () => {
      game.currentPhase = GamePhase.LOBBY;

      await expect(
        gameService.validateStartGameOrThrowAsync(game, userId),
      ).resolves.not.toThrow();
    });
    it('should throw if the user is not the host', async () => {
      mockPlayerService.isGameHostAsync.mockResolvedValueOnce(false);

      await expect(
        gameService.validateStartGameOrThrowAsync(game, userId),
      ).rejects.toThrow(NotHostError);
    });
    it('should throw if the game phase is not LOBBY', async () => {
      game.currentPhase = GamePhase.SETUP;

      await expect(
        gameService.validateStartGameOrThrowAsync(game, userId),
      ).rejects.toThrow(GameInProgressError);
    });
    it('should throw if there are not enough chefs', async () => {
      game.chefIds = [chef._id];

      await expect(
        gameService.validateStartGameOrThrowAsync(game, userId),
      ).rejects.toThrow(NotEnoughChefsError);
    });
  });
  describe('startGameAsync', () => {
    let gameModel,
      gameService,
      gameId,
      game,
      chef,
      user,
      userId,
      gameCode,
      mockActionService,
      mockChefService,
      mockPlayerService;

    beforeEach(() => {
      const database = new Database();
      gameModel = database.getModel<IGame>(ModelName.Game);
      const {
        user: mockUser,
        chef: mockChef,
        game: mockGame,
        additionalChefs,
      } = generateChefGameUser(true, 2, { game: { save: jest.fn() } });
      user = mockUser;
      chef = mockChef;
      game = mockGame;
      gameId = game._id;
      mockActionService = {
        startGameAsync: jest
          .fn()
          .mockResolvedValue(
            generateStartGameAction(gameId, chef._id, user._id),
          ),
      };
      mockPlayerService = {};
      mockChefService = {
        getGameChefsByGameOrIdAsync: jest
          .fn()
          .mockResolvedValue([chef, ...additionalChefs]),
      };
      gameService = new GameService(
        gameModel,
        mockActionService,
        mockChefService,
        mockPlayerService,
      );
      userId = user._id;
      gameCode = game.code;
    });

    it('should start the game', async () => {
      const result = await gameService.startGameAsync(game);

      expect(result.game).toBe(game);
      expect(game.currentPhase).toBe(GamePhase.SETUP);
      expect(game.save).toHaveBeenCalled();
      expect(gameService.actionService.startGameAsync).toHaveBeenCalledWith(
        game,
      );
    });
  });
});
