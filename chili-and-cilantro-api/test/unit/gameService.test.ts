import sinon from 'sinon';
import { Database } from '../../src/services/database';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { BaseModel, IGame, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';

describe('GameService', () => {
  let gameService;
  let mockGameModel;
  let countDocumentsStub;

  beforeAll(() => {
    const database = new Database();
    const actionService = new ActionService(database);
    const chefService = new ChefService(database);
    const playerService = new PlayerService(database);
    mockGameModel = BaseModel.getModel<IGame>(ModelName.Game);
    gameService = new GameService(mockGameModel, actionService, chefService, playerService);
  });

  beforeEach(() => {
    countDocumentsStub = sinon.stub(mockGameModel, 'countDocuments');
  });

  afterEach(() => {
    countDocumentsStub.restore();
  });

  describe('generateNewGameCodeAsync', () => {
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
  });
});
