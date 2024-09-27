import {
  CardType,
  GamePhase,
  IGame,
  ModelName,
  TurnAction,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import mongoose from 'mongoose';
import { InvalidGameError } from '../../src/errors/invalid-game';
import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import { generateChef } from '../fixtures/chef';
import { generateGame } from '../fixtures/game';
import { generateObjectId } from '../fixtures/objectId';

describe('GameService', () => {
  let gameService;
  let mockActionService;
  let mockChefService;
  let mockPlayerService;
  let mockGameModel;

  beforeEach(() => {
    const database = new Database();
    mockGameModel = database.getModel<IGame>(ModelName.Game);
    mockActionService = {};
    mockChefService = {
      getGameChefsByGameOrIdAsync: jest.fn(),
    };
    mockPlayerService = {};
    gameService = new GameService(
      mockGameModel,
      mockActionService,
      mockChefService,
      mockPlayerService,
    );
  });
  describe('getGameByIdOrThrowAsync', () => {
    it('should return a game when found', async () => {
      const mockGame = generateGame();
      jest.spyOn(mockGameModel, 'findOne').mockResolvedValue(mockGame);

      const gameId = new mongoose.Types.ObjectId().toString();
      const result = await gameService.getGameByIdOrThrowAsync(gameId);

      expect(result).toBe(mockGame);
      expect(mockGameModel.findOne).toHaveBeenCalledWith({
        _id: new mongoose.Types.ObjectId(gameId),
      });
    });

    it('should throw InvalidGameError when game is not found', async () => {
      mockGameModel.findOne.mockResolvedValue(null);

      const gameId = new mongoose.Types.ObjectId().toString();

      await expect(gameService.getGameByIdOrThrowAsync(gameId)).rejects.toThrow(
        InvalidGameError,
      );
    });

    it('should search for active games when active parameter is true', async () => {
      const mockGame = generateGame();
      jest.spyOn(mockGameModel, 'findOne').mockResolvedValue(mockGame);

      const gameId = new mongoose.Types.ObjectId().toString();
      await gameService.getGameByIdOrThrowAsync(gameId, true);

      expect(mockGameModel.findOne).toHaveBeenCalledWith({
        _id: new mongoose.Types.ObjectId(gameId),
        currentPhase: { $ne: GamePhase.GAME_OVER },
      });
    });
  });
  describe('getGameByCodeOrThrowAsync', () => {
    it('should return the most recent game when found by code', async () => {
      const mockGame = generateGame();
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGame]),
      };
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = mockGame.code;
      const result = await gameService.getGameByCodeOrThrowAsync(gameCode);

      expect(result).toBe(mockGame);
      expect(mockGameModel.find).toHaveBeenCalledWith({ code: gameCode });
      expect(mockQuery.exec).toHaveBeenCalled();
    });
    it('should throw InvalidGameError when no game is found, returning null', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = 'testCode';

      await expect(
        gameService.getGameByCodeOrThrowAsync(gameCode),
      ).rejects.toThrow(InvalidGameError);
    });
    it('should throw InvalidGameError when no game is found, returning empty array', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = 'testCode';

      await expect(
        gameService.getGameByCodeOrThrowAsync(gameCode),
      ).rejects.toThrow(InvalidGameError);
    });
    it('should search for active games when active parameter is true', async () => {
      const mockGame = generateGame();
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockGame]),
      };
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const gameCode = mockGame.code;
      await gameService.getGameByCodeOrThrowAsync(gameCode, true);

      expect(mockGameModel.find).toHaveBeenCalledWith({
        code: gameCode,
        currentPhase: { $ne: GamePhase.GAME_OVER },
      });
      expect(mockQuery.exec).toHaveBeenCalled();
    });
    it('should return the most recent game when multiple games are found', async () => {
      const gameOne = generateGame();
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([gameOne]),
      };
      jest.spyOn(mockGameModel, 'find').mockReturnValue(mockQuery);

      const result = await gameService.getGameByCodeOrThrowAsync(gameOne.code);

      expect(result).toBe(gameOne);
      expect(mockQuery.exec).toHaveBeenCalled();
    });
  });
  describe('getGameChefNamesByGameIdAsync ', () => {
    it('should return chef names when chefs are found for the game', async () => {
      // Arrange
      const gameId = generateObjectId().toString();
      const mockChefs = [{ name: 'Chef A' }, { name: 'Chef B' }];
      mockChefService.getGameChefsByGameOrIdAsync.mockResolvedValue(mockChefs);

      // Act
      const result = await gameService.getGameChefNamesByGameIdAsync(gameId);

      // Assert
      expect(result).toEqual(['Chef A', 'Chef B']);
      expect(mockChefService.getGameChefsByGameOrIdAsync).toHaveBeenCalledWith(
        gameId,
      );
    });

    it('should return an empty array when no chefs are found for the game', async () => {
      // Arrange
      const gameId = generateObjectId().toString();
      mockChefService.getGameChefsByGameOrIdAsync.mockResolvedValue([]);

      // Act
      const result = await gameService.getGameChefNamesByGameIdAsync(gameId);

      // Assert
      expect(result).toEqual([]);
      expect(mockChefService.getGameChefsByGameOrIdAsync).toHaveBeenCalledWith(
        gameId,
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
      };
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
      gameService.canPlaceCard.mockReturnValue(true);
      gameService.canPass.mockReturnValue(false);
      gameService.canBid.mockReturnValue(false);

      const game = generateGame();
      const chef = generateChef();
      expect(gameService.availableTurnActions(game, chef)).toContain(
        TurnAction.PlaceCard,
      );
    });

    it('should include Pass when the chef can pass', () => {
      gameService.canPlaceCard.mockReturnValue(false);
      gameService.canPass.mockReturnValue(true);
      gameService.canBid.mockReturnValue(false);

      const game = generateGame();
      const chef = generateChef();
      expect(gameService.availableTurnActions(game, chef)).toContain(
        TurnAction.Pass,
      );
    });

    it('should include IncreaseBid when the chef can increase the bid', () => {
      gameService.canPlaceCard.mockReturnValue(false);
      gameService.canPass.mockReturnValue(false);
      gameService.canBid.mockReturnValue(true);

      const chef = generateChef();
      const game = generateGame(true, { currentBid: 1 });
      expect(gameService.availableTurnActions(game, chef)).toContain(
        TurnAction.IncreaseBid,
      );
    });

    it('should include Bid when the chef can make a bid', () => {
      gameService.canPlaceCard.mockReturnValue(false);
      gameService.canPass.mockReturnValue(false);
      gameService.canBid.mockReturnValue(true);

      const game = generateGame(true, { currentBid: 0 });
      const chef = generateChef();
      expect(gameService.availableTurnActions(game, chef)).toContain(
        TurnAction.Bid,
      );
    });

    it('should return an empty array when the chef has no available actions', () => {
      gameService.canPlaceCard.mockReturnValue(false);
      gameService.canPass.mockReturnValue(false);
      gameService.canBid.mockReturnValue(false);

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
      };
      expect(gameService.haveAllRemainingPlayersPassed(game)).toBe(false);
    });

    it('should return true when last non-passing bid is followed by passes from all other chefs', () => {
      const chef1 = generateChef();
      const chef2 = generateChef();
      const game = generateGame(true, {
        currentRound: 0,
        roundBids: {
          0: [
            { chefId: chef1._id, pass: false },
            { chefId: chef2._id, pass: true },
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
            { chefId: chef1._id, pass: false },
            { chefId: chef2._id, pass: false },
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
            { chefId: chef1._id, pass: false },
            { chefId: chef2._id, pass: false },
            { chefId: chef3._id, pass: true },
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
        currentChef: -1,
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
          { type: CardType.CHILI, faceUp: false },
          { type: CardType.CILANTRO, faceUp: false },
        ],
      });
      const ingredient = CardType.CHILI;

      const result = gameService.hasIngredientInHand(chef, ingredient);
      expect(result).toBe(true);
    });

    it('should return false if the chef does not have the ingredient in hand', () => {
      const chef = generateChef({
        hand: [{ type: CardType.CILANTRO, faceUp: false }],
      });
      const ingredient = CardType.CHILI;

      const result = gameService.hasIngredientInHand(chef, ingredient);
      expect(result).toBe(false);
    });

    it("should return false if the chef's hand is empty", () => {
      const chef = generateChef({ hand: [] });
      const ingredient = CardType.CHILI;

      const result = gameService.hasIngredientInHand(chef, ingredient);
      expect(result).toBe(false);
    });
  });
});
