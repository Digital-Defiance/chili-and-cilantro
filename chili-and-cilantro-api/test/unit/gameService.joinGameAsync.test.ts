import {
  ChefAlreadyJoinedError,
  constants,
  DefaultIdType,
  GameInProgressError,
  GamePasswordMismatchError,
  GamePhase,
  IChefDocument,
  IGameDocument,
  InvalidUserDisplayNameError,
  IUserDocument,
  ModelName,
  TooManyChefsError,
  UsernameInUseError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { faker } from '@faker-js/faker';
import { Model, Types } from 'mongoose';
import sinon from 'sinon';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { UtilityService } from '../../src/services/utility';
import { MockApplication } from '../fixtures/application';
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

    it('should not throw an error if the user is already a participant', async () => {
      // Arrange
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon.stub(gameService, 'getGameChefNamesByGameIdAsync').resolves([]);
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(true); // Simulate user already in game

      // Act & Assert
      await expect(
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userDisplayName,
          game.password,
        ),
      ).resolves.not.toThrow();
    });

    it('should not throw an error when all parameters are valid', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

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
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

      // act/assert
      await expect(async () =>
        gameService.validateJoinGameOrThrowAsync(
          game,
          user,
          userDisplayName,
          game.password,
        ),
      ).rejects.toThrow(ChefAlreadyJoinedError);
    });
    it('should throw an error when the chef name is already in the specified game', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      sinon.stub(playerService, 'userIsInAnyActiveGameAsync').resolves(false);
      sinon
        .stub(gameService, 'getGameChefNamesByGameIdAsync')
        .resolves([chef.name]);
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

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
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);
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
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

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
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

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
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

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
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

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
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

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
      ).rejects.toThrow(TooManyChefsError);
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
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

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
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

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
      sinon.stub(gameService, 'verifyUserIsParticipantAsync').resolves(false);

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
      mockChefService = {
        newChefAsync: jest.fn(),
        getGameChefsByGameOrIdAsync: jest.fn(),
      } as unknown as ChefService;
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
      (mockChefService.newChefAsync as jest.Mock).mockResolvedValue(chef);
      (
        mockChefService.getGameChefsByGameOrIdAsync as jest.Mock
      ).mockResolvedValue([]);
      game.save = jest.fn().mockResolvedValue(game);

      // Call the method
      const result = await gameService.joinGameAsync(game, user, displayName);

      // Assertions
      expect(mockChefService.newChefAsync).toHaveBeenCalledWith(
        game,
        user,
        displayName,
        false,
        undefined,
        undefined,
      );
      expect(mockActionService.joinGameAsync).toHaveBeenCalledWith(
        game,
        chef,
        user,
        undefined,
      );
      expect(game.chefIds).toContain(chef._id);
      expect(game.save).toHaveBeenCalled();
      expect(result).toEqual({ game, chefs: [chef] });
    });

    it('should successfully re-join a game if already a member', async () => {
      // Setup mocks
      (mockChefService.newChefAsync as jest.Mock).mockResolvedValue(chef);
      (
        mockChefService.getGameChefsByGameOrIdAsync as jest.Mock
      ).mockResolvedValue([chef]);
      game.save = jest.fn().mockResolvedValue(game);

      // Call the method
      const result = await gameService.joinGameAsync(game, user, displayName);

      // Assertions
      expect(mockChefService.newChefAsync).not.toHaveBeenCalled();
      expect(mockActionService.joinGameAsync).not.toHaveBeenCalled();
      expect(game.chefIds).toContain(chef._id);
      expect(game.save).not.toHaveBeenCalled();
      expect(result).toEqual({ game, chefs: [chef] });
    });
  });
  describe('performJoinGameAsync', () => {
    let gameId: Types.ObjectId;
    let mockChef: IChefDocument;
    let mockGame: IGameDocument;
    let mockUser: IUserDocument;
    let displayName: string;
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
      sinon.stub(gameService, 'joinGameAsync').resolves({
        game: mockGame,
        chefs: [mockChef],
      });

      // act
      const result = await gameService.performJoinGameAsync(
        mockGame.code,
        mockGame.password,
        mockUser,
        mockUser.displayName,
      );

      // assert
      expect(result.game).toBe(mockGame);
      expect(result.chefs).toEqual([mockChef]);
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
