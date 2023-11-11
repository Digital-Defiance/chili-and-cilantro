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
});
