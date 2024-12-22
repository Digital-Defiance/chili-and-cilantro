import {
  ChefAlreadyJoinedError,
  constants,
  IChefDocument,
  ICreateGameActionDocument,
  IGameDocument,
  InvalidGameNameError,
  InvalidGamePasswordError,
  InvalidUserDisplayNameError,
  IUserDocument,
  ModelName,
  NotEnoughChefsError,
  TooManyChefsError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Model } from 'mongoose';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { generateCreateGameAction } from '../fixtures/action';
import { MockApplication } from '../fixtures/application';
import { generateChefGameUser } from '../fixtures/game';
import { generateUser } from '../fixtures/user';
import { generateString, numberBetween } from '../fixtures/utils';
import { mockedWithTransactionAsync } from '../fixtures/with-transaction';

describe('GameService', () => {
  let application: IApplication;
  let GameModel: Model<IGameDocument>;
  let gameService: GameService;
  let actionService: ActionService;
  let chefService: ChefService;
  let playerService: PlayerService;

  beforeAll(() => {
    application = new MockApplication();
  });
  beforeEach(() => {
    GameModel = application.getModel<IGameDocument>(ModelName.Game);
    actionService = new ActionService(application);
    playerService = new PlayerService(application);
    chefService = new ChefService(application);
    gameService = new GameService(
      application,
      actionService,
      chefService,
      playerService,
    );
  });

  describe('validateCreateGameOrThrowAsync', () => {
    let user, displayName, gameName, password, maxChefs;

    beforeEach(() => {
      // Setup initial valid parameters
      user = generateUser();
      displayName = generateString(
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
      jest.restoreAllMocks();
    });

    it('should not throw an error when all parameters are valid', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      // act/assert
      await expect(
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).resolves.not.toThrow();
    });

    it('throws an error if user is already in an active game', async () => {
      // arrange
      // Mock the condition where user is in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(true);

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(ChefAlreadyJoinedError);
    });

    it('should throw an error for an invalid username with special characters', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      displayName = '!'.repeat(constants.MIN_USER_DISPLAY_NAME_LENGTH + 1); // Set an invalid username with special characters

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(InvalidUserDisplayNameError);
    });

    it('should throw an error for invalid username that is too short', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      displayName = 'x'.repeat(constants.MIN_USER_DISPLAY_NAME_LENGTH - 1); // Set an invalid username that is too short

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(InvalidUserDisplayNameError);
    });

    it('should throw an error for invalid username that is too long', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      displayName = 'x'.repeat(constants.MAX_USER_DISPLAY_NAME_LENGTH + 1); // Set an invalid username that is too long

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(InvalidUserDisplayNameError);
    });

    it('should throw an error for an invalid game name with special characters', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      gameName = '!'.repeat(constants.MIN_GAME_NAME_LENGTH + 1); // Set an invalid game name with special characters

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(InvalidGameNameError);
    });

    it('should throw an error for invalid game name that is too short', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      gameName = 'x'.repeat(constants.MIN_GAME_NAME_LENGTH - 1); // Set an invalid game name that is too short

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(InvalidGameNameError);
    });

    it('should throw an error for invalid game name that is too long', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      gameName = 'x'.repeat(constants.MAX_GAME_NAME_LENGTH + 1); // Set an invalid game name that is too long

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(InvalidGameNameError);
    });

    it('should throw an error for invalid password that is too short', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      // generate a string that is constants.MIN_GAME_PASSWORD_LENGTH - 1 characters long
      password = 'x'.repeat(constants.MIN_GAME_PASSWORD_LENGTH - 1);

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(InvalidGamePasswordError);
    });

    it('should throw an error for invalid password that is too long', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      // generate a string that is constants.MAX_PASSWORD_LENGTH + 1 characters long
      password = 'x'.repeat(constants.MAX_PASSWORD_LENGTH + 1);

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(InvalidGamePasswordError);
    });

    it('should throw an error to too few chefs', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      maxChefs = constants.MIN_CHEFS - 1; // Set an invalid number of chefs by 1 too few

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(NotEnoughChefsError);
    });

    it('should throw an error to too many chefs', async () => {
      // arrange
      // Mock the condition where user is not in an active game
      jest
        .spyOn(playerService, 'userIsInAnyActiveGameAsync')
        .mockResolvedValue(false);

      maxChefs = constants.MAX_CHEFS + 1; // Set an invalid number of chefs by 1 too many

      // act/assert
      await expect(async () =>
        gameService.validateCreateGameOrThrowAsync(
          user,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow(TooManyChefsError);
    });
  });

  describe('createGameAsync', () => {
    let mockUser: IUserDocument;
    let gameUserName: string;
    let gameName: string;
    let password: string;
    let maxChefs: number;
    let mockGame: IGameDocument;
    let mockChef: IChefDocument;
    let mockCreateGameAction: ICreateGameActionDocument;
    let generateGameCodeSpy: jest.SpyInstance;
    let createGameSpy: jest.SpyInstance;
    let newChefSpy: jest.SpyInstance;

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
      generateGameCodeSpy = jest
        .spyOn(gameService, 'generateNewGameCodeAsync')
        .mockResolvedValue(mockGame.code);
      (GameModel as any).create = jest.fn().mockResolvedValue([mockGame]);
      newChefSpy = jest
        .spyOn(chefService, 'newChefAsync')
        .mockResolvedValue(mockChef);
      createGameSpy = jest
        .spyOn(actionService, 'createGameAsync')
        .mockResolvedValue(mockCreateGameAction);
    });

    afterEach(() => {
      // Restore all mocks
      jest.restoreAllMocks();
    });

    it('creates a game successfully with valid parameters', async () => {
      // act
      const result = await gameService.createGameAsync(
        mockUser,
        gameUserName,
        gameName,
        maxChefs,
        password,
        mockGame._id,
        mockChef._id,
      );

      // assert
      expect(result.game).toEqual(mockGame);
      expect(result.chef).toEqual(mockChef);
      expect(result.action).toEqual(mockCreateGameAction);
      expect(generateGameCodeSpy).toBeTruthy();
      expect(GameModel.create).toHaveBeenCalledWith([
        expect.objectContaining({
          code: mockGame.code,
        }),
      ]);
      expect(createGameSpy).toHaveBeenCalledWith(mockGame, mockChef, mockUser);
      expect(newChefSpy).toHaveBeenCalledWith(
        mockGame,
        mockUser,
        gameUserName,
        true,
        mockChef._id,
      );
    });
  });
  describe('performCreateGameAsync', () => {
    let mockUser, displayName, gameName, password, maxChefs;
    beforeEach(() => {
      mockUser = generateUser();
      displayName = generateString(
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
      jest.restoreAllMocks();
    });
    it('should create a game successfully', async () => {
      const {
        game: mockGame,
        chef: mockChef,
        user: mockUser,
      } = generateChefGameUser(true);
      const mockCreateGameAction = generateCreateGameAction(
        mockGame._id,
        mockChef._id,
        mockUser._id,
      );
      // arrange
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);
      jest
        .spyOn(gameService, 'validateCreateGameOrThrowAsync')
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(gameService, 'generateNewGameCodeAsync')
        .mockResolvedValue(mockGame.code);
      jest.spyOn(gameService, 'createGameAsync').mockResolvedValue({
        game: mockGame,
        chef: mockChef,
        action: mockCreateGameAction,
      });

      // act
      const result = await gameService.performCreateGameAsync(
        mockUser,
        displayName,
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
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);
      // Mock a validation failure
      jest
        .spyOn(gameService, 'validateCreateGameOrThrowAsync')
        .mockRejectedValue(new Error('Validation failed'));

      // act/assert
      await expect(async () =>
        gameService.performCreateGameAsync(
          mockUser,
          displayName,
          gameName,
          maxChefs,
          password,
        ),
      ).rejects.toThrow('Validation failed');
    });
  });
});
