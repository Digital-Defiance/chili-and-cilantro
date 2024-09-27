import {
  constants,
  IChef,
  IGame,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { InvalidGameNameError } from 'chili-and-cilantro-api/src/errors/invalidGameName';
import { InvalidGameParameterError } from 'chili-and-cilantro-api/src/errors/invalidGameParameter';
import { InvalidGamePasswordError } from 'chili-and-cilantro-api/src/errors/invalidGamePassword';
import { UtilityService } from 'chili-and-cilantro-api/src/services/utility';
import sinon from 'sinon';
import { AlreadyJoinedOtherError } from '../../src/errors/already-joined-other';
import { InvalidUserDisplayNameError } from '../../src/errors/invalid-user-display-name';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { generateCreateGameAction } from '../fixtures/action';
import { generateChefGameUser } from '../fixtures/game';
import { mockedWithTransactionAsync } from '../fixtures/transactionManager';
import { generateUser } from '../fixtures/user';
import { generateString, numberBetween } from '../fixtures/utils';

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

  describe('validateCreateGameOrThrowAsync', () => {
    let user, userName, gameName, password, maxChefs;

    beforeEach(() => {
      // Setup initial valid parameters
      user = generateUser();
      userName = generateString(
        constants.MIN_USER_DISPLAY_NAME_LENGTH,
        constants.MAX_USER_DISPLAY_NAME_LENGTH,
      );
      gameName = generateString(
        constants.MIN_GAME_NAME_LENGTH,
        constants.MAX_GAME_NAME_LENGTH,
      );
      password = generateString(
        constants.MIN_GAME_PASSWORD_LENGTH,
        constants.MAX_GAME_PASSWORD_LENGTH,
      );
      maxChefs = numberBetween(constants.MIN_CHEFS, constants.MAX_CHEFS);
    });

    afterEach(() => {
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

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).resolves.not.toThrow();
    });

    it('throws an error if user is already in an active game', async () => {
      // arrange
      // Mock the condition where user is in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(true);

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(AlreadyJoinedOtherError);
    });

    it('should throw an error for an invalid username with special characters', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);

      userName = '!'.repeat(constants.MIN_USER_DISPLAY_NAME_LENGTH + 1); // Set an invalid username with special characters

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(InvalidUserDisplayNameError);
    });

    it('should throw an error for invalid username that is too short', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);

      userName = 'x'.repeat(constants.MIN_USER_DISPLAY_NAME_LENGTH - 1); // Set an invalid username that is too short

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(InvalidUserDisplayNameError);
    });

    it('should throw an error for invalid username that is too long', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);

      userName = 'x'.repeat(constants.MAX_USER_DISPLAY_NAME_LENGTH + 1); // Set an invalid username that is too long

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(InvalidUserDisplayNameError);
    });

    it('should throw an error for an invalid game name with special characters', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);

      gameName = '!'.repeat(constants.MIN_GAME_NAME_LENGTH + 1); // Set an invalid game name with special characters

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(InvalidGameNameError);
    });

    it('should throw an error for invalid game name that is too short', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);

      gameName = 'x'.repeat(constants.MIN_GAME_NAME_LENGTH - 1); // Set an invalid game name that is too short

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(InvalidGameNameError);
    });

    it('should throw an error for invalid game name that is too long', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);

      gameName = 'x'.repeat(constants.MAX_GAME_NAME_LENGTH + 1); // Set an invalid game name that is too long

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(InvalidGameNameError);
    });

    it('should throw an error for invalid password that is too short', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);

      // generate a string that is constants.MIN_GAME_PASSWORD_LENGTH - 1 characters long
      password = 'x'.repeat(constants.MIN_GAME_PASSWORD_LENGTH - 1);

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(InvalidGamePasswordError);
    });

    it('should throw an error for invalid password that is too long', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);

      // generate a string that is constants.MAX_PASSWORD_LENGTH + 1 characters long
      password = 'x'.repeat(constants.MAX_PASSWORD_LENGTH + 1);

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(InvalidGamePasswordError);
    });

    it('should throw an error to too few chefs', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);

      maxChefs = constants.MIN_CHEFS - 1; // Set an invalid number of chefs by 1 too few

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(InvalidGameParameterError);
    });

    it('should throw an error to too many chefs', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon
        .stub(gameService.playerService, 'userIsInAnyActiveGameAsync')
        .resolves(false);

      maxChefs = constants.MAX_CHEFS + 1; // Set an invalid number of chefs by 1 too many

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow(InvalidGameParameterError);
    });
  });

  describe('createGameAsync', () => {
    let mockUser,
      gameUserName,
      gameName,
      password,
      maxChefs,
      mockGame,
      mockChef,
      mockCreateGameAction;

    beforeEach(() => {
      // Setup initial valid parameters
      gameUserName = generateString(
        constants.MIN_USER_DISPLAY_NAME_LENGTH,
        constants.MAX_USER_DISPLAY_NAME_LENGTH,
      );
      gameName = generateString(
        constants.MIN_GAME_NAME_LENGTH,
        constants.MAX_GAME_NAME_LENGTH,
      );
      password = generateString(
        constants.MIN_GAME_PASSWORD_LENGTH,
        constants.MAX_GAME_PASSWORD_LENGTH,
      );
      maxChefs = numberBetween(constants.MIN_CHEFS, constants.MAX_CHEFS);

      // Mock game and chef objects to be returned by the respective service calls
      const generated = generateChefGameUser(true);
      mockGame = generated.game;
      mockChef = generated.chef;
      mockUser = generated.user;
      mockCreateGameAction = generateCreateGameAction(
        mockGame._id,
        mockChef._id,
        mockUser._id,
      );

      // Mock dependencies
      sinon
        .stub(gameService, 'generateNewGameCodeAsync')
        .resolves(mockGame.code);
      sinon.stub(gameService.GameModel, 'create').resolves(mockGame);
      sinon.stub(gameService.chefService, 'newChefAsync').resolves(mockChef);
      sinon
        .stub(gameService.actionService, 'createGameAsync')
        .resolves(mockCreateGameAction);
    });

    afterEach(() => {
      // Restore all mocks
      sinon.restore();
    });

    it('creates a game successfully with valid parameters', async () => {
      // act
      const result = await gameService.createGameAsync(
        mockUser,
        gameUserName,
        gameName,
        password,
        maxChefs,
      );

      // assert
      expect(result.game).toEqual(mockGame);
      expect(result.chef).toEqual(mockChef);
      expect(result.action).toEqual(mockCreateGameAction);
      expect(gameService.generateNewGameCodeAsync.called).toBeTruthy();
      expect(
        gameService.GameModel.create.calledWith(
          sinon.match.has('code', mockGame.code),
        ),
      ).toBeTruthy();
      expect(
        gameService.chefService.newChefAsync.calledWith(
          mockGame,
          mockUser,
          gameUserName,
          true,
        ),
      ).toBeTruthy();
      expect(
        gameService.actionService.createGameAsync.calledWith(
          mockGame,
          mockChef,
          mockUser,
        ),
      ).toBeTruthy();
    });
  });
  describe('performCreateGameAsync', () => {
    let mockUser, userName, gameName, password, maxChefs;
    beforeEach(() => {
      mockUser = generateUser();
      userName = generateString(
        constants.MIN_USER_DISPLAY_NAME_LENGTH,
        constants.MAX_USER_DISPLAY_NAME_LENGTH,
      );
      gameName = generateString(
        constants.MIN_GAME_NAME_LENGTH,
        constants.MAX_GAME_NAME_LENGTH,
      );
      password = generateString(
        constants.MIN_GAME_PASSWORD_LENGTH,
        constants.MAX_GAME_PASSWORD_LENGTH,
      );
      maxChefs = numberBetween(constants.MIN_CHEFS, constants.MAX_CHEFS);
    });
    afterEach(() => {
      // Restore all mocks
      sinon.restore();
    });
    it('should create a game successfully', async () => {
      // arrange
      const {
        game: mockGame,
        chef: mockChef,
        user: mockUser,
      } = generateChefGameUser(true);
      sinon
        .stub(gameService, 'withTransaction')
        .callsFake(mockedWithTransactionAsync);
      sinon.stub(gameService, 'validateCreateGameOrThrowAsync').resolves();
      sinon
        .stub(gameService, 'generateNewGameCodeAsync')
        .resolves(UtilityService.generateGameCode());
      sinon
        .stub(gameService, 'createGameAsync')
        .resolves({ game: mockGame, chef: mockChef });

      // act
      const result = await gameService.performCreateGameAsync(
        mockUser,
        userName,
        gameName,
        password,
        maxChefs,
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
      // Mock a validation failure
      sinon
        .stub(gameService, 'validateCreateGameOrThrowAsync')
        .throws(new Error('Validation failed'));

      // act/assert
      await expect(
        gameService.performCreateGameAsync(
          mockUser,
          userName,
          gameName,
          password,
          maxChefs,
        ),
      ).rejects.toThrow('Validation failed');
    });
  });
});
