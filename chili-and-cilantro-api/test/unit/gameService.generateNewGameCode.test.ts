import {
  IGameDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Model } from 'mongoose';
import { ActionService } from '../../src/services/action';
import { ChefService } from '../../src/services/chef';
import { GameService } from '../../src/services/game';
import { PlayerService } from '../../src/services/player';
import { MockApplication } from '../fixtures/application';

describe('GameService', () => {
  let application: IApplication;
  let gameService: GameService;
  let mockGameModel: Model<IGameDocument>;

  beforeAll(() => {
    application = new MockApplication();
    const actionService = new ActionService(application);
    const chefService = new ChefService(application);
    const playerService = new PlayerService(application);
    mockGameModel = application.getModel<IGameDocument>(ModelName.Game);
    gameService = new GameService(
      application,
      actionService,
      chefService,
      playerService,
    );
  });

  describe('generateNewGameCodeAsync', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should generate a unique game code', async () => {
      jest.spyOn(mockGameModel, 'countDocuments').mockResolvedValue(0);
      const gameCode = await gameService.generateNewGameCodeAsync();
      expect(gameCode).toBeDefined();
      expect(mockGameModel.countDocuments).toHaveBeenCalledTimes(1);
      expect(mockGameModel.countDocuments).toHaveBeenCalledWith({
        code: gameCode,
        currentPhase: { $ne: 'GAME_OVER' },
      });
    });

    it('should retry generating a game code if the first one is taken', async () => {
      const countDocumentsSpy = jest
        .spyOn(mockGameModel, 'countDocuments')
        .mockResolvedValueOnce(1);
      countDocumentsSpy.mockResolvedValueOnce(0);

      const gameCode = await gameService.generateNewGameCodeAsync();

      expect(gameCode).toBeDefined();

      expect(mockGameModel.countDocuments).toHaveBeenCalledTimes(2);
    });
    it('should throw an error if it cannot generate a unique game code', async () => {
      jest.spyOn(mockGameModel, 'countDocuments').mockResolvedValue(1);
      await expect(async () =>
        gameService.generateNewGameCodeAsync(),
      ).rejects.toThrow();
    });
  });
});
