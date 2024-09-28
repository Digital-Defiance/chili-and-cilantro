import {
  IChefDocument,
  IGameDocument,
  IMessageActionDocument,
  IUserDocument,
  InvalidMessageError,
  ModelName,
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
import { generateGame } from '../fixtures/game';
import { generateUser } from '../fixtures/user';
import { mockedWithTransactionAsync } from '../fixtures/with-transaction';

describe('GameService', () => {
  let application: IApplication;
  let actionService: ActionService;
  let chefService: ChefService;
  let playerService: PlayerService;
  let gameModel: Model<IGameDocument>;
  let gameService: GameService;
  let game: IGameDocument;
  let chef: IChefDocument;
  let user: IUserDocument;

  beforeEach(() => {
    application = new MockApplication();
    gameModel = application.getModel<IGameDocument>(ModelName.Game);
    actionService = {
      sendMessageAsync: jest.fn(),
    } as unknown as ActionService;
    chefService = {
      getGameChefOrThrowAsync: jest.fn(),
    } as unknown as ChefService;
    playerService = new PlayerService(application);
    gameService = new GameService(
      application,
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
      actionService.sendMessageAsync = jest.fn().mockResolvedValue({});

      const result = await gameService.sendMessageAsync(game, chef, message);
      expect(result).toBeDefined(); // Adjust based on your mock return value
      expect(actionService.sendMessageAsync).toHaveBeenCalledWith(
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
        .spyOn(chefService, 'getGameChefOrThrowAsync')
        .mockResolvedValue(chef);
      jest
        .spyOn(gameService, 'validateSendMessageOrThrow')
        .mockImplementation(() => {});
      jest.spyOn(gameService, 'sendMessageAsync').mockResolvedValue({
        /* mock return value */
      } as unknown as IMessageActionDocument);

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

      await expect(async () =>
        gameService.performSendMessageAsync(game.code, user, message),
      ).rejects.toThrow(InvalidMessageError);
    });
  });
});
