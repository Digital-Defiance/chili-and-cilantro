import sinon from 'sinon';
import { ObjectId } from 'mongodb';
import { PlayerService } from '../../src/services/player';
import {
  BaseModel,
  IGame,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';

describe('PlayerService', () => {
  let mockGameModel, playerService;

  beforeAll(() => {
    mockGameModel = BaseModel.getModel<IGame>(ModelName.Game);
    playerService = new PlayerService(mockGameModel);
  });

  describe('isGameHostAsync', () => {
    let countDocumentsStub;

    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      countDocumentsStub.restore();
      jest.restoreAllMocks();
    });

    it('should return true when the user is the host of the game', async () => {
      countDocumentsStub = sinon.stub(mockGameModel, 'countDocuments').returns({
        exec: sinon.stub().resolves(1),
      });
      const gameId = 'aaaaaaaaaaaa';
      const userId = 'bbbbbbbbbbbb';
      const result = await playerService.isGameHostAsync(userId, gameId);
      expect(result).toBe(true);
      sinon.assert.calledOnce(countDocumentsStub);
      sinon.assert.calledWith(countDocumentsStub, {
        _id: new ObjectId(gameId),
        hostUserId: new ObjectId(userId),
      });
    });

    it('should return false when the user is not the host of the game', async () => {
      countDocumentsStub = sinon.stub(mockGameModel, 'countDocuments').returns({
        exec: sinon.stub().resolves(0),
      });
      const gameId = 'aaaaaaaaaaaa';
      const userId = 'bbbbbbbbbbbb';
      const result = await playerService.isGameHostAsync(userId, gameId);
      expect(result).toBe(false);
      sinon.assert.calledOnce(countDocumentsStub);
      sinon.assert.calledWith(countDocumentsStub, {
        _id: new ObjectId(gameId),
        hostUserId: new ObjectId(userId),
      });
    });
    it('should log an error when the aggregate call fails', async () => {
      const error = new Error('aggregate error');
      countDocumentsStub = sinon
        .stub(mockGameModel, 'countDocuments')
        .throws(error);
      const gameId = 'aaaaaaaaaaaa';
      const userId = 'bbbbbbbbbbbb';
      try {
        const result = await playerService.isGameHostAsync(userId, gameId);
        throw new Error('Expected isGameHostAsync to throw an error');
      } catch (caughtError) {
        expect(caughtError).toBe(error);
      }

      expect(console.error).toHaveBeenCalledWith(
        'Error checking if user is host of game:',
        error
      );
      sinon.assert.calledOnce(countDocumentsStub);
    });
  });

  describe('userIsInAnyActiveGameAsync', () => {
    let aggregateStub;

    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      aggregateStub.restore();
      jest.restoreAllMocks();
    });

    it('should return true when the user is in any active game', async () => {
      aggregateStub = sinon
        .stub(mockGameModel, 'aggregate')
        .resolves([{ activeGamesCount: 1 }]);
      const userId = new ObjectId('bbbbbbbbbbbb');
      const result = await playerService.userIsInAnyActiveGameAsync({
        _id: userId,
      });
      expect(result).toBe(true);
      sinon.assert.calledOnce(aggregateStub);
    });

    it('should return false when the user is not in any active game', async () => {
      aggregateStub = sinon.stub(mockGameModel, 'aggregate').resolves([]);
      const userId = new ObjectId('bbbbbbbbbbbb');
      const result = await playerService.userIsInAnyActiveGameAsync({
        _id: userId,
      });
      expect(result).toBe(false);
      sinon.assert.calledOnce(aggregateStub);
    });
    it('should log an error when the aggregate call fails', async () => {
      const error = new Error('aggregate error');
      aggregateStub = sinon.stub(mockGameModel, 'aggregate').throws(error);
      const userId = new ObjectId('bbbbbbbbbbbb');

      try {
        await playerService.userIsInAnyActiveGameAsync({ _id: userId });
        throw new Error(
          'Expected userIsInAnyActiveGameAsync to throw an error'
        );
      } catch (caughtError) {
        expect(caughtError).toBe(error);
      }

      expect(console.error).toHaveBeenCalledWith(
        'Error checking if user is in game:',
        error
      );
      sinon.assert.calledOnce(aggregateStub);
    });
  });

  describe('userIsInGameAsync', () => {
    let aggregateStub;

    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      aggregateStub.restore();
      jest.restoreAllMocks();
    });

    it('should return true when the user is in the specified game', async () => {
      aggregateStub = sinon
        .stub(mockGameModel, 'aggregate')
        .resolves([{ activeGamesCount: 1 }]);
      const userId = new ObjectId('bbbbbbbbbbbb');
      const gameId = new ObjectId('aaaaaaaaaaaa');
      const result = await playerService.userIsInGameAsync(
        userId.toString(),
        gameId.toString()
      );
      expect(result).toBe(true);
      sinon.assert.calledOnce(aggregateStub);
      sinon.assert.calledWith(aggregateStub, [
        {
          $match: {
            _id: new ObjectId(gameId),
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
            'chefDetails.userId': new ObjectId(userId),
          },
        },
        {
          $count: 'activeGamesCount',
        },
      ]);
    });

    it('should look for the aggregate where the game is active when active is true', async () => {
      aggregateStub = sinon
        .stub(mockGameModel, 'aggregate')
        .resolves([{ activeGamesCount: 1 }]);
      const userId = new ObjectId('bbbbbbbbbbbb');
      const gameId = new ObjectId('aaaaaaaaaaaa');
      const result = await playerService.userIsInGameAsync(
        userId.toString(),
        gameId.toString(),
        true
      );
      expect(result).toBe(true);
      sinon.assert.calledOnce(aggregateStub);
      sinon.assert.calledWith(aggregateStub, [
        {
          $match: {
            _id: new ObjectId(gameId),
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
            'chefDetails.userId': new ObjectId(userId),
          },
        },
        {
          $count: 'activeGamesCount',
        },
      ]);
    });

    it('should return false when the user is not in the specified game', async () => {
      aggregateStub = sinon.stub(mockGameModel, 'aggregate').resolves([]);
      const userId = new ObjectId('bbbbbbbbbbbb');
      const gameId = new ObjectId('aaaaaaaaaaaa');
      const result = await playerService.userIsInGameAsync(
        userId.toString(),
        gameId.toString()
      );
      expect(result).toBe(false);
      sinon.assert.calledOnce(aggregateStub);
    });
    it('should log an error when the aggregate call fails', async () => {
      const error = new Error('aggregate error');
      aggregateStub = sinon.stub(mockGameModel, 'aggregate').throws(error);
      const userId = new ObjectId('bbbbbbbbbbbb');
      const gameId = new ObjectId('aaaaaaaaaaaa');
      try {
        await playerService.userIsInGameAsync(
          userId.toString(),
          gameId.toString()
        );
        throw new Error('Expected userIsInGameAsync to throw an error');
      } catch (caughtError) {
        expect(caughtError).toBe(error);
      }

      expect(console.error).toHaveBeenCalledWith(
        'Error checking if user is in the specified game:',
        error
      );
      sinon.assert.calledOnce(aggregateStub);
    });
  });
});
