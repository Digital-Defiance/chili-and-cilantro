import {
  DefaultIdType,
  GameInProgressError,
  GamePhase,
  IChefDocument,
  IGameDocument,
  IUserDocument,
  ModelName,
  NotEnoughChefsError,
  NotMasterChefError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Model } from 'mongoose';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { generateStartGameAction } from '../fixtures/action';
import { MockApplication } from '../fixtures/application';
import { generateChefGameUser } from '../fixtures/game';
import { generateObjectId } from '../fixtures/objectId';
import { mockedWithTransactionAsync } from '../fixtures/with-transaction';

describe('gameService startGame', () => {
  describe('performStartGameAsync', () => {
    let application: IApplication;
    let gameModel: Model<IGameDocument>;
    let gameService: GameService;
    let gameId: DefaultIdType;
    let game: IGameDocument;
    let chef: IChefDocument;
    let user: IUserDocument;
    let userId: DefaultIdType;
    let gameCode: string;
    let mockActionService: ActionService;
    let mockChefService: ChefService;
    let mockPlayerService: PlayerService;

    beforeEach(() => {
      application = new MockApplication();
      gameModel = application.getModel<IGameDocument>(ModelName.Game);
      mockActionService = {} as unknown as ActionService;
      mockPlayerService = {} as unknown as PlayerService;
      mockChefService = {} as unknown as ChefService;
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

      await expect(async () =>
        gameService.performStartGameAsync(gameCode, userId),
      ).rejects.toThrow('Validation failed');
    });
  });
  describe('validateStartGameOrThrowAsync', () => {
    let application: IApplication;
    let gameModel: Model<IGameDocument>;
    let gameService: GameService;
    let gameId: DefaultIdType;
    let game: IGameDocument;
    let chef: IChefDocument;
    let user: IUserDocument;
    let additionalChefs: IChefDocument[];
    let userId: DefaultIdType;
    let gameCode: string;
    let mockActionService: ActionService;
    let mockChefService: ChefService;
    let mockPlayerService: PlayerService;
    let isMasterChefAsync: jest.Mock;

    beforeEach(() => {
      application = new MockApplication();
      gameModel = application.getModel<IGameDocument>(ModelName.Game);
      mockActionService = {} as unknown as ActionService;
      isMasterChefAsync = jest.fn();
      mockPlayerService = {
        isMasterChefAsync: isMasterChefAsync,
      } as unknown as PlayerService;
      mockChefService = {} as unknown as ChefService;
      gameService = new GameService(
        application,
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
      isMasterChefAsync.mockResolvedValue(true);
      game.currentPhase = GamePhase.LOBBY;

      await expect(
        gameService.validateStartGameOrThrowAsync(game, userId),
      ).resolves.not.toThrow();
    });
    it('should throw if the user is not the host', async () => {
      isMasterChefAsync.mockResolvedValue(false);

      await expect(async () =>
        gameService.validateStartGameOrThrowAsync(game, userId),
      ).rejects.toThrow(NotMasterChefError);
    });
    it('should throw if the game phase is not LOBBY', async () => {
      isMasterChefAsync.mockResolvedValue(true);
      game.currentPhase = GamePhase.SETUP;

      await expect(async () =>
        gameService.validateStartGameOrThrowAsync(game, userId),
      ).rejects.toThrow(GameInProgressError);
    });
    it('should throw if there are not enough chefs', async () => {
      isMasterChefAsync.mockResolvedValue(true);
      game.chefIds = [chef._id];

      await expect(async () =>
        gameService.validateStartGameOrThrowAsync(game, userId),
      ).rejects.toThrow(NotEnoughChefsError);
    });
  });
  describe('startGameAsync', () => {
    let application: IApplication;
    let gameModel: Model<IGameDocument>;
    let gameService: GameService;
    let gameId: DefaultIdType;
    let game: IGameDocument;
    let chef: IChefDocument;
    let user: IUserDocument;
    let userId: DefaultIdType;
    let gameCode: string;
    let mockActionService: ActionService;
    let mockChefService: ChefService;
    let mockPlayerService: PlayerService;

    beforeEach(() => {
      application = new MockApplication();
      gameModel = application.getModel<IGameDocument>(ModelName.Game);
      const {
        user: mockUser,
        chef: mockChef,
        game: mockGame,
        additionalChefs,
      } = generateChefGameUser(true, 2);
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
      } as unknown as ActionService;
      mockPlayerService = {} as unknown as PlayerService;
      mockChefService = {
        getGameChefsByGameOrIdAsync: jest
          .fn()
          .mockResolvedValue([chef, ...additionalChefs]),
      } as unknown as ChefService;
      gameService = new GameService(
        application,
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
      expect(mockActionService.startGameAsync).toHaveBeenCalledWith(game);
    });
  });
});
