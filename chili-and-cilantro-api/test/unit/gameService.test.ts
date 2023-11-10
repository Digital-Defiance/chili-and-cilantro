import { Database } from '../../src/services/database';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { BaseModel, ModelName, IAction, IGame } from '@chili-and-cilantro/chili-and-cilantro-lib';

jest.mock('../../src/services/database');
jest.mock('../../src/services/action');
jest.mock('../../src/services/chef');
jest.mock('../../src/services/game');
jest.mock('../../src/services/player');

describe('GameService', () => {
  describe('generateGameCode', () => {
    let actionService: ActionService;
    let chefsService: ChefService;
    let gameService: GameService;
    let playerService: PlayerService;
    beforeAll(() => {
      Database.mockImplementation(() => {
        return getModel: jest.fn().mockImplementation((modelName: ModelName) => {
          switch (modelName) {
            case ModelName.Action:
              const ActionModel = BaseModel.getModel<IAction>(modelName);
              return mockingoose(ActionModel).toReturn({}, 'find');
            case ModelName.Game:
              const GameModel = BaseModel.getModel<IGame>(modelName);
              return mockingoose(GameModel).toReturn(0, 'countDocuments');
            default:
              throw new Error(`Model ${modelName} not mocked`);
          }
        });
      });
      const database = new Database();
      actionService = new ActionService(database);
      chefsService = new ChefService(database);
      playerService = new PlayerService(database);
      gameService = new GameService(database, actionService, chefsService, playerService);
    });
    it('should generate a game code that hasnt already been used', () => {

    });
  });

});