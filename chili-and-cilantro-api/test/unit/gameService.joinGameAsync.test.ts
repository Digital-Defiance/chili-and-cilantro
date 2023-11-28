import { Schema } from 'mongoose';
import sinon from 'sinon';
import { Database } from '../../src/services/database';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { constants, IGame, ModelName, IChef, GamePhase } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { AlreadyJoinedOtherError } from '../../src/errors/alreadyJoinedOther';
import { InvalidUserNameError } from '../../src/errors/invalidUserName';
import { generateUser } from '../fixtures/user';
import { generateString } from '../fixtures/utils';
import { generateChef } from '../fixtures/chef';
import { generateChefGameUser, generateGame } from '../fixtures/game';
import { generateObjectId } from '../fixtures/objectId';
import { mockedWithTransactionAsync } from '../fixtures/transactionManager';
import { UtilityService } from '../../src/services/utility';
import { GameFullError } from '../../src/errors/gameFull';
import { faker } from '@faker-js/faker';
import { GamePasswordMismatchError } from '../../src/errors/gamePasswordMismatch';
import { UsernameInUseError } from '../../src/errors/usernameInUse';
import { GameInProgressError } from '../../src/errors/gameInProgress';

describe('GameService', () => {
  let chefModel;
  let gameModel;
  let gameService;

  beforeAll(() => {
    const database = new Database();
    chefModel = database.getModel<IChef>(ModelName.Chef);
    gameModel = database.getModel<IGame>(ModelName.Game);
    const actionService = new ActionService(database);
    const chefService = new ChefService(chefModel);
    const playerService = new PlayerService(gameModel);
    gameService = new GameService(gameModel, actionService, chefService, playerService);
  });

  describe('validateJoinGameOrThrowAsync', () => {
    let gameId, game, chef, user, userName;

    beforeEach(() => {
      // Setup initial valid parameters
      gameId = generateObjectId();
      const generated = generateChefGameUser(true);
      user = generated.user;
      chef = generated.chef;
      game = generated.game;
      userName = generateString(constants.MIN_USER_NAME_LENGTH, constants.MAX_USER_NAME_LENGTH);
    });

    afterEach(() => {
      sinon.restore();
      // Restore the stub to its original method after each test
      if (gameService.playerService.userIsInAnyActiveGameAsync.restore) {
        gameService.playerService.userIsInAnyActiveGameAsync.restore();
      }
    });

    it('should not throw an error when all parameters are valid', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesAsync').resolves([chef.name]);

      // act/assert
      await expect(gameService.validateJoinGameOrThrowAsync(game, user, userName, game.password))
        .resolves.not.toThrow();
    });

    it('throws an error if user is already in an active game', async () => {
      // arrange
      // Mock the condition where user is in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(true);
      sinon.stub(gameService, 'getGameChefNamesAsync').resolves([chef.name]);

      // act/assert
      await expect(gameService.validateJoinGameOrThrowAsync(game, user, userName, game.password))
        .rejects.toThrow(AlreadyJoinedOtherError);
    });
    it('should throw an error when the chef name is already in the specified game', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesAsync').resolves([chef.name]);

      // act/assert
      await expect(gameService.validateJoinGameOrThrowAsync(game, user, chef.name, game.password))
        .rejects.toThrow(UsernameInUseError);
    });
    it('should throw an error when the game is already in progress', () => {
      // arrange
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesAsync').resolves([chef.name]);
      game = generateGame(true, { gameId, hostUserId: user._id, hostChefId: chef._id, currentPhase: GamePhase.SETUP });

      // act/assert
      expect(gameService.validateJoinGameOrThrowAsync(game, user, userName, game.password))
        .rejects.toThrow(GameInProgressError);
    });
    it('should throw an error for an invalid username with special characters', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesAsync').resolves([chef.name]);

      userName = '!'.repeat(constants.MIN_USER_NAME_LENGTH + 1); // Set an invalid username with special characters

      // act/assert
      await expect(gameService.validateJoinGameOrThrowAsync(game, user, userName, game.password))
        .rejects.toThrow(InvalidUserNameError);
    });

    it('should throw an error for invalid username that is too short', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesAsync').resolves([chef.name]);

      userName = 'x'.repeat(constants.MIN_USER_NAME_LENGTH - 1); // Set an invalid username that is too short

      // act/assert
      await expect(gameService.validateJoinGameOrThrowAsync(game, user, userName, game.password))
        .rejects.toThrow(InvalidUserNameError);
    });

    it('should throw an error for invalid username that is too long', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesAsync').resolves([chef.name]);

      userName = 'x'.repeat(constants.MAX_USER_NAME_LENGTH + 1); // Set an invalid username that is too long

      // act/assert
      await expect(gameService.validateJoinGameOrThrowAsync(game, user, userName, game.password))
        .rejects.toThrow(InvalidUserNameError);
    });

    it('should throw an error for incorrect password', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesAsync').resolves([chef.name]);

      // act/assert
      await expect(gameService.validateJoinGameOrThrowAsync(game, user, userName, 'xxxx'))
        .rejects.toThrow(GamePasswordMismatchError);
    });

    it('should throw an error to too many chefs', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesAsync').resolves([chef.name]);

      for (let i = 1; i <= constants.MAX_CHEFS; i++) {
        game.chefIds.push(generateObjectId());
      }
      // act/assert
      await expect(gameService.validateJoinGameOrThrowAsync(game, user, userName, game.password))
        .rejects.toThrow(GameFullError);
    });
  });

  describe('joinGameAsync', () => {
    let gameService;
    let mockChefService;
    let mockActionService;
    let mockPlayerService;
    let gameId;
    let chef;
    let game;
    let user;
    let userName;

    beforeEach(() => {
      const database = new Database();
      gameModel = database.getModel<IGame>(ModelName.Game);
      mockChefService = { newChefAsync: jest.fn() };
      mockActionService = { joinGameAsync: jest.fn() };
      mockPlayerService = {};
      gameService = new GameService(gameModel, mockActionService, mockChefService, mockPlayerService);
      gameId = generateObjectId();
      const generated = generateChefGameUser(true);
      user = generated.user;
      chef = generated.chef;
      game = generated.game;
      userName = "testUser";
    });

    it('should successfully join a game', async () => {
      // Setup mocks
      const mockChef = generateChef({ host: false, gameId, userId: user._id });
      mockChefService.newChefAsync.mockResolvedValue(mockChef);
      game.save = jest.fn().mockResolvedValue(game);

      // Call the method
      const result = await gameService.joinGameAsync(game, user, userName);

      // Assertions
      expect(mockChefService.newChefAsync).toHaveBeenCalledWith(game, user, userName, false);
      expect(mockActionService.joinGameAsync).toHaveBeenCalledWith(game, mockChef, user);
      expect(game.chefIds).toContain(mockChef._id);
      expect(game.save).toHaveBeenCalled();
      expect(result).toEqual({ game, chef: mockChef });
    });
  });
  describe('performJoinGameAsync', () => {
    let gameId, mockChef, mockGame, mockUser, userName;
    beforeEach(() => {
      gameId = generateObjectId();
      const generated = generateChefGameUser(true);
      mockUser = generateUser();
      mockChef = generated.chef;
      mockGame = generated.game;
    });
    afterEach(() => {
      // Restore all mocks
      sinon.restore();
    });
    it('should join a game successfully', async () => {
      // arrange
      sinon.stub(gameService, 'getGameByCodeOrThrowAsync').resolves(mockGame);
      sinon.stub(gameService, 'withTransaction').callsFake(mockedWithTransactionAsync);
      sinon.stub(gameService, 'validateJoinGameOrThrowAsync').resolves();
      sinon.stub(gameService, 'generateNewGameCodeAsync').resolves(UtilityService.generateGameCode());
      sinon.stub(gameService, 'joinGameAsync').resolves({ game: mockGame, chef: mockChef });

      // act
      const result = await gameService.performJoinGameAsync(mockGame.code, mockGame.password, mockUser, mockUser.userName);

      // assert
      expect(result.game).toBe(mockGame);
      expect(result.chef).toBe(mockChef);
    });

    it('should throw an error if validation fails', async () => {
      // arrange
      sinon.stub(gameService, 'withTransaction').callsFake(mockedWithTransactionAsync);
      sinon.stub(gameService, 'getGameByCodeOrThrowAsync').resolves(mockGame);
      // Mock a validation failure
      sinon.stub(gameService, 'validateJoinGameOrThrowAsync').throws(new Error('Validation failed'));

      // act/assert
      await expect(gameService.performJoinGameAsync(mockGame.code, mockGame.password, mockUser, userName))
        .rejects.toThrow('Validation failed');
    });
  });
});
