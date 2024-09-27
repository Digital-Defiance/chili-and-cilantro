import {
  constants,
  GamePhase,
  IChef,
  IGame,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import sinon from 'sinon';
import { AlreadyJoinedOtherError } from '../../src/errors/already-joined-other';
import { GameFullError } from '../../src/errors/game-full';
import { GameInProgressError } from '../../src/errors/game-in-progress';
import { GamePasswordMismatchError } from '../../src/errors/game-password-mismatch';
import { InvalidUserDisplayNameError } from '../../src/errors/invalid-user-display-name';
import { UsernameInUseError } from '../../src/errors/username-in-use';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { UtilityService } from '../../src/services/utility';
import { generateChef } from '../fixtures/chef';
import { generateChefGameUser, generateGame } from '../fixtures/game';
import { generateObjectId } from '../fixtures/objectId';
import { mockedWithTransactionAsync } from '../fixtures/transactionManager';
import { generateUser } from '../fixtures/user';
import { generateString } from '../fixtures/utils';

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
    gameService = new GameService(
      gameModel,
      actionService,
      chefService,
      playerService,
    );
  });

  describe('validateJoinGameOrThrowAsync', () => {
    let gameId, game, chef, user, userDisplayName;

    beforeEach(() => {
      // Setup initial valid parameters
      gameId = generateObjectId();
      const generated = generateChefGameUser(true);
      user = generated.user;
      chef = generated.chef;
      game = generated.game;
      userDisplayName = generateString(
        constants.MIN_USER_DISPLAY_NAME_LENGTH,
        constants.MAX_USER_DISPLAY_NAME_LENGTH,
      );
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
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      // act/assert
      await expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userDisplayName,
          game.password,
        ),
      ).resolves.not.toThrow();
    });

    it('throws an error if user is already in an active game', async () => {
      // arrange
      // Mock the condition where user is in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(true);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      // act/assert
      await expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userDisplayName,
          game.password,
        ),
      ).rejects.toThrow(AlreadyJoinedOtherError);
    });
    it('should throw an error when the chef name is already in the specified game', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      // act/assert
      await expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          chef.name,
          game.password,
        ),
      ).rejects.toThrow(UsernameInUseError);
    });
    it('should throw an error when the game is already in progress', () => {
      // arrange
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);
      game = generateGame(true, {
        gameId,
        hostUserId: user._id,
        hostChefId: chef._id,
        currentPhase: GamePhase.SETUP,
      });

      // act/assert
      expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userDisplayName,
          game.password,
        ),
      ).rejects.toThrow(GameInProgressError);
    });
    it('should throw an error for an invalid username with special characters', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      userDisplayName = '!'.repeat(constants.MIN_USER_DISPLAY_NAME_LENGTH + 1); // Set an invalid username with special characters

      // act/assert
      await expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userDisplayName,
          game.password,
        ),
      ).rejects.toThrow(InvalidUserDisplayNameError);
    });

    it('should throw an error for invalid username that is too short', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      userDisplayName = 'x'.repeat(constants.MIN_USER_DISPLAY_NAME_LENGTH - 1); // Set an invalid username that is too short

      // act/assert
      await expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userDisplayName,
          game.password,
        ),
      ).rejects.toThrow(InvalidUserDisplayNameError);
    });

    it('should throw an error for invalid username that is too long', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      userDisplayName = 'x'.repeat(constants.MAX_USER_DISPLAY_NAME_LENGTH + 1); // Set an invalid username that is too long

      // act/assert
      await expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userDisplayName,
          game.password,
        ),
      ).rejects.toThrow(InvalidUserDisplayNameError);
    });

    it('should throw an error for incorrect password', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      // act/assert
      await expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userDisplayName,
          'xxxx',
        ),
      ).rejects.toThrow(GamePasswordMismatchError);
    });

    it('should throw an error to too many chefs', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      for (let i = 1; i <= constants.MAX_CHEFS; i++) {
        game.chefIds.push(generateObjectId());
      }
      // act/assert
      await expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userDisplayName,
          game.password,
        ),
      ).rejects.toThrow(GameFullError);
    });
    it('should allow a user to join a game with no password as long as none is provided', async () => {
      const game = generateGame(false); // Game with no password required
      const user = generateUser();
      const userName = generateString(
        constants.MIN_USER_DISPLAY_NAME_LENGTH,
        constants.MAX_USER_DISPLAY_NAME_LENGTH,
      );

      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon.stub(gameService, 'getGameChefNamesByGameIdAsync').resolves([]);

      await expect(
        gameService.validateJoinGameOrThrowAsync(game, user, userName, ''),
      ).resolves.not.toThrow();
    });
    it('should throw an error if a user tries to join a game with a password when none is required', async () => {
      const game = generateGame(false); // Game with no password required
      const user = generateUser();
      const userName = generateString(
        constants.MIN_USER_DISPLAY_NAME_LENGTH,
        constants.MAX_USER_DISPLAY_NAME_LENGTH,
      );
      const unnecessaryPassword = 'somePassword';

      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon.stub(gameService, 'getGameChefNamesByGameIdAsync').resolves([]);

      await expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userName,
          unnecessaryPassword,
        ),
      ).rejects.toThrow(GamePasswordMismatchError);
    });
    it('should throw an error if a user tries to join a game and does not supply a password when one is required', async () => {
      const game = generateGame(); // Game with a password required
      const user = generateUser();
      const userName = generateString(
        constants.MIN_USER_DISPLAY_NAME_LENGTH,
        constants.MAX_USER_DISPLAY_NAME_LENGTH,
      );

      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);
      sinon.stub(gameService, 'getGameChefNamesByGameIdAsync').resolves([]);

      await expect(
        gameService.validateJoinGameOrThrowAsync(game, user, userName, ''),
      ).rejects.toThrow(GamePasswordMismatchError);
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
      userName = 'testUser';
    });

    it('should successfully join a game', async () => {
      // Setup mocks
      const mockChef = generateChef({ host: false, gameId, userId: user._id });
      mockChefService.newChefAsync.mockResolvedValue(mockChef);
      game.save = jest.fn().mockResolvedValue(game);

      // Call the method
      const result = await gameService.joinGameAsync(game, user, userName);

      // Assertions
      expect(mockChefService.newChefAsync).toHaveBeenCalledWith(
        game,
        user,
        userName,
        false,
      );
      expect(mockActionService.joinGameAsync).toHaveBeenCalledWith(
        game,
        mockChef,
        user,
      );
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
      sinon
        .stub(gameService, 'withTransaction')
        .callsFake(mockedWithTransactionAsync);
      sinon.stub(gameService, 'validateJoinGameOrThrowAsync').resolves();
      sinon
        .stub(gameService, 'generateNewGameCodeAsync')
        .resolves(UtilityService.generateGameCode());
      sinon
        .stub(gameService, 'joinGameAsync')
        .resolves({ game: mockGame, chef: mockChef });

      // act
      const result = await gameService.performJoinGameAsync(
        mockGame.code,
        mockGame.password,
        mockUser,
        mockUser.userName,
      );

      // assert
      expect(result.game).toBe(mockGame);
      expect(result.chef).toBe(mockChef);
    });

    it('should throw an error if validation fails', async () => {
      // arrange
      sinon
        .stub(gameService, 'withTransaction')
        .callsFake(mockedWithTransactionAsync);
      sinon.stub(gameService, 'getGameByCodeOrThrowAsync').resolves(mockGame);
      // Mock a validation failure
      sinon
        .stub(gameService, 'validateJoinGameOrThrowAsync')
        .throws(new Error('Validation failed'));

      // act/assert
      await expect(
        gameService.performJoinGameAsync(
          mockGame.code,
          mockGame.password,
          mockUser,
          userName,
        ),
      ).rejects.toThrow('Validation failed');
    });
  });
});
