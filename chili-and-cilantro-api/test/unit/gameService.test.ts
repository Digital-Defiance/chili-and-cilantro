import sinon from 'sinon';
import { Database } from '../../src/services/database';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { BaseModel, IGame, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { AlreadyJoinedOtherError } from '../../src/errors/alreadyJoinedOther';
import { InvalidUserNameError } from '../../src/errors/invalidUserName';
import { createUser } from '../fixtures/user';

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


  describe('generateNewGameCodeAsync', () => {
    let countDocumentsStub;

    beforeEach(() => {
      countDocumentsStub = sinon.stub(mockGameModel, 'countDocuments');
    });

    afterEach(() => {
      countDocumentsStub.restore();
    });

    it('should generate a unique game code', async () => {
      countDocumentsStub.resolves(0);
      const gameCode = await gameService.generateNewGameCodeAsync();
      expect(gameCode).toBeDefined();
      sinon.assert.calledWith(countDocumentsStub, { code: gameCode, currentPhase: { $ne: 'GAME_OVER' } });
    });

    it('should retry generating a game code if the first one is taken', async () => {
      countDocumentsStub.onFirstCall().resolves(1);
      countDocumentsStub.onSecondCall().resolves(0);

      const gameCode = await gameService.generateNewGameCodeAsync();

      expect(gameCode).toBeDefined();
      sinon.assert.calledTwice(countDocumentsStub);
    });
    it('should throw an error if it cannot generate a unique game code', async () => {
      countDocumentsStub.resolves(1);
      await expect(gameService.generateNewGameCodeAsync()).rejects.toThrow();
    });
  });

  describe('validateCreateGameOrThrowAsync', () => {
    let user, userName, gameName, password, maxChefs;

    beforeEach(() => {
      // Setup initial valid parameters
      user = createUser();
      userName = 'ValidUserName';
      gameName = 'ValidGameName';
      password = 'ValidPassword';
      maxChefs = 5; // Assuming this is a valid number within the range
    });

    afterEach(() => {
      // Restore the stub to its original method after each test
      if (gameService.playerService.userIsInAnyActiveGameAsync.restore) {
        gameService.playerService.userIsInAnyActiveGameAsync.restore();
      }
    });

    it('throws an error if user is already in an active game', async () => {
      // Mock the condition where user is in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(true);

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(AlreadyJoinedOtherError);
    });

    it('throws an error for invalid username format', async () => {
      // Mock the condition where user is in an active game
      sinon.stub(gameService.playerService, 'userIsInAnyActiveGameAsync').resolves(false);

      userName = ''; // Set an invalid username

      await expect(gameService.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs))
        .rejects.toThrow(InvalidUserNameError);
    });

    // Similar structure for invalid game name, password, and max chefs
  });
});
