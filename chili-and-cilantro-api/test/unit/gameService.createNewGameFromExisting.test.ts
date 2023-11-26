import { Schema } from 'mongoose';
import sinon from 'sinon';
import { GameService } from '../../src/services/game';
import { Database } from '../../src/services/database';
import { generateGame } from '../fixtures/game';
import { generateUser } from '../fixtures/user';
import { generateChef } from '../fixtures/chef';
import { mockedWithTransactionAsync } from '../fixtures/transactionManager';
import { IGame, ModelName, GamePhase } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { GameInProgressError } from '../../src/errors/gameInProgress';

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
      gameService = new GameService(gameModel, actionService, chefService, playerService);
      gameId = new Schema.Types.ObjectId('aaaaaaaaaaa');
      user = generateUser();
      chef = generateChef(true, gameId, user._id);
      existingGame = generateGame(gameId, user._id, chef._id, true, { currentPhase: GamePhase.GAME_OVER });
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
      gameId = new Schema.Types.ObjectId('aaaaaaaaaaa');
      newGameId = new Schema.Types.ObjectId('bbbbbbbbbbb');
      user = generateUser();
      chef = generateChef(true, gameId, user._id);
      mockChefs = [
        chef,
        generateChef(false, gameId),
        generateChef(false, gameId),
      ];
      existingGame = generateGame(gameId, user._id, chef._id, true, { chefIds: mockChefs.map((c) => c._id) });
      const newChef = generateChef(true, gameId, user._id);
      mockChefService = {
        getGameChefsByGameAsync: jest.fn().mockResolvedValue(mockChefs),
        newChefFromExisting: jest.fn().mockResolvedValue(newChef)
      };
      mockActionService = { createGameAsync: jest.fn() };
      mockPlayerService = {};
      newGame = generateGame(newGameId, user._id, newChef._id, true);
      const database = new Database();
      mockGameModel = database.getModel<IGame>(ModelName.Game);
      mockGameModel.prototype.save = jest.fn().mockResolvedValue(newGame);
      gameService = new GameService(mockGameModel, mockActionService, mockChefService, mockPlayerService);
    });

    it('should create a new game from an existing game', async () => {
      // Call the method
      const result = await gameService.createNewGameFromExistingAsync(existingGame, user);

      // Assertions
      expect(mockChefService.getGameChefsByGameAsync).toHaveBeenCalledWith(existingGame);
      expect(mockChefService.newChefFromExisting).toHaveBeenCalledTimes(existingGame.chefIds.length);
      expect(mockGameModel.prototype.save).toHaveBeenCalled();
      expect(result).toHaveProperty('game');
      expect(result).toHaveProperty('chef');
    });
  });
  describe('performCreateNewGameFromExistingAsync', () => {
    let existingGameId, mockUser, mockExistingGame, mockNewGame, mockChef, gameService, actionService, chefService, playerService;
    beforeEach(() => {
      const database = new Database();
      const gameModel = database.getModel<IGame>(ModelName.Game);
      existingGameId = new Schema.Types.ObjectId('bbbbbbbbbbbb');
      mockUser = generateUser();
      mockChef = generateChef(true, existingGameId, mockUser._id);
      mockExistingGame = generateGame(existingGameId, mockUser._id, mockChef._id, true);
      mockNewGame = generateGame(new Schema.Types.ObjectId('cccccccccccc'), mockUser._id, mockChef._id, true);
      actionService = {};
      chefService = {};
      playerService = {};
      gameService = new GameService(gameModel, actionService, chefService, playerService);
    });
    afterEach(() => {
      sinon.restore();
    });

    it('should be able to perform the create game from existing game actions within a transaction', async () => {
      // arrange
      sinon.stub(gameService, 'getGameByIdOrThrowAsync').resolves(mockExistingGame);
      sinon.stub(gameService, 'withTransaction').callsFake(mockedWithTransactionAsync);
      sinon.stub(gameService, 'validateCreateNewGameFromExistingOrThrow').resolves();
      sinon.stub(gameService, 'createNewGameFromExistingAsync').resolves({ game: mockNewGame, chef: mockChef });

      // act
      const result = await gameService.performCreateNewGameFromExistingAsync(existingGameId, mockUser);

      // assert
      expect(result.game).toBe(mockNewGame);
      expect(result.chef).toBe(mockChef);
    });

    it('should throw an error if validation fails', async () => {
      // arrange
      sinon.stub(gameService, 'withTransaction').callsFake(mockedWithTransactionAsync);
      sinon.stub(gameService, 'getGameByIdOrThrowAsync').resolves(mockExistingGame);
      // Mock a validation failure
      sinon.stub(gameService, 'validateCreateNewGameFromExistingOrThrow').throws(new Error('Validation failed'));

      // act/assert
      await expect(gameService.performCreateNewGameFromExistingAsync(existingGameId, mockUser))
        .rejects.toThrow('Validation failed');
    });
  });
});