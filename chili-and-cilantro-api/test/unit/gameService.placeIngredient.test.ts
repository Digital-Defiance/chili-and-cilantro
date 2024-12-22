import {
  AllCardsPlacedError,
  CardType,
  GamePhase,
  IChefDocument,
  IGameDocument,
  IUserDocument,
  IncorrectGamePhaseError,
  InvalidActionError,
  ModelName,
  NotYourTurnError,
  OutOfIngredientError,
  TurnAction,
  constants,
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
import { generateObjectId } from '../fixtures/objectId';
import { mockedWithTransactionAsync } from '../fixtures/with-transaction';

describe('GameService', () => {
  describe('validatePlaceIngredientOrThrow', () => {
    let application: IApplication;
    let gameModel: Model<IGameDocument>;
    let gameService: GameService;
    let actionService: ActionService;
    let chefService: ChefService;
    let playerService: PlayerService;
    let game: IGameDocument;
    let chef: IChefDocument;
    let user: IUserDocument;

    beforeEach(() => {
      application = new MockApplication();
      gameModel = application.getModel<IGameDocument>(ModelName.Game);
      actionService = new ActionService(application);
      chefService = new ChefService(application);
      playerService = new PlayerService(application);
      gameService = new GameService(
        application,
        actionService,
        chefService,
        playerService,
      );
      const generated = generateChefGameUser(true, 2, {
        game: { currentPhase: GamePhase.SETUP, currentChef: 0 },
      });
      game = generated.game;
      chef = generated.chef;
      user = generated.user;
    });
    it('should throw an error if the game phase is incorrect', () => {
      game.currentPhase = GamePhase.BIDDING;
      expect(() =>
        gameService.validatePlaceIngredientOrThrow(game, chef, CardType.Chili),
      ).toThrow(IncorrectGamePhaseError);
    });

    it('should throw an error if the chef is out of order', () => {
      game.turnOrder = [generateObjectId(), chef._id]; // Chef is not the current chef
      game.currentChef = 0;
      expect(() =>
        gameService.validatePlaceIngredientOrThrow(game, chef, CardType.Chili),
      ).toThrow(NotYourTurnError);
    });

    it('should throw an error if the chef has placed all cards or has no cards left', () => {
      chef.placedCards = new Array(constants.HAND_SIZE).fill({
        type: CardType.Chili,
        faceUp: false,
      });
      chef.hand = [];
      expect(() =>
        gameService.validatePlaceIngredientOrThrow(game, chef, CardType.Chili),
      ).toThrow(AllCardsPlacedError);
    });

    it('should throw an error if the chef cannot place a card', () => {
      // Mock canPlaceCard to return false
      jest.spyOn(gameService, 'canPlaceCard').mockReturnValue(false);
      expect(() =>
        gameService.validatePlaceIngredientOrThrow(game, chef, CardType.Chili),
      ).toThrow(InvalidActionError);
    });

    it('should throw an error if the chef does not have the specified ingredient', () => {
      chef.hand = [{ type: CardType.Cilantro, faceUp: false }]; // Chef does not have 'Chili'
      expect(() =>
        gameService.validatePlaceIngredientOrThrow(game, chef, CardType.Chili),
      ).toThrow(OutOfIngredientError);
    });
  });

  describe('placeIngredientAsync', () => {
    let application: IApplication;
    let gameModel: Model<IGameDocument>;
    let gameService: GameService;
    let actionService: ActionService;
    let chefService: ChefService;
    let playerService: PlayerService;
    let game: IGameDocument;
    let chef: IChefDocument;

    beforeEach(() => {
      application = new MockApplication();
      gameModel = application.getModel<IGameDocument>(ModelName.Game);
      actionService = new ActionService(application);
      chefService = new ChefService(application);
      playerService = new PlayerService(application);
      gameService = new GameService(
        application,
        actionService,
        chefService,
        playerService,
      );
      const generated = generateChefGameUser(true, 2, {
        game: { currentPhase: GamePhase.SETUP, currentChef: 0 },
      });
      game = generated.game;
      chef = generated.chef;
    });
    it('should successfully place a card', async () => {
      game.currentChef = 0; // Chef is the current chef
      const ingredient = CardType.Chili;

      const result = await gameService.placeIngredientAsync(
        game,
        chef,
        ingredient,
      );

      expect(result.chef.placedCards).toContainEqual({
        type: ingredient,
        faceUp: false,
      });
      expect(result.chef.hand).not.toContainEqual({
        type: ingredient,
        faceUp: false,
      });
      expect(game.save).toHaveBeenCalled();
      expect(result.game.currentChef).toBe(1); // Check if currentChef index is incremented
    });

    it('should handle the last chef in the turn order', async () => {
      game.currentChef = game.chefIds.length - 1; // Chef is the last in the turn order
      const ingredient = CardType.Chili;

      const result = await gameService.placeIngredientAsync(
        game,
        chef,
        ingredient,
      );

      expect(game.save).toHaveBeenCalled();
      expect(result.game.currentChef).toBe(0); // Check if currentChef index wraps around
    });

    it('should throw an error if the chef does not have the specified ingredient', async () => {
      chef.hand = [{ type: CardType.Cilantro, faceUp: false }]; // Chef does not have 'Chili'
      const ingredient = CardType.Chili;

      await expect(async () =>
        gameService.placeIngredientAsync(game, chef, ingredient),
      ).rejects.toThrow(OutOfIngredientError);
    });
  });

  describe('performPlaceIngredientAsync', () => {
    let application: IApplication;
    let gameModel: Model<IGameDocument>;
    let gameService: GameService;
    let actionService: ActionService;
    let chefService: ChefService;
    let playerService: PlayerService;
    let game: IGameDocument;
    let chef: IChefDocument;

    beforeEach(() => {
      application = new MockApplication();
      gameModel = application.getModel<IGameDocument>(ModelName.Game);
      actionService = new ActionService(application);
      chefService = new ChefService(application);
      playerService = new PlayerService(application);
      gameService = new GameService(
        application,
        actionService,
        chefService,
        playerService,
      );
      game = generateGame(true, { currentPhase: GamePhase.SETUP });
      chef = generateChef({ hand: [{ type: CardType.Chili, faceUp: false }] });
    });
    it('should successfully perform card placement', async () => {
      const ingredient = CardType.Chili;
      jest
        .spyOn(gameService, 'validatePlaceIngredientOrThrow')
        .mockImplementation(() => {});
      jest
        .spyOn(gameService, 'placeIngredientAsync')
        .mockResolvedValue({ game, chef });
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);

      const result = await gameService.performPlaceIngredientAsync(
        game,
        chef,
        ingredient,
      );

      expect(gameService.validatePlaceIngredientOrThrow).toHaveBeenCalledWith(
        game,
        chef,
        ingredient,
      );
      expect(gameService.placeIngredientAsync).toHaveBeenCalledWith(
        game,
        chef,
        ingredient,
      );
      expect(result).toEqual({ game, chef });
    });

    it('should throw an error if validation fails', async () => {
      const ingredient = CardType.Chili;
      jest
        .spyOn(gameService, 'validatePlaceIngredientOrThrow')
        .mockImplementation(() => {
          throw new InvalidActionError(TurnAction.PlaceCard);
        });

      await expect(async () =>
        gameService.performPlaceIngredientAsync(game, chef, ingredient),
      ).rejects.toThrow(InvalidActionError);
    });

    it('should throw an error if placement fails', async () => {
      const ingredient = CardType.Chili;
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);
      jest
        .spyOn(gameService, 'validatePlaceIngredientOrThrow')
        .mockImplementation(() => {});
      jest.spyOn(gameService, 'placeIngredientAsync').mockImplementation(() => {
        throw new Error('Placement failed');
      });

      await expect(async () =>
        gameService.performPlaceIngredientAsync(game, chef, ingredient),
      ).rejects.toThrow('Placement failed');
    });

    // Additional test cases...
  });
});
