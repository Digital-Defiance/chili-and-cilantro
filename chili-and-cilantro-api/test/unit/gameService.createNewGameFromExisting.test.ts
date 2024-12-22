import {
  DefaultIdType,
  GameInProgressError,
  GamePhase,
  IChefDocument,
  IGameDocument,
  IUserDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Model } from 'mongoose';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { MockApplication } from '../fixtures/application';
import { generateChef } from '../fixtures/chef';
import { generateChefGameUser, generateGame } from '../fixtures/game';
import { MockedModel } from '../fixtures/mocked-model';
import { generateObjectId } from '../fixtures/objectId';
import { mockedWithTransactionAsync } from '../fixtures/with-transaction';

describe('GameService', () => {
  describe('validateCreateNewGameFromExistingOrThrow', () => {
    let application: IApplication;
    let gameService: GameService;
    let existingGame: IGameDocument;
    let gameModel: Model<IGameDocument>;
    let gameId: DefaultIdType;
    let user: IUserDocument;
    let chef: IChefDocument;
    let actionService: ActionService;
    let chefService: ChefService;
    let playerService: PlayerService;

    beforeEach(() => {
      application = new MockApplication();
      gameModel = application.getModel<IGameDocument>(ModelName.Game);
      actionService = {} as unknown as ActionService;
      chefService = {} as unknown as ChefService;
      playerService = {} as unknown as PlayerService;
      gameService = new GameService(
        application,
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
    let application: IApplication;
    let gameId: DefaultIdType;
    let gameService: GameService;
    let mockChefService: ChefService;
    let mockActionService: ActionService;
    let mockPlayerService: PlayerService;
    let mockGameModel: IGameDocument & MockedModel;
    let existingGame: IGameDocument;
    let newGameId: DefaultIdType;
    let newGame: IGameDocument & MockedModel;
    let createGameSpy: jest.SpyInstance;
    let user: IUserDocument;
    let chef: IChefDocument;
    let mockChefs: IChefDocument[];

    beforeEach(() => {
      application = new MockApplication();
      newGameId = generateObjectId();
      const generated = generateChefGameUser(true, 2);
      gameId = generated.game._id;
      user = generated.user;
      chef = generated.chef;
      existingGame = generated.game;
      mockChefs = [chef, ...generated.additionalChefs];
      const newChef = generateChef({
        masterChef: true,
        gameId: newGameId,
        userId: user._id,
      });
      mockChefService = {
        getGameChefsByGameOrIdAsync: jest.fn().mockResolvedValue(mockChefs),
        newChefFromExisting: jest.fn().mockResolvedValue(newChef),
      } as unknown as ChefService;
      mockActionService = {
        createGameAsync: jest.fn(),
      } as unknown as ActionService;
      mockPlayerService = {} as unknown as PlayerService;
      newGame = generateGame(true, {
        _id: newGameId,
        masterChefUserId: user._id,
        masterChefId: newChef._id,
      });
      mockGameModel = application.getModel<IGameDocument>(
        ModelName.Game,
      ) as unknown as IGameDocument & MockedModel;
      createGameSpy = jest.spyOn(mockGameModel, 'create').mockResolvedValue([
        newGame as unknown as IGameDocument<DefaultIdType> & {
          _id: DefaultIdType;
        },
      ]);
      gameService = new GameService(
        application,
        mockActionService,
        mockChefService,
        mockPlayerService,
      );
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);
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
        {}, // mock session
      );
      expect(mockChefService.newChefFromExisting).toHaveBeenCalledTimes(
        existingGame.chefIds.length,
      );
      expect(createGameSpy).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('game');
      expect(result).toHaveProperty('chef');
    });
  });
  describe('performCreateNewGameFromExistingAsync', () => {
    let application: IApplication;
    let existingGameId: DefaultIdType;
    let mockUser: IUserDocument;
    let mockExistingGame: IGameDocument;
    let mockNewGame: IGameDocument;
    let mockExistingChef: IChefDocument;
    let mockNewChef: IChefDocument;
    let gameService: GameService;
    let actionService: ActionService;
    let chefService: ChefService;
    let playerService: PlayerService;
    beforeEach(() => {
      application = new MockApplication();
      const gameModel = application.getModel<IGameDocument>(ModelName.Game);
      const generated = generateChefGameUser(true);
      mockExistingGame = generated.game;
      mockExistingChef = generated.chef;
      mockUser = generated.user;
      mockNewGame = generateGame();
      mockNewChef = generateChef({
        masterChef: true,
        gameId: mockNewGame._id,
        userId: mockUser._id,
      });
      actionService = {} as unknown as ActionService;
      chefService = {} as unknown as ChefService;
      playerService = {} as unknown as PlayerService;
      gameService = new GameService(
        application,
        actionService,
        chefService,
        playerService,
      );
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should be able to perform the create game from existing game actions within a transaction', async () => {
      // arrange
      jest
        .spyOn(gameService, 'getGameByIdOrThrowAsync')
        .mockResolvedValue(mockExistingGame);
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);
      jest
        .spyOn(gameService, 'validateCreateNewGameFromExistingOrThrow')
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(gameService, 'createNewGameFromExistingAsync')
        .mockResolvedValue({ game: mockNewGame, chef: mockNewChef });

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
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);
      jest
        .spyOn(gameService, 'getGameByIdOrThrowAsync')
        .mockResolvedValue(mockExistingGame);
      // Mock a validation failure
      jest
        .spyOn(gameService, 'validateCreateNewGameFromExistingOrThrow')
        .mockImplementation(() => {
          throw new Error('Validation failed');
        });

      // act/assert
      await expect(async () =>
        gameService.performCreateNewGameFromExistingAsync(
          existingGameId,
          mockUser,
        ),
      ).rejects.toThrow('Validation failed');
    });
  });
});
