import {
  constants,
  IGame,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { InvalidMessageError } from '../../src/errors/invalid-message';
import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import { generateChef } from '../fixtures/chef';
import { generateGame } from '../fixtures/game';
import { mockedWithTransactionAsync } from '../fixtures/transactionManager';
import { generateUser } from '../fixtures/user';

describe('GameService', () => {
  let actionService;
  let chefService;
  let playerService;
  let gameModel;
  let gameService;
  let game;
  let chef;
  let user;

  beforeEach(() => {
    const database = new Database();
    gameModel = database.getModel<IGame>(ModelName.Game);
    actionService = {
      sendMessageAsync: jest.fn(),
    };
    chefService = {
      getGameChefOrThrowAsync: jest.fn(),
    };
    playerService = {};
    gameService = new GameService(
      gameModel,
      actionService,
      chefService,
      playerService,
    );
    game = generateGame(true);
    chef = generateChef();
    user = generateUser();
  });

  describe('validateSendMessageOrThrow', () => {
    it('should not throw an error for a valid message length', () => {
      const message = 'Valid message';
      expect(() =>
        gameService.validateSendMessageOrThrow(message),
      ).not.toThrow();
    });

    it('should throw an error for a message too short', () => {
      const message = 'L'.repeat(constants.MIN_MESSAGE_LENGTH - 1);
      expect(() => gameService.validateSendMessageOrThrow(message)).toThrow(
        InvalidMessageError,
      );
    });

    it('should throw an error for a message too long', () => {
      const message = 'L'.repeat(constants.MAX_MESSAGE_LENGTH + 1);
      expect(() => gameService.validateSendMessageOrThrow(message)).toThrow(
        InvalidMessageError,
      );
    });
  });

  describe('sendMessageAsync', () => {
    it('should successfully send a message', async () => {
      const message = 'L'.repeat(constants.MIN_MESSAGE_LENGTH + 1);
      jest
        .spyOn(gameService.actionService, 'sendMessageAsync')
        .mockResolvedValue({
          /* mock return value */
        });

      const result = await gameService.sendMessageAsync(game, chef, message);
      expect(result).toBeDefined(); // Adjust based on your mock return value
      expect(gameService.actionService.sendMessageAsync).toHaveBeenCalledWith(
        game,
        chef,
        message,
      );
    });
  });

  describe('performSendMessageAsync', () => {
    it('should successfully perform sending a message', async () => {
      const message = 'Valid message';
      jest
        .spyOn(gameService, 'withTransaction')
        .mockImplementation(mockedWithTransactionAsync);
      jest
        .spyOn(gameService, 'getGameByCodeOrThrowAsync')
        .mockResolvedValue(game);
      jest
        .spyOn(gameService.chefService, 'getGameChefOrThrowAsync')
        .mockResolvedValue(chef);
      jest
        .spyOn(gameService, 'validateSendMessageOrThrow')
        .mockImplementation(() => {});
      jest.spyOn(gameService, 'sendMessageAsync').mockResolvedValue({
        /* mock return value */
      });

      const result = await gameService.performSendMessageAsync(
        game.code,
        user,
        message,
      );
      expect(result).toBeDefined(); // Adjust based on your mock return value
      expect(gameService.validateSendMessageOrThrow).toHaveBeenCalledWith(
        message,
      );
      expect(gameService.sendMessageAsync).toHaveBeenCalledWith(
        game,
        chef,
        message,
      );
    });

    it('should throw an error if validation fails', async () => {
      const message = 'L'.repeat(constants.MIN_MESSAGE_LENGTH - 1);
      jest
        .spyOn(gameService, 'validateSendMessageOrThrow')
        .mockImplementation(() => {
          throw new InvalidMessageError();
        });

      await expect(
        gameService.performSendMessageAsync(game.code, user, message),
      ).rejects.toThrow(InvalidMessageError);
    });
  });
});
