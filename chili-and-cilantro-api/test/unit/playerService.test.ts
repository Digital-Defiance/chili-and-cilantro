import {
  IGameDocument,
  IUserDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Model, Types } from 'mongoose';
import { PlayerService } from '../../src/services/player';
import { MockApplication } from '../fixtures/application';
import { generateObjectId } from '../fixtures/objectId';

describe('PlayerService', () => {
  let application: IApplication;
  let mockGameModel: Model<IGameDocument>;
  let playerService: PlayerService;

  beforeAll(() => {
    application = new MockApplication();
    mockGameModel = application.getModel<IGameDocument>(ModelName.Game);
    playerService = new PlayerService(application);
  });

  describe('isMasterChefAsync', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return true when the user is the host of the game', async () => {
      jest.spyOn(mockGameModel, 'countDocuments').mockResolvedValue(1);
      const gameId = generateObjectId();
      const userId = generateObjectId();
      const result = await playerService.isMasterChefAsync(userId, gameId);
      expect(result).toBe(true);
      expect(mockGameModel.countDocuments).toHaveBeenCalledTimes(1);
      expect(mockGameModel.countDocuments).toHaveBeenCalledWith({
        _id: gameId,
        masterChefUserId: userId,
      });
    });

    it('should return false when the user is not the host of the game', async () => {
      jest.spyOn(mockGameModel, 'countDocuments').mockResolvedValue(0);
      const gameId = generateObjectId();
      const userId = generateObjectId();
      const result = await playerService.isMasterChefAsync(userId, gameId);
      expect(result).toBe(false);
      expect(mockGameModel.countDocuments).toHaveBeenCalledTimes(1);
      expect(mockGameModel.countDocuments).toHaveBeenCalledWith({
        _id: gameId,
        masterChefUserId: userId,
      });
    });
    it('should log an error when the aggregate call fails', async () => {
      const error = new Error('aggregate error');
      jest.spyOn(mockGameModel, 'countDocuments').mockImplementation(() => {
        throw error;
      });
      const gameId = generateObjectId();
      const userId = generateObjectId();
      expect(async () =>
        playerService.isMasterChefAsync(userId, gameId),
      ).rejects.toThrow(error);

      expect(console.error).toHaveBeenCalledWith(
        'Error checking if user is host of game:',
        error,
      );
      expect(mockGameModel.countDocuments).toHaveBeenCalledTimes(1);
    });
  });

  describe('userIsInAnyActiveGameAsync', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return true when the user is in any active game', async () => {
      const aggregateSpy = jest
        .spyOn(mockGameModel, 'aggregate')
        .mockResolvedValue([{ activeGamesCount: 1 }]);
      const userId = generateObjectId();
      const result = await playerService.userIsInAnyActiveGameAsync({
        _id: userId,
      } as IUserDocument);
      expect(result).toBe(true);
      expect(aggregateSpy).toHaveBeenCalledTimes(1);
    });

    it('should return false when the user is not in any active game', async () => {
      const aggregateSpy = jest
        .spyOn(mockGameModel, 'aggregate')
        .mockResolvedValue([]);
      const userId = generateObjectId();
      const result = await playerService.userIsInAnyActiveGameAsync({
        _id: userId,
      } as IUserDocument);
      expect(result).toBe(false);
      expect(aggregateSpy).toHaveBeenCalledTimes(1);
    });
    it('should log an error when the aggregate call fails', async () => {
      const error = new Error('aggregate error');
      jest.spyOn(mockGameModel, 'aggregate').mockImplementation(() => {
        throw error;
      });
      const userId = generateObjectId();

      expect(async () =>
        playerService.userIsInAnyActiveGameAsync({
          _id: userId,
        } as IUserDocument),
      ).rejects.toThrow(error);

      expect(console.error).toHaveBeenCalledWith(
        'Error checking if user is in game:',
        error,
      );
      expect(mockGameModel.aggregate).toHaveBeenCalledTimes(1);
    });
  });

  describe('userIsInGameAsync', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return true when the user is in the specified game', async () => {
      const aggregateSpy = jest
        .spyOn(mockGameModel, 'aggregate')
        .mockResolvedValue([{ activeGamesCount: 1 }]);
      const userId = new Types.ObjectId();
      const gameId = new Types.ObjectId();
      const result = await playerService.userIsInGameAsync(userId, gameId);
      expect(result).toBe(true);
      expect(aggregateSpy).toHaveBeenCalledTimes(1);
      expect(aggregateSpy).toHaveBeenCalledWith([
        {
          $match: {
            _id: gameId,
          },
        },
        {
          $lookup: {
            from: 'chefs',
            localField: 'chefIds',
            foreignField: '_id',
            as: 'chefDetails',
          },
        },
        {
          $unwind: '$chefDetails',
        },
        {
          $match: {
            'chefDetails.userId': userId,
          },
        },
        {
          $count: 'activeGamesCount',
        },
      ]);
    });

    it('should look for the aggregate where the game is active when active is true', async () => {
      const aggregateSpy = jest
        .spyOn(mockGameModel, 'aggregate')
        .mockResolvedValue([{ activeGamesCount: 1 }]);
      const userId = new Types.ObjectId();
      const gameId = new Types.ObjectId();
      const result = await playerService.userIsInGameAsync(
        userId,
        gameId,
        true,
      );
      expect(result).toBe(true);
      expect(aggregateSpy).toHaveBeenCalledTimes(1);
      expect(aggregateSpy).toHaveBeenCalledWith([
        {
          $match: {
            _id: gameId,
            currentPhase: { $ne: 'GAME_OVER' },
          },
        },
        {
          $lookup: {
            from: 'chefs',
            localField: 'chefIds',
            foreignField: '_id',
            as: 'chefDetails',
          },
        },
        {
          $unwind: '$chefDetails',
        },
        {
          $match: {
            'chefDetails.userId': userId,
          },
        },
        {
          $count: 'activeGamesCount',
        },
      ]);
    });

    it('should return false when the user is not in the specified game', async () => {
      const aggregateSpy = jest
        .spyOn(mockGameModel, 'aggregate')
        .mockResolvedValue([]);
      const userId = new Types.ObjectId();
      const gameId = new Types.ObjectId();
      const result = await playerService.userIsInGameAsync(userId, gameId);
      expect(result).toBe(false);
      expect(aggregateSpy).toHaveBeenCalledTimes(1);
    });
    it('should log an error when the aggregate call fails', async () => {
      const error = new Error('aggregate error');
      jest.spyOn(mockGameModel, 'aggregate').mockImplementation(() => {
        throw error;
      });
      const userId = new Types.ObjectId();
      const gameId = new Types.ObjectId();
      expect(async () =>
        playerService.userIsInGameAsync(userId, gameId),
      ).rejects.toThrow(error);

      expect(console.error).toHaveBeenCalledWith(
        'Error checking if user is in the specified game:',
        error,
      );
      expect(mockGameModel.aggregate).toHaveBeenCalledTimes(1);
    });
  });
});
