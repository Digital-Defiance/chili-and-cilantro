import sinon from 'sinon';
import { Database } from '../../src/services/database';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { constants, BaseModel, IGame, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { AlreadyJoinedOtherError } from '../../src/errors/alreadyJoinedOther';
import { InvalidUserNameError } from '../../src/errors/invalidUserName';
import { generateUser } from '../fixtures/user';
import { InvalidGameNameError } from 'chili-and-cilantro-api/src/errors/invalidGameName';
import { InvalidGamePasswordError } from 'chili-and-cilantro-api/src/errors/invalidGamePassword';
import { InvalidGameParameterError } from 'chili-and-cilantro-api/src/errors/invalidGameParameter';
import { generateString, numberBetween } from '../fixtures/utils';

describe('GameService', () => {
  let gameService;
  let mockGameModel;

  beforeAll(() => {
    const database = new Database();
    const actionService = new ActionService(database);
    const chefService = new ChefService(database);
    mockGameModel = BaseModel.getModel<IGame>(ModelName.Game);
    const playerService = new PlayerService(mockGameModel);
    gameService = new GameService(mockGameModel, actionService, chefService, playerService);
  });

  describe('validateCreateGameOrThrowAsync', () => {
    let user, userName, gameName, password, maxChefs;

    beforeEach(() => {
      // Setup initial valid parameters
      user = generateUser();
      userName = generateString(constants.MIN_USER_NAME_LENGTH, constants.MAX_USER_NAME_LENGTH);
      gameName = generateString(constants.MIN_GAME_NAME_LENGTH, constants.MAX_GAME_NAME_LENGTH);
      password = generateString(constants.MIN_GAME_PASSWORD_LENGTH, constants.MAX_GAME_PASSWORD_LENGTH);
      maxChefs = numberBetween(constants.MIN_CHEFS, constants.MAX_CHEFS);
    });

    afterEach(() => {
      // Restore the stub to its original method after each test
      if (gameService.playerService.userIsInAnyActiveGameAsync.restore) {
        gameService.playerService.userIsInAnyActiveGameAsync.restore();
      }
    });

    it('should not throw an error when all parameters are valid', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .resolves.not.toThrow();
    });

    it('throws an error if user is already in an active game', async () => {
      // Mock the condition where user is in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(true);

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(AlreadyJoinedOtherError);
    });

    it('should throw an error for an invalid username with special characters', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      userName = '!'.repeat(constants.MIN_USER_NAME_LENGTH + 1); // Set an invalid username with special characters

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidUserNameError);
    });

    it('should throw an error for invalid username that is too short', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      userName = 'x'.repeat(constants.MIN_USER_NAME_LENGTH - 1); // Set an invalid username that is too short

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidUserNameError);
    });

    it('should throw an error for invalid username that is too long', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      userName = 'x'.repeat(constants.MAX_USER_NAME_LENGTH + 1); // Set an invalid username that is too long

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidUserNameError);
    });

    it('should throw an error for an invalid game name with special characters', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      gameName = '!'.repeat(constants.MIN_GAME_NAME_LENGTH + 1); // Set an invalid game name with special characters

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidGameNameError);
    });

    it('should throw an error for invalid game name that is too short', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      gameName = 'x'.repeat(constants.MIN_GAME_NAME_LENGTH - 1); // Set an invalid game name that is too short

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidGameNameError);
    });

    it('should throw an error for invalid game name that is too long', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      gameName = 'x'.repeat(constants.MAX_GAME_NAME_LENGTH + 1); // Set an invalid game name that is too long

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidGameNameError);
    });

    it('should throw an error for invalid password that is too short', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      // generate a string that is constants.MIN_GAME_PASSWORD_LENGTH - 1 characters long
      password = 'x'.repeat(constants.MIN_GAME_PASSWORD_LENGTH - 1);

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidGamePasswordError);
    });

    it('should throw an error for invalid password that is too long', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      // generate a string that is constants.MAX_PASSWORD_LENGTH + 1 characters long
      password = 'x'.repeat(constants.MAX_PASSWORD_LENGTH + 1);

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidGamePasswordError);
    });

    it('should throw an error to too few chefs', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      maxChefs = constants.MIN_CHEFS - 1; // Set an invalid number of chefs by 1 too few

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidGameParameterError);
    });


    it('should throw an error to too many chefs', async () => {
      // Mock the condition where user is not in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      maxChefs = constants.MAX_CHEFS + 1; // Set an invalid number of chefs by 1 too many

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidGameParameterError);
    });
  });
});
