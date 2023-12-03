import { Schema } from 'mongoose';
import sinon from 'sinon';
import { GameService } from '../../src/services/game';
import { Database } from '../../src/services/database';
import { generateGame, generateChefGameUser } from '../fixtures/game';
import { generateUser } from '../fixtures/user';
import { generateChef } from '../fixtures/chef';
import { generateObjectId } from '../fixtures/objectId';
import { mockedWithTransactionAsync } from '../fixtures/transactionManager';
import { constants, IGame, ModelName, GamePhase, CardType, TurnAction } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { GameInProgressError } from '../../src/errors/gameInProgress';
import { IncorrectGamePhaseError } from '../../src/errors/incorrectGamePhase';
import { OutOfOrderError } from '../../src/errors/outOfOrder';
import { InvalidActionError } from '../../src/errors/invalidAction';
import { AllCardsPlacedError } from '../../src/errors/allCardsPlaced';
import { OutOfIngredientError } from '../../src/errors/outOfIngredient';

describe('GameService', () => {
  describe('validatePlaceIngredientOrThrow', () => {
    let gameModel;
    let gameService;
    let actionService;
    let chefService;
    let playerService;
    let game;
    let chef;
    let user;

    beforeEach(() => {
      const database = new Database();
      gameModel = database.getModel<IGame>(ModelName.Game);
      actionService = {};
      chefService = {};
      playerService = {};
      gameService = new GameService(gameModel, actionService, chefService, playerService);
      const generated = generateChefGameUser(true, 2, { game: { currentPhase: GamePhase.SETUP, currentChef: 0 } });
      game = generated.game;
      chef = generated.chef;
      user = generated.user;
    });
    it('should throw an error if the game phase is incorrect', () => {
      game.currentPhase = GamePhase.BIDDING;
      expect(() => gameService.validatePlaceIngredientOrThrow(game, chef, CardType.CHILI))
        .toThrow(IncorrectGamePhaseError);
    });

    it('should throw an error if the chef is out of order', () => {
      game.turnOrder = [generateObjectId(), chef._id]; // Chef is not the current chef
      game.currentChef = 0;
      expect(() => gameService.validatePlaceIngredientOrThrow(game, chef, CardType.CHILI))
        .toThrow(OutOfOrderError);
    });

    it('should throw an error if the chef has placed all cards or has no cards left', () => {
      chef.placedCards = new Array(constants.HAND_SIZE).fill({ type: CardType.CHILI, faceUp: false });
      chef.hand = [];
      expect(() => gameService.validatePlaceIngredientOrThrow(game, chef, CardType.CHILI))
        .toThrow(AllCardsPlacedError);
    });

    it('should throw an error if the chef cannot place a card', () => {
      // Mock canPlaceCard to return false
      jest.spyOn(gameService, 'canPlaceCard').mockReturnValue(false);
      expect(() => gameService.validatePlaceIngredientOrThrow(game, chef, CardType.CHILI))
        .toThrow(InvalidActionError);
    });

    it('should throw an error if the chef does not have the specified ingredient', () => {
      chef.hand = [{ type: 'Cilantro', faceUp: false }]; // Chef does not have 'Chili'
      expect(() => gameService.validatePlaceIngredientOrThrow(game, chef, CardType.CHILI))
        .toThrow(OutOfIngredientError);
    });
  });

  describe('placeIngredientAsync', () => {
    let gameModel;
    let gameService;
    let actionService;
    let chefService;
    let playerService;
    let game;
    let chef;

    beforeEach(() => {
      const database = new Database();
      gameModel = database.getModel<IGame>(ModelName.Game);
      actionService = {};
      chefService = {};
      playerService = {};
      gameService = new GameService(gameModel, actionService, chefService, playerService);
      const generated = generateChefGameUser(true, 2, { game: { currentPhase: GamePhase.SETUP, currentChef: 0 } });
      game = generated.game;
      chef = generated.chef;
    });
    it('should successfully place a card', async () => {
      game.currentChef = 0; // Chef is the current chef
      const ingredient = CardType.CHILI;

      const result = await gameService.placeIngredientAsync(game, chef, ingredient);

      expect(result.chef.placedCards).toContainEqual({ type: ingredient, faceUp: false });
      expect(result.chef.hand).not.toContainEqual({ type: ingredient, faceUp: false });
      expect(game.save).toHaveBeenCalled();
      expect(result.game.currentChef).toBe(1); // Check if currentChef index is incremented
    });

    it('should handle the last chef in the turn order', async () => {
      game.currentChef = game.chefIds.length - 1; // Chef is the last in the turn order
      const ingredient = CardType.CHILI;

      const result = await gameService.placeIngredientAsync(game, chef, ingredient);

      expect(game.save).toHaveBeenCalled();
      expect(result.game.currentChef).toBe(0); // Check if currentChef index wraps around
    });

    it('should throw an error if the chef does not have the specified ingredient', async () => {
      chef.hand = [{ type: CardType.CILANTRO, faceUp: false }]; // Chef does not have 'Chili'
      const ingredient = CardType.CHILI;

      await expect(gameService.placeIngredientAsync(game, chef, ingredient))
        .rejects.toThrow(OutOfIngredientError);
    });
  });

  describe('performPlaceIngredientAsync', () => {
    let gameModel;
    let gameService;
    let actionService;
    let chefService;
    let playerService;
    let game;
    let chef;

    beforeEach(() => {
      const database = new Database();
      gameModel = database.getModel<IGame>(ModelName.Game);
      actionService = {};
      chefService = {};
      playerService = {};
      gameService = new GameService(gameModel, actionService, chefService, playerService);
      game = generateGame(true, { currentPhase: GamePhase.SETUP });
      chef = generateChef({ hand: [{ type: CardType.CHILI, faceUp: false }] });
    });
    it('should successfully perform card placement', async () => {
      const ingredient = CardType.CHILI;
      jest.spyOn(gameService, 'validatePlaceIngredientOrThrow').mockImplementation(() => { });
      jest.spyOn(gameService, 'placeIngredientAsync').mockResolvedValue({ game, chef });

      const result = await gameService.performPlaceIngredientAsync(game, chef, ingredient);

      expect(gameService.validatePlaceIngredientOrThrow).toHaveBeenCalledWith(game, chef, ingredient);
      expect(gameService.placeIngredientAsync).toHaveBeenCalledWith(game, chef, ingredient);
      expect(result).toEqual({ game, chef });
    });

    it('should throw an error if validation fails', async () => {
      const ingredient = CardType.CHILI;
      jest.spyOn(gameService, 'validatePlaceIngredientOrThrow').mockImplementation(() => {
        throw new InvalidActionError(TurnAction.PlaceCard);
      });

      await expect(gameService.performPlaceIngredientAsync(game, chef, ingredient))
        .rejects.toThrow(InvalidActionError);
    });

    it('should throw an error if placement fails', async () => {
      const ingredient = CardType.CHILI;
      jest.spyOn(gameService, 'validatePlaceIngredientOrThrow').mockImplementation(() => { });
      jest.spyOn(gameService, 'placeIngredientAsync').mockImplementation(() => {
        throw new Error('Placement failed');
      });

      await expect(gameService.performPlaceIngredientAsync(game, chef, ingredient))
        .rejects.toThrow('Placement failed');
    });

    // Additional test cases...
  });
});
