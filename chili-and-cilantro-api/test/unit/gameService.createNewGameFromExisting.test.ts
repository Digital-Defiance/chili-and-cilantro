import {
  GamePhase,
  IGame,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import sinon from 'sinon';
import { GameInProgressError } from '../../src/errors/game-in-progress';
import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import { generateChef } from '../fixtures/chef';
import { generateChefGameUser, generateGame } from '../fixtures/game';
import { generateObjectId } from '../fixtures/objectId';

describe('GameService', () => {
  describe('validateCreateNewGameFromExistingOrThrow', () => {
    let gameService;
    let existingGame;
    let gameModel;
    let gameId;
    let user;
    let chef;
    let actionService;
    let chefService;
    let playerService;

    beforeEach(() => {
      const database = new Database();
      gameModel = database.getModel<IGame>(ModelName.Game);
      actionService = {};
      chefService = {};
      playerService = {};
      gameService = new GameService(
        gameModel,
        actionService,
        chefService,
        playerService,
      );
      const generated = generateChefGameUser(true, 0, {
        game: { currentPhase: GamePhase.GAME_OVER },
      });
      gameId = generated.game._id;
      existingGame = generated.game;
      chef = generated.chef;
      user = generated.user;
    });

    it('should not throw an error if the game is in GAME_OVER phase', () => {
      expect(() => {
        gameService.validateCreateNewGameFromExistingOrThrow(existingGame);
      }).not.toThrow();
    });

    it('should throw a GameInProgressError if the game is not in GAME_OVER phase', () => {
      existingGame.currentPhase = GamePhase.SETUP;

      expect(() => {
        gameService.validateCreateNewGameFromExistingOrThrow(existingGame);
      }).toThrow(GameInProgressError);
    });
  });
  describe('createNewGameFromExistingAsync', () => {
    let gameId;
    let gameService;
    let mockChefService;
    let mockActionService;
    let mockPlayerService;
    let mockGameModel;
    let existingGame;
    let newGameId;
    let newGame;
    let user;
    let chef;
    let mockChefs;

    beforeEach(() => {
      newGameId = generateObjectId();
      const generated = generateChefGameUser(true, 2);
      gameId = generated.game._id;
      user = generated.user;
      chef = generated.chef;
      existingGame = generated.game;
      mockChefs = [chef, ...generated.additionalChefs];
      const newChef = generateChef({
        host: true,
        gameId: newGameId,
        userId: user._id,
      });
      mockChefService = {
        getGameChefsByGameOrIdAsync: jest.fn().mockResolvedValue(mockChefs),
        newChefFromExisting: jest.fn().mockResolvedValue(newChef),
      };
      mockActionService = { createGameAsync: jest.fn() };
      mockPlayerService = {};
      newGame = generateGame(true, {
        gameId: newGameId,
        hostUserId: user._id,
        hostChefId: newChef._id,
      });
      const database = new Database();
      mockGameModel = database.getModel<IGame>(ModelName.Game);
      mockGameModel.prototype.save = jest.fn().mockResolvedValue(newGame);
      gameService = new GameService(
        mockGameModel,
        mockActionService,
        mockChefService,
        mockPlayerService,
      );
    });

    it('should create a new game from an existing game', async () => {
      // Call the method
      const result = await gameService.createNewGameFromExistingAsync(
        existingGame,
        user,
      );

      // Assertions
      expect(mockChefService.getGameChefsByGameOrIdAsync).toHaveBeenCalledWith(
        existingGame,
      );
      expect(mockChefService.newChefFromExisting).toHaveBeenCalledTimes(
        existingGame.chefIds.length,
      );
      expect(mockGameModel.prototype.save).toHaveBeenCalled();
      expect(result).toHaveProperty('game');
      expect(result).toHaveProperty('chef');
    });
  });
  describe('performCreateNewGameFromExistingAsync', () => {
    let existingGameId,
      mockUser,
      mockExistingGame,
      mockNewGame,
      mockExistingChef,
      mockNewChef,
      gameService,
      actionService,
      chefService,
      playerService;
    beforeEach(() => {
      const database = new Database();
      const gameModel = database.getModel<IGame>(ModelName.Game);
      const generated = generateChefGameUser(true);
      mockExistingGame = generated.game;
      mockExistingChef = generated.chef;
      mockUser = generated.user;
      mockNewGame = generateGame();
      mockNewChef = generateChef({
        host: true,
        gameId: mockNewGame._id,
        userId: mockUser._id,
      });
      actionService = {};
      chefService = {};
      playerService = {};
      gameService = new GameService(
        gameModel,
        actionService,
        chefService,
        playerService,
      );
    });
    afterEach(() => {
      sinon.restore();
    });

    it('should be able to perform the create game from existing game actions within a transaction', async () => {
      // arrange
      sinon
        .stub(gameService, 'getGameByIdOrThrowAsync')
        .resolves(mockExistingGame);
      sinon
        .stub(gameService, 'withTransaction')
        .callsFake(mockedWithTransactionAsync);
      sinon
        .stub(gameService, 'validateCreateNewGameFromExistingOrThrow')
        .resolves();
      sinon
        .stub(gameService, 'createNewGameFromExistingAsync')
        .resolves({ game: mockNewGame, chef: mockNewChef });

      // act
      const result = await gameService.performCreateNewGameFromExistingAsync(
        existingGameId,
        mockUser,
      );

      // assert
      expect(result.game).toBe(mockNewGame);
      expect(result.chef).toBe(mockNewChef);
    });

    it('should throw an error if validation fails', async () => {
      // arrange
      sinon
        .stub(gameService, 'withTransaction')
        .callsFake(mockedWithTransactionAsync);
      sinon
        .stub(gameService, 'getGameByIdOrThrowAsync')
        .resolves(mockExistingGame);
      // Mock a validation failure
      sinon
        .stub(gameService, 'validateCreateNewGameFromExistingOrThrow')
        .throws(new Error('Validation failed'));

      // act/assert
      await expect(
        gameService.performCreateNewGameFromExistingAsync(
          existingGameId,
          mockUser,
        ),
      ).rejects.toThrow('Validation failed');
    });
  });
});
