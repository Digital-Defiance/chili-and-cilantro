import {
  CardType,
  GamePhase,
  IGameDocument,
  InvalidGameError,
  ModelName,
  TurnAction,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import constants from 'chili-and-cilantro-lib/src/lib/constants';
import mongoose, { Model, Query, Types } from 'mongoose';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { MockApplication } from '../fixtures/application';
import { generateChef } from '../fixtures/chef';
import { generateGame } from '../fixtures/game';
import { generateObjectId } from '../fixtures/objectId';

describe('GameService', () => {
  let application: IApplication;
  let gameService: GameService;
  let mockActionService: ActionService;
  let mockChefService: ChefService;
  let mockPlayerService: PlayerService;
  let mockGameModel: Model<IGameDocument>;
  let getGameChefsByGameOrIdAsyncMock = jest.fn();

  beforeEach(() => {
    application = new MockApplication();
    mockGameModel = application.getModel<IGameDocument>(ModelName.Game);
    getGameChefsByGameOrIdAsyncMock = jest.fn();
    mockActionService = {} as unknown as ActionService;
    mockChefService = {
      getGameChefsByGameOrIdAsync: getGameChefsByGameOrIdAsyncMock,
    } as unknown as ChefService;
    mockPlayerService = {} as unknown as PlayerService;
    gameService = new GameService(
      application,
      mockActionService,
      mockChefService,
      mockPlayerService,
    );
  });
  describe('getGameByIdOrThrowAsync', () => {
    it('should return a game when found', async () => {
      const mockGame = generateGame();
      const mockQuery = {
        session: jest.fn().mockResolvedValueOnce(mockGame),
      } as unknown as Query<IGameDocument[], IGameDocument>;
      const findOneSpy = jest
        .spyOn(mockGameModel, 'findOne')
        .mockReturnValueOnce(mockQuery);

      const gameId = new Types.ObjectId();
      const result = await gameService.getGameByIdOrThrowAsync(gameId);

      expect(result).toBe(mockGame);
      expect(findOneSpy).toHaveBeenCalledWith({
        _id: gameId,
      });
      expect(mockQuery.session).toHaveBeenCalled();
    });

    it('should throw InvalidGameError when game is not found', async () => {
      const mockQuery = {
        session: jest.fn().mockResolvedValueOnce(null),
      } as unknown as Query<IGameDocument[], IGameDocument>;
      jest.spyOn(mockGameModel, 'findOne').mockReturnValueOnce(mockQuery);

      const gameId = new mongoose.Types.ObjectId();

      await expect(async () =>
        gameService.getGameByIdOrThrowAsync(gameId),
      ).rejects.toThrow(InvalidGameError);
      expect(mockQuery.session).toHaveBeenCalled();
    });

    it('should search for active games when active parameter is true', async () => {
      const mockGame = generateGame();
      const mockQuery = {
        session: jest.fn().mockResolvedValueOnce(mockGame),
      } as unknown as Query<IGameDocument[], IGameDocument>;
      const findOneSpy = jest
        .spyOn(mockGameModel, 'findOne')
        .mockImplementation(() => mockQuery);

      const gameId = new mongoose.Types.ObjectId();
      const result = await gameService.getGameByIdOrThrowAsync(gameId, true);

      expect(findOneSpy).toHaveBeenCalledWith({
        _id: new mongoose.Types.ObjectId(gameId),
        currentPhase: { $ne: GamePhase.GAME_OVER },
      });
      expect(mockQuery.session).toHaveBeenCalled();
      expect(result).toBe(mockGame);
    });
  });
  describe('getGameByCodeOrThrowAsync', () => {
    it('should return the most recent game when found by code', async () => {
      const mockGame = generateGame();
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGame]),
        session: jest.fn().mockReturnThis(),
      } as unknown as Query<IGameDocument[], IGameDocument>;
      const findSpy = jest
        .spyOn(mockGameModel, 'find')
        .mockReturnValue(mockQuery);

      const gameCode = mockGame.code;
      const result = await gameService.getGameByCodeOrThrowAsync(gameCode);

      expect(result).toBe(mockGame);
      expect(findSpy).toHaveBeenCalledWith({ code: gameCode });
      expect(mockQuery.sort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(mockQuery.limit).toHaveBeenCalledWith(1);
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(mockQuery.session).toHaveBeenCalled();
    });
    it('should throw InvalidGameError when no game is found, returning null', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
        session: jest.fn().mockReturnThis(),
      } as unknown as Query<IGameDocument[], IGameDocument>;
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = 'testCode';

      await expect(async () =>
        gameService.getGameByCodeOrThrowAsync(gameCode),
      ).rejects.toThrow(InvalidGameError);
    });
    it('should throw InvalidGameError when no game is found, returning empty array', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
        session: jest.fn().mockReturnThis(),
      } as unknown as Query<IGameDocument[], IGameDocument>;
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = 'testCode';

      await expect(async () =>
        gameService.getGameByCodeOrThrowAsync(gameCode),
      ).rejects.toThrow(InvalidGameError);
    });
    it('should search for active games when active parameter is true', async () => {
      const mockGame = generateGame();
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        session: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGame]),
      } as unknown as Query<IGameDocument[], IGameDocument>;
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = mockGame.code;
      await gameService.getGameByCodeOrThrowAsync(gameCode, true);

      expect(mockGameModel.find).toHaveBeenCalledWith({
        code: gameCode,
        currentPhase: { $ne: GamePhase.GAME_OVER },
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(mockQuery.limit).toHaveBeenCalledWith(1);
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(mockQuery.session).toHaveBeenCalled();
    });
    it('should return the most recent game when multiple games are found', async () => {
      const gameOne = generateGame();
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([gameOne]),
        session: jest.fn().mockReturnThis(),
      } as unknown as Query<IGameDocument[], IGameDocument>;
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const result = await gameService.getGameByCodeOrThrowAsync(gameOne.code);

      expect(result).toBe(gameOne);
    });
  });
  describe('getGameChefNamesByGameIdAsync ', () => {
    it('should return chef names when chefs are found for the game', async () => {
      // Arrange
      const gameId = generateObjectId();
      const mockChefs = [{ name: 'Chef A' }, { name: 'Chef B' }];
      getGameChefsByGameOrIdAsyncMock.mockResolvedValue(mockChefs);

      // Act
      const result = await gameService.getGameChefNamesByGameIdAsync(
        gameId.toString(),
      );

      // Assert
      expect(result).toEqual(['Chef A', 'Chef B']);
      expect(getGameChefsByGameOrIdAsyncMock).toHaveBeenCalledWith(
        gameId.toString(),
      );
    });

    it('should return an empty array when no chefs are found for the game', async () => {
      // Arrange
      const gameId = generateObjectId();
      getGameChefsByGameOrIdAsyncMock.mockResolvedValue([]);

      // Act
      const result = await gameService.getGameChefNamesByGameIdAsync(
        gameId.toString(),
      );

      // Assert
      expect(result).toEqual([]);
      expect(getGameChefsByGameOrIdAsyncMock).toHaveBeenCalledWith(
        gameId.toString(),
      );
    });
  });
  describe('canBid', () => {
    it('should return false if the current phase is not SETUP or BIDDING', () => {
      const chef = generateChef();
      const game = generateGame(true, {
        turnOrder: [chef._id],
        currentChef: 0,
        cardsPlaced: 1,
        currentBid: 0,
      });
      expect(gameService.canBid(game, chef)).toBe(false);
    });

    it('should return false if the current chef is not the user', () => {
      const chef = generateChef();
      const chef2 = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.BIDDING,
        turnOrder: [chef._id, chef2._id],
        currentChef: 1,
        cardsPlaced: 1,
        currentBid: 0,
      });
      expect(gameService.canBid(game, chef)).toBe(false);
    });

    it('should return false if no cards are placed yet', () => {
      const chef = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.BIDDING,
        turnOrder: [chef._id],
        currentChef: 0,
        cardsPlaced: 0,
        currentBid: 0,
      });
      expect(gameService.canBid(game, chef)).toBe(false);
    });

    it('should return false if the minimum bid is more than the number of cards placed', () => {
      const chef = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.BIDDING,
        turnOrder: [chef._id],
        currentChef: 0,
        cardsPlaced: 1,
        currentBid: 2,
      });
      expect(gameService.canBid(game, chef)).toBe(false);
    });

    it('should return true when the chef can bid', () => {
      const chef = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.BIDDING,
        turnOrder: [chef._id],
        currentChef: 0,
        cardsPlaced: 3,
        currentBid: 1,
      });
      expect(gameService.canBid(game, chef)).toBe(true);
    });
  });
  describe('canPlaceCard', () => {
    it('should return false if the current phase is not SETUP', () => {
      const chef = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.BIDDING,
        turnOrder: [chef._id],
        currentChef: 0,
      });
      expect(gameService.canPlaceCard(game, chef)).toBe(false);
    });

    it('should return false if the current chef is not the user', () => {
      const chef = generateChef();
      const chef2 = generateChef();
      const game = {
        currentPhase: GamePhase.SETUP,
        turnOrder: [chef._id, chef2._id],
        currentChef: 1,
      } as IGameDocument;
      expect(gameService.canPlaceCard(game, chef)).toBe(false);
    });

    it('should return false if the chef has no cards left in their hand', () => {
      const chef = generateChef({ hand: [] });
      const game = generateGame(true, {
        currentPhase: GamePhase.SETUP,
        turnOrder: [chef._id],
        currentChef: 0,
      });
      expect(gameService.canPlaceCard(game, chef)).toBe(false);
    });

    it('should return true when the chef can place a card', () => {
      const chef = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.SETUP,
        turnOrder: [chef._id],
        currentChef: 0,
      });
      expect(gameService.canPlaceCard(game, chef)).toBe(true);
    });
  });
  describe('canPass', () => {
    it('should return false if the current chef is not the user', () => {
      const chef = generateChef();
      const chef2 = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.BIDDING,
        turnOrder: [chef._id, chef2._id],
        currentChef: 1,
      });
      expect(gameService.canPass(game, chef)).toBe(false);
    });

    it('should return false if the current phase is not BIDDING', () => {
      const chef = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.SETUP,
        turnOrder: [chef._id],
        currentChef: 0,
      });
      expect(gameService.canPass(game, chef)).toBe(false);
    });

    it('should return false if no one has bid yet', () => {
      const chef = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.BIDDING,
        turnOrder: [chef._id],
        currentChef: 0,
        currentBid: 0,
      });
      expect(gameService.canPass(game, chef)).toBe(false);
    });

    it('should return false if the previous chef bid the maximum number of cards', () => {
      const chef = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.BIDDING,
        turnOrder: [chef._id],
        currentChef: 0,
        currentBid: 5,
        cardsPlaced: 5,
      });
      expect(gameService.canPass(game, chef)).toBe(false);
    });

    it('should return false if all remaining players have passed', () => {
      // Mock the haveAllRemainingPlayersPassed function to return true
      gameService.haveAllRemainingPlayersPassed = jest
        .fn()
        .mockReturnValue(true);
      const chef = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.BIDDING,
        turnOrder: [chef._id],
        currentChef: 0,
        currentBid: 1,
      });
      expect(gameService.canPass(game, chef)).toBe(false);
    });

    it('should return true when the chef can pass', () => {
      // Mock the haveAllRemainingPlayersPassed function to return false
      gameService.haveAllRemainingPlayersPassed = jest
        .fn()
        .mockReturnValue(false);
      const chef = generateChef();
      const game = generateGame(true, {
        currentPhase: GamePhase.BIDDING,
        turnOrder: [chef._id],
        currentChef: 0,
        currentBid: 1,
      });
      expect(gameService.canPass(game, chef)).toBe(true);
    });
  });
  describe('availableTurnActions', () => {
    beforeEach(() => {
      gameService.canPlaceCard = jest.fn();
      gameService.canPass = jest.fn();
      gameService.canBid = jest.fn();
    });
    it('should include PlaceCard when the chef can place a card', () => {
      (gameService.canPlaceCard as jest.Mock).mockReturnValue(true);
      (gameService.canPass as jest.Mock).mockReturnValue(false);
      (gameService.canBid as jest.Mock).mockReturnValue(false);

      const game = generateGame();
      const chef = generateChef();
      expect(gameService.availableTurnActions(game, chef)).toContain(
        TurnAction.PlaceCard,
      );
    });

    it('should include Pass when the chef can pass', () => {
      (gameService.canPlaceCard as jest.Mock).mockReturnValue(false);
      (gameService.canPass as jest.Mock).mockReturnValue(true);
      (gameService.canBid as jest.Mock).mockReturnValue(false);

      const game = generateGame();
      const chef = generateChef();
      expect(gameService.availableTurnActions(game, chef)).toContain(
        TurnAction.Pass,
      );
    });

    it('should include IncreaseBid when the chef can increase the bid', () => {
      (gameService.canPlaceCard as jest.Mock).mockReturnValue(false);
      (gameService.canPass as jest.Mock).mockReturnValue(false);
      (gameService.canBid as jest.Mock).mockReturnValue(true);

      const chef = generateChef();
      const game = generateGame(true, { currentBid: 1 });
      expect(gameService.availableTurnActions(game, chef)).toContain(
        TurnAction.IncreaseBid,
      );
    });

    it('should include Bid when the chef can make a bid', () => {
      (gameService.canPlaceCard as jest.Mock).mockReturnValue(false);
      (gameService.canPass as jest.Mock).mockReturnValue(false);
      (gameService.canBid as jest.Mock).mockReturnValue(true);

      const game = generateGame(true, { currentBid: 0 });
      const chef = generateChef();
      expect(gameService.availableTurnActions(game, chef)).toContain(
        TurnAction.Bid,
      );
    });

    it('should return an empty array when the chef has no available actions', () => {
      (gameService.canPlaceCard as jest.Mock).mockReturnValue(false);
      (gameService.canPass as jest.Mock).mockReturnValue(false);
      (gameService.canBid as jest.Mock).mockReturnValue(false);

      const game = generateGame();
      const chef = generateChef();
      expect(gameService.availableTurnActions(game, chef)).toEqual([]);
    });
  });
  describe('haveAllRemainingPlayersPassed', () => {
    it('should return false when there are no bids in the current round', () => {
      const chef1 = generateChef();
      const chef2 = generateChef();
      const game = generateGame(true, {
        currentRound: 1,
        roundBids: { 1: [] },
        chefIds: [chef1._id, chef2._id],
      });
      expect(gameService.haveAllRemainingPlayersPassed(game)).toBe(false);
    });

    it('should return false when there are no non-passing bids', () => {
      const chef1 = generateChef();
      const chef2 = generateChef();
      const game = {
        currentRound: 0,
        roundBids: { 0: [{ chefId: chef1._id, pass: true }] },
        chefIds: [chef1._id, chef2._id],
      } as unknown as IGameDocument;
      expect(gameService.haveAllRemainingPlayersPassed(game)).toBe(false);
    });

    it('should return true when last non-passing bid is followed by passes from all other chefs', () => {
      const chef1 = generateChef();
      const chef2 = generateChef();
      const game = generateGame(true, {
        currentRound: 0,
        roundBids: {
          0: [
            { chefId: chef1._id, pass: false, bid: 1 },
            { chefId: chef2._id, pass: true, bid: constants.NONE },
          ],
        },
        chefIds: [chef1._id, chef2._id],
      });
      expect(gameService.haveAllRemainingPlayersPassed(game)).toBe(true);
    });

    it('should return false when last non-passing bid is not followed by passes from all other chefs', () => {
      const chef1 = generateChef();
      const chef2 = generateChef();
      const game = generateGame(true, {
        currentRound: 0,
        roundBids: {
          0: [
            { chefId: chef1._id, pass: false, bid: 1 },
            { chefId: chef2._id, pass: false, bid: 2 },
          ],
        },
        chefIds: [chef1._id, chef2._id],
      });
      expect(gameService.haveAllRemainingPlayersPassed(game)).toBe(false);
    });

    it('should handle multiple non-passing bids correctly', () => {
      const chef1 = generateChef();
      const chef2 = generateChef();
      const chef3 = generateChef();
      const game = generateGame(true, {
        currentRound: 0,
        roundBids: {
          0: [
            { chefId: chef1._id, pass: false, bid: 1 },
            { chefId: chef2._id, pass: false, bid: 2 },
            { chefId: chef3._id, pass: true, bid: constants.NONE },
          ],
        },
        chefIds: [chef1._id, chef2._id, chef3._id],
      });
      expect(gameService.haveAllRemainingPlayersPassed(game)).toBe(false);
    });
  });
  describe('getGameCurrentChefId', () => {
    let game;
    beforeEach(() => {
      game = generateGame(true);
    });
    it('should return the current chef ID when the index is valid', () => {
      const chefIds = [generateObjectId(), generateObjectId()];
      game = generateGame(true, { currentChef: 0, turnOrder: chefIds });

      const currentChefId = gameService.getGameCurrentChefId(game);
      expect(currentChefId).toEqual(chefIds[0]);
    });

    it('should throw an error if the current chef index is negative', () => {
      game = generateGame(true, {
        currentChef: constants.NONE,
        turnOrder: [generateObjectId()],
      });

      expect(() => gameService.getGameCurrentChefId(game)).toThrow(
        `Invalid current chef index: ${game.currentChef}`,
      );
    });

    it('should throw an error if the current chef index exceeds the turn order length', () => {
      game = generateGame(true, {
        currentChef: 2,
        turnOrder: [generateObjectId(), generateObjectId()],
      });

      expect(() => gameService.getGameCurrentChefId(game)).toThrow(
        `Invalid current chef index: ${game.currentChef}`,
      );
    });
  });
  describe('hasIngredientInHand', () => {
    it('should return true if the chef has the ingredient in hand', () => {
      const chef = generateChef({
        hand: [
          { type: CardType.Chili, faceUp: false },
          { type: CardType.Cilantro, faceUp: false },
        ],
      });
      const ingredient = CardType.Chili;

      const result = gameService.hasIngredientInHand(chef, ingredient);
      expect(result).toBe(true);
    });

    it('should return false if the chef does not have the ingredient in hand', () => {
      const chef = generateChef({
        hand: [{ type: CardType.Cilantro, faceUp: false }],
      });
      const ingredient = CardType.Chili;

      const result = gameService.hasIngredientInHand(chef, ingredient);
      expect(result).toBe(false);
    });

    it("should return false if the chef's hand is empty", () => {
      const chef = generateChef({ hand: [] });
      const ingredient = CardType.Chili;

      const result = gameService.hasIngredientInHand(chef, ingredient);
      expect(result).toBe(false);
    });
  });
});
