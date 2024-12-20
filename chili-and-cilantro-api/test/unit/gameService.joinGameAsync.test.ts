import {
  AlreadyJoinedOtherError,
  constants,
  DefaultIdType,
  GameFullError,
  GameInProgressError,
  GamePasswordMismatchError,
  GamePhase,
  IChefDocument,
  IGameDocument,
  InvalidUserDisplayNameError,
  IUserDocument,
  ModelName,
  UsernameInUseError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';
import sinon from 'sinon';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { UtilityService } from '../../src/services/utility';
import { MockApplication } from '../fixtures/application';
import { generateChef } from '../fixtures/chef';
import { generateChefGameUser, generateGame } from '../fixtures/game';
import { generateObjectId } from '../fixtures/objectId';
import { generateUser } from '../fixtures/user';
import { generateString } from '../fixtures/utils';
import { mockedWithTransactionAsync } from '../fixtures/with-transaction';

describe('GameService', () => {
  let application: IApplication;
  let chefModel: Model<IChefDocument>;
  let gameModel: Model<IGameDocument>;
  let gameService: GameService;
  let playerService: PlayerService;

  beforeAll(() => {
    application = new MockApplication();
    chefModel = application.getModel<IChefDocument>(ModelName.Chef);
    gameModel = application.getModel<IGameDocument>(ModelName.Game);
    const actionService = new ActionService(application);
    const chefService = new ChefService(application);
    playerService = {
      userIsInAnyActiveGameAsync: jest.fn(),
    } as unknown as PlayerService;
    gameService = new GameService(
      application,
      actionService,
      chefService,
      playerService,
    );
  });

  describe('validateJoinGameOrThrowAsync', () => {
    let gameId: DefaultIdType;
    let game: IGameDocument;
    let chef: IChefDocument;
    let user: IUserDocument;
    let userDisplayName: string;

    beforeEach(() => {
      // Setup initial valid parameters
      gameId = generateObjectId();
      const generated = generateChefGameUser(true);
      user = generated.user;
      chef = generated.chef;
      game = generated.game;
      userDisplayName = faker.person.firstName();
    });

    afterEach(() => {
      sinon.restore();
      // Restore the stub to its original method after each test
      jest.restoreAllMocks();
    });

    it('should not throw an error when all parameters are valid', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
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
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(true);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      // act/assert
      await expect(async () =>
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
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      // act/assert
      await expect(async () =>
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
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);
      game = generateGame(true, {
        _id: gameId,
        masterChefUserId: user._id,
        masterChefId: chef._id,
        currentPhase: GamePhase.SETUP,
      });

      // act/assert
      expect(async () =>
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
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      userDisplayName = '!'.repeat(constants.MIN_USER_DISPLAY_NAME_LENGTH + 1); // Set an invalid username with special characters

      // act/assert
      await expect(async () =>
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
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      userDisplayName = 'x'.repeat(constants.MIN_USER_DISPLAY_NAME_LENGTH - 1); // Set an invalid username that is too short

      // act/assert
      await expect(async () =>
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
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      userDisplayName = 'x'.repeat(constants.MAX_USER_DISPLAY_NAME_LENGTH + 1); // Set an invalid username that is too long

      // act/assert
      await expect(async () =>
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
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      // act/assert
      await expect(async () =>
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
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);

      for (let i = 1; i <= constants.MAX_CHEFS; i++) {
        game.chefIds.push(generateObjectId());
      }
      // act/assert
      await expect(async () =>
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
      const displayName = generateString(
        constants.MIN_USER_DISPLAY_NAME_LENGTH,
        constants.MAX_USER_DISPLAY_NAME_LENGTH,
      );

      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesByGameIdAsync').resolves([]);

      await expect(
        gameService.validateJoinGameOrThrowAsync(game, user, displayName, ''),
      ).resolves.not.toThrow();
    });
    it('should throw an error if a user tries to join a game with a password when none is required', async () => {
      const game = generateGame(false); // Game with no password required
      const user = generateUser();
      const displayName = generateString(
        constants.MIN_USER_DISPLAY_NAME_LENGTH,
        constants.MAX_USER_DISPLAY_NAME_LENGTH,
      );
      const unnecessaryPassword = 'somePassword';

      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesByGameIdAsync').resolves([]);

      await expect(async () =>
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          displayName,
          unnecessaryPassword,
        ),
      ).rejects.toThrow(GamePasswordMismatchError);
    });
    it('should throw an error if a user tries to join a game and does not supply a password when one is required', async () => {
      const game = generateGame(); // Game with a password required
      const user = generateUser();
      const displayName = generateString(
        constants.MIN_USER_DISPLAY_NAME_LENGTH,
        constants.MAX_USER_DISPLAY_NAME_LENGTH,
      );

      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesByGameIdAsync').resolves([]);

      await expect(async () =>
        gameService.validateJoinGameOrThrowAsync(game, user, displayName, ''),
      ).rejects.toThrow(GamePasswordMismatchError);
    });
  });

  describe('joinGameAsync', () => {
    let application: IApplication;
    let gameService: GameService;
    let mockChefService: ChefService;
    let mockActionService: ActionService;
    let mockPlayerService: PlayerService;
    let gameId: DefaultIdType;
    let chef: IChefDocument;
    let game: IGameDocument;
    let user: IUserDocument;
    let displayName: string;

    beforeEach(() => {
      application = new MockApplication();
      gameModel = application.getModel<IGameDocument>(ModelName.Game);
      mockChefService = { newChefAsync: jest.fn() } as unknown as ChefService;
      mockActionService = {
        joinGameAsync: jest.fn(),
      } as unknown as ActionService;
      mockPlayerService = {} as unknown as PlayerService;
      gameService = new GameService(
        application,
        mockActionService,
        mockChefService,
        mockPlayerService,
      );
      gameId = generateObjectId();
      const generated = generateChefGameUser(true);
      user = generated.user;
      chef = generated.chef;
      game = generated.game;
      displayName = 'testUser';
    });

    it('should successfully join a game', async () => {
      // Setup mocks
      const mockChef = generateChef({
        masterChef: false,
        gameId,
        userId: user._id,
      });
      (mockChefService.newChefAsync as jest.Mock).mockResolvedValue(mockChef);
      game.save = jest.fn().mockResolvedValue(game);

      // Call the method
      const result = await gameService.joinGameAsync(game, user, displayName);

      // Assertions
      expect(mockChefService.newChefAsync).toHaveBeenCalledWith(
        game,
        user,
        displayName,
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
    let gameId, mockChef, mockGame, mockUser, displayName;
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
        mockUser.displayName,
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
      await expect(async () =>
        gameService.performJoinGameAsync(
          mockGame.code,
          mockGame.password,
          mockUser,
          displayName,
        ),
      ).rejects.toThrow('Validation failed');
    });
  });
});
