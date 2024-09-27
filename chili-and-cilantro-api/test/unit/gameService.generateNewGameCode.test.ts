import {
  IChef,
  IGame,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import sinon from 'sinon';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { Database } from '../../src/services/database';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';

describe('GameService', () => {
  let gameService;
  let mockChefModel;
  let mockGameModel;

  beforeAll(() => {
    const database = new Database();
    mockChefModel = database.getModel<IChef>(ModelName.Chef);
    mockGameModel = database.getModel<IGame>(ModelName.Game);
    const actionService = new ActionService(database);
    const chefService = new ChefService(mockChefModel);
    const playerService = new PlayerService(mockGameModel);
    gameService = new GameService(
      mockGameModel,
      actionService,
      chefService,
      playerService,
    );
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
      sinon.assert.calledWith(countDocumentsStub, {
        code: gameCode,
        currentPhase: { $ne: 'GAME_OVER' },
      });
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
});
